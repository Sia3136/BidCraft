const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Orders API Integration Tests', () => {
  let sellerToken, buyerToken, otherToken;
  let sellerId, buyerId;
  let orderId;

  beforeAll(async () => {
    const sRes = await request(app).post('/api/auth/register')
      .send({ email: `test-ord-seller-${Date.now()}@example.com`, password: 'Pass123!', name: 'Ord Seller' });
    sellerToken = sRes.body.accessToken; sellerId = sRes.body.user.id;

    const bRes = await request(app).post('/api/auth/register')
      .send({ email: `test-ord-buyer-${Date.now()}@example.com`, password: 'Pass123!', name: 'Ord Buyer' });
    buyerToken = bRes.body.accessToken; buyerId = bRes.body.user.id;

    const oRes = await request(app).post('/api/auth/register')
      .send({ email: `test-ord-other-${Date.now()}@example.com`, password: 'Pass123!', name: 'Ord Other' });
    otherToken = oRes.body.accessToken;

    // Create a test order directly in DB
    const orderRes = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, 250.00, 'awaiting_payment', NOW(), NOW()) RETURNING *`,
      [buyerId, sellerId]
    );
    orderId = orderRes.rows[0].id;
  });

  afterAll(async () => {
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-ord-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-ord-%'");
    await db.pool.end();
  });

  describe('GET /api/orders', () => {
    it('should return 401 without auth', async () => {
      expect((await request(app).get('/api/orders')).status).toBe(401);
    });

    it('should return orders for current user as buyer', async () => {
      const res = await request(app).get('/api/orders?role=buyer')
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.orders)).toBe(true);
      expect(res.body.orders.some(o => o.id === orderId)).toBe(true);
    });

    it('should return orders for current user as seller', async () => {
      const res = await request(app).get('/api/orders?role=seller')
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.orders.some(o => o.id === orderId)).toBe(true);
    });

    it('should return empty array for unrelated user', async () => {
      const res = await request(app).get('/api/orders')
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.status).toBe(200);
      expect(res.body.orders).toHaveLength(0);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order for buyer', async () => {
      const res = await request(app).get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.order.id).toBe(orderId);
    });

    it('should return order for seller', async () => {
      const res = await request(app).get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(200);
    });

    it('should return 403 for unrelated user', async () => {
      const res = await request(app).get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app).get('/api/orders/99999')
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should allow buyer to cancel awaiting_payment order', async () => {
      // Create a fresh cancellable order
      const oRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, 100.00, 'awaiting_payment', NOW(), NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const cancelId = oRes.rows[0].id;

      const res = await request(app).patch(`/api/orders/${cancelId}/status`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ status: 'cancelled' });

      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe('cancelled');
    });

    it('should allow seller to ship a paid order', async () => {
      const oRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, 200.00, 'paid', NOW(), NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const shipId = oRes.rows[0].id;

      const res = await request(app).patch(`/api/orders/${shipId}/status`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ status: 'shipped' });

      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe('shipped');
    });

    it('should allow buyer to confirm delivery on shipped order', async () => {
      const oRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, 300.00, 'shipped', NOW(), NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const deliverId = oRes.rows[0].id;

      const res = await request(app).patch(`/api/orders/${deliverId}/status`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ status: 'delivered' });

      expect(res.status).toBe(200);
      // Auto-completes after delivery confirmation
      expect(res.body.order.status).toBe('completed');
    });

    it('should reject seller trying to mark delivered', async () => {
      const oRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, 300.00, 'shipped', NOW(), NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const res = await request(app).patch(`/api/orders/${oRes.rows[0].id}/status`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ status: 'delivered' });
      expect(res.status).toBe(403);
    });

    it('should reject invalid status transition (awaiting_payment → shipped)', async () => {
      const res = await request(app).patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ status: 'shipped' });
      expect(res.status).toBe(400);
    });

    it('should return 403 for unrelated user', async () => {
      const res = await request(app).patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ status: 'cancelled' });
      expect(res.status).toBe(403);
    });
  });
});
