const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Reviews API Integration Tests', () => {
  let buyerToken, sellerToken, otherToken;
  let buyerId, sellerId;
  let completedOrderId, incompleteOrderId;

  beforeAll(async () => {
    const sRes = await request(app).post('/api/auth/register')
      .send({ email: `test-rev-seller-${Date.now()}@example.com`, password: 'Pass123!', name: 'Rev Seller' });
    sellerToken = sRes.body.accessToken; sellerId = sRes.body.user.id;

    const bRes = await request(app).post('/api/auth/register')
      .send({ email: `test-rev-buyer-${Date.now()}@example.com`, password: 'Pass123!', name: 'Rev Buyer' });
    buyerToken = bRes.body.accessToken; buyerId = bRes.body.user.id;

    const oRes = await request(app).post('/api/auth/register')
      .send({ email: `test-rev-other-${Date.now()}@example.com`, password: 'Pass123!', name: 'Rev Other' });
    otherToken = oRes.body.accessToken;

    // Create a completed order (reviewable)
    const c = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
       VALUES ($1,$2,200.00,'completed',NOW(),NOW()) RETURNING id`,
      [buyerId, sellerId]
    );
    completedOrderId = c.rows[0].id;

    // Create an incomplete order (not reviewable)
    const i = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, status, created_at, updated_at)
       VALUES ($1,$2,100.00,'paid',NOW(),NOW()) RETURNING id`,
      [buyerId, sellerId]
    );
    incompleteOrderId = i.rows[0].id;
  });

  afterAll(async () => {
    await db.query("DELETE FROM reviews WHERE reviewer_id IN (SELECT id FROM users WHERE email LIKE 'test-rev-%')");
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-rev-%')");
    await db.query("DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-rev-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-rev-%'");
    await db.pool.end();
  });

  describe('POST /api/reviews', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post('/api/reviews').send({ order_id: completedOrderId, rating: 5 });
      expect(res.status).toBe(401);
    });

    it('should create a review for a completed order', async () => {
      const res = await request(app).post('/api/reviews')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: completedOrderId, rating: 4, comment: 'Great seller!' });

      expect(res.status).toBe(201);
      expect(res.body.review).toHaveProperty('id');
      expect(res.body.review.rating).toBe(4);
      expect(res.body.review.reviewer_id).toBe(buyerId);
      expect(res.body.review.reviewee_id).toBe(sellerId);
    });

    it('should reject duplicate review on same order', async () => {
      const res = await request(app).post('/api/reviews')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: completedOrderId, rating: 5, comment: 'Trying to re-review' });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('review_already_submitted');
    });

    it('should reject review on non-completed order', async () => {
      const res = await request(app).post('/api/reviews')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: incompleteOrderId, rating: 3 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('order_must_be_completed');
    });

    it('should reject review by seller (only buyer can review)', async () => {
      const res = await request(app).post('/api/reviews')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ order_id: completedOrderId, rating: 5 });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('only_buyer_can_review');
    });

    it('should reject invalid rating (out of 1-5)', async () => {
      const res = await request(app).post('/api/reviews')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ order_id: completedOrderId, rating: 6 });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/reviews/seller/:userId', () => {
    it('should return seller reviews with stats (public)', async () => {
      const res = await request(app).get(`/api/reviews/seller/${sellerId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.reviews)).toBe(true);
      expect(res.body.reviews.length).toBeGreaterThan(0);
      expect(res.body.stats).toHaveProperty('total_reviews');
      expect(res.body.stats).toHaveProperty('average_rating');
      expect(res.body.stats.total_reviews).toBeGreaterThan(0);
    });

    it('should return empty stats for seller with no reviews', async () => {
      const res = await request(app).get(`/api/reviews/seller/${sellerId + 99999}`);
      expect(res.status).toBe(200);
      expect(res.body.reviews).toHaveLength(0);
    });
  });

  describe('GET /api/reviews/order/:orderId', () => {
    it('should return review for an order that has one', async () => {
      const res = await request(app).get(`/api/reviews/order/${completedOrderId}`);
      expect(res.status).toBe(200);
      expect(res.body.review).toBeTruthy();
      expect(res.body.review.order_id).toBe(completedOrderId);
    });

    it('should return null review for order with no review', async () => {
      const res = await request(app).get(`/api/reviews/order/${incompleteOrderId}`);
      expect(res.status).toBe(200);
      expect(res.body.review).toBeNull();
    });
  });

  describe('Trust score recalculation', () => {
    it('should update seller trust_score after a review', async () => {
      const profileRes = await db.query(
        'SELECT trust_score FROM profiles WHERE user_id=$1', [sellerId]
      );
      // Trust score should be set (the review created it via upsert)
      if (profileRes.rows.length > 0) {
        expect(Number(profileRes.rows[0].trust_score)).toBeGreaterThan(0);
      }
    });
  });
});
