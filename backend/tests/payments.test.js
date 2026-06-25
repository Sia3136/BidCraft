jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Payments API Integration Tests', () => {
  let sellerToken, buyerToken;
  let sellerId, buyerId;
  let orderId;

  beforeAll(async () => {
    const sRes = await request(app).post('/api/auth/register')
      .send({ email: `test-pay-seller-${Date.now()}@example.com`, password: 'Pass123!', name: 'Pay Seller' });
    sellerToken = sRes.body.accessToken; sellerId = sRes.body.user.id;

    const bRes = await request(app).post('/api/auth/register')
      .send({ email: `test-pay-buyer-${Date.now()}@example.com`, password: 'Pass123!', name: 'Pay Buyer' });
    buyerToken = bRes.body.accessToken; buyerId = bRes.body.user.id;

    // Create a test order
    const oRes = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, 500.00, 'awaiting_payment', NOW(), NOW()) RETURNING id`,
      [buyerId, sellerId]
    );
    orderId = oRes.rows[0].id;
  });

  afterAll(async () => {
    await db.query("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-pay-%'))");
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-pay-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-pay-%'");
    await db.pool.end();
  });

  describe('POST /api/payments/create-order', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post('/api/payments/create-order')
        .send({ order_id: orderId });
      expect(res.status).toBe(401);
    });

    it('should create a Razorpay payment order (mock mode)', async () => {
      const res = await request(app).post('/api/payments/create-order')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: orderId });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('provider_order_id');
      expect(res.body.provider_order_id).toMatch(/^mock_rporder_/);
      expect(res.body.amount).toBe('500.00');
      expect(res.body).toHaveProperty('key_id');
    });

    it('should return existing pending payment if already created (idempotent)', async () => {
      const res1 = await request(app).post('/api/payments/create-order')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: orderId });
      const res2 = await request(app).post('/api/payments/create-order')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: orderId });

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      // Both should reference the same provider order
      expect(res1.body.provider_order_id).toBe(res2.body.provider_order_id);
    });

    it('should reject if requester is not the buyer', async () => {
      const res = await request(app).post('/api/payments/create-order')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ order_id: orderId });
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/payments/verify', () => {
    let providerOrderId;

    beforeAll(async () => {
      const res = await request(app).post('/api/payments/create-order')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: orderId });
      providerOrderId = res.body.provider_order_id;
    });

    it('should verify mock signature and mark order as paid', async () => {
      const razorpay_payment_id = `mock_pay_${Date.now()}`;
      const razorpay_signature  = `mock_sig_${providerOrderId}_${razorpay_payment_id}`;

      const res = await request(app).post('/api/payments/verify')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          razorpay_order_id:  providerOrderId,
          razorpay_payment_id,
          razorpay_signature,
          order_id: orderId
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('paid');

      // Verify DB state
      const orderRes = await db.query('SELECT status FROM orders WHERE id=$1', [orderId]);
      expect(orderRes.rows[0].status).toBe('paid');
    });

    it('should reject invalid signature', async () => {
      const res = await request(app).post('/api/payments/verify')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          razorpay_order_id:   'fake_order',
          razorpay_payment_id: 'fake_pay',
          razorpay_signature:  'wrong_signature',
          order_id: orderId
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_payment_signature');
    });
  });

  describe('GET /api/payments/order/:orderId', () => {
    it('should return payment records for an order', async () => {
      const res = await request(app).get(`/api/payments/order/${orderId}`)
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.payments)).toBe(true);
      expect(res.body.payments.length).toBeGreaterThan(0);
      // Sensitive fields should NOT be exposed
      res.body.payments.forEach(p => {
        expect(p).not.toHaveProperty('razorpay_order_id');
      });
    });

    it('should return 403 for unrelated user', async () => {
      const unrelatedRes = await request(app).post('/api/auth/register')
        .send({ email: `test-pay-unrelated-${Date.now()}@example.com`, password: 'Pass123!', name: 'Unrelated' });
      const res = await request(app).get(`/api/payments/order/${orderId}`)
        .set('Authorization', `Bearer ${unrelatedRes.body.accessToken}`);
      expect(res.status).toBe(403);
      // cleanup
      await db.query("DELETE FROM users WHERE email LIKE 'test-pay-unrelated-%'");
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('should handle payment.captured webhook event', async () => {
      const newOrderRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1,$2,100.00,'awaiting_payment',NOW(),NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const webhookOrderId = newOrderRes.rows[0].id;

      const payload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'mock_whpay_123',
              order_id: 'mock_rporder_webhook',
              notes: { bidcraft_order_id: String(webhookOrderId) }
            }
          }
        }
      };

      const res = await request(app).post('/api/payments/webhook')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
    });
  });
});
