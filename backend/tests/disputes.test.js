const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Disputes API Integration Tests', () => {
  let buyerToken, sellerToken, otherToken;
  let buyerId, sellerId;
  let paidOrderId, pendingOrderId;

  beforeAll(async () => {
    const sRes = await request(app).post('/api/auth/register')
      .send({ email: `test-disp-seller-${Date.now()}@example.com`, password: 'Pass123!', name: 'Disp Seller' });
    sellerToken = sRes.body.accessToken; sellerId = sRes.body.user.id;

    const bRes = await request(app).post('/api/auth/register')
      .send({ email: `test-disp-buyer-${Date.now()}@example.com`, password: 'Pass123!', name: 'Disp Buyer' });
    buyerToken = bRes.body.accessToken; buyerId = bRes.body.user.id;

    const oRes = await request(app).post('/api/auth/register')
      .send({ email: `test-disp-other-${Date.now()}@example.com`, password: 'Pass123!', name: 'Disp Other' });
    otherToken = oRes.body.accessToken;

    // Paid order (eligible for dispute)
    const p = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
       VALUES ($1,$2,300.00,'paid',NOW(),NOW()) RETURNING id`,
      [buyerId, sellerId]
    );
    paidOrderId = p.rows[0].id;

    // Pending order (not eligible)
    const pend = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
       VALUES ($1,$2,50.00,'pending',NOW(),NOW()) RETURNING id`,
      [buyerId, sellerId]
    );
    pendingOrderId = pend.rows[0].id;
  });

  afterAll(async () => {
    await db.query("DELETE FROM disputes WHERE initiator_id IN (SELECT id FROM users WHERE email LIKE 'test-disp-%')");
    await db.query("DELETE FROM escrow WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-disp-%'))");
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-disp-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-disp-%'");
    await db.pool.end();
  });

  let disputeId;

  describe('POST /api/disputes', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post('/api/disputes')
        .send({ order_id: paidOrderId, reason: 'Item not received' });
      expect(res.status).toBe(401);
    });

    it('should open a dispute on a paid order', async () => {
      const res = await request(app).post('/api/disputes')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          order_id: paidOrderId,
          reason: 'Item not received after 2 weeks',
          evidence_urls: ['https://example.com/screenshot.jpg']
        });

      expect(res.status).toBe(201);
      expect(res.body.dispute).toHaveProperty('id');
      expect(res.body.dispute.status).toBe('open');
      disputeId = res.body.dispute.id;
    });

    it('should reject duplicate open dispute on same order', async () => {
      const res = await request(app).post('/api/disputes')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: paidOrderId, reason: 'Duplicate' });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('dispute_already_open');
    });

    it('should reject dispute on non-eligible order (pending)', async () => {
      const res = await request(app).post('/api/disputes')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: pendingOrderId, reason: 'Premature dispute' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('order_not_eligible_for_dispute');
    });

    it('should reject dispute by unrelated user', async () => {
      const freshOrderRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1,$2,100.00,'paid',NOW(),NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const res = await request(app).post('/api/disputes')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ order_id: freshOrderRes.rows[0].id, reason: 'Unauthorized' });
      expect(res.status).toBe(403);
    });

    it('should reject dispute with missing reason', async () => {
      const freshOrderRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1,$2,100.00,'paid',NOW(),NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const res = await request(app).post('/api/disputes')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: freshOrderRes.rows[0].id });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/disputes', () => {
    it('should return current user disputes', async () => {
      const res = await request(app).get('/api/disputes')
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.disputes)).toBe(true);
      expect(res.body.disputes.length).toBeGreaterThan(0);
    });

    it('should return 401 without auth', async () => {
      expect((await request(app).get('/api/disputes')).status).toBe(401);
    });
  });

  describe('GET /api/disputes/:id', () => {
    it('should return dispute for buyer', async () => {
      const res = await request(app).get(`/api/disputes/${disputeId}`)
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.dispute.id).toBe(disputeId);
    });

    it('should return dispute for seller', async () => {
      const res = await request(app).get(`/api/disputes/${disputeId}`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(200);
    });

    it('should return 403 for unrelated user', async () => {
      const res = await request(app).get(`/api/disputes/${disputeId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent dispute', async () => {
      const res = await request(app).get('/api/disputes/99999')
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/disputes/:id/status', () => {
    it('should update dispute status to review', async () => {
      const res = await request(app).patch(`/api/disputes/${disputeId}/status`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ status: 'review' });

      expect(res.status).toBe(200);
      expect(res.body.dispute.status).toBe('review');
    });

    it('should resolve a dispute with resolution note', async () => {
      const res = await request(app).patch(`/api/disputes/${disputeId}/status`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ status: 'resolved', resolution: 'Refund issued to buyer' });

      expect(res.status).toBe(200);
      expect(res.body.dispute.status).toBe('resolved');
      expect(res.body.dispute.resolution).toBe('Refund issued to buyer');
      expect(res.body.dispute.resolved_by).toBe(buyerId);
    });

    it('should reject status update on already-resolved dispute', async () => {
      const res = await request(app).patch(`/api/disputes/${disputeId}/status`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ status: 'dismissed' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('dispute_already_closed');
    });

    it('should return 403 for unrelated user', async () => {
      // Create a fresh open dispute
      const freshPaidRes = await db.query(
        `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
         VALUES ($1,$2,100.00,'paid',NOW(),NOW()) RETURNING id`,
        [buyerId, sellerId]
      );
      const dispRes = await request(app).post('/api/disputes')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: freshPaidRes.rows[0].id, reason: 'Testing auth' });

      const res = await request(app).patch(`/api/disputes/${dispRes.body.dispute.id}/status`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ status: 'review' });
      expect(res.status).toBe(403);
    });
  });
});
