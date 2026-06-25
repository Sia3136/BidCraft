jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Auction Settlement Integration Tests', () => {
  let sellerToken, buyerAToken, buyerBToken;
  let categoryId, sellerId, buyerAId;

  beforeAll(async () => {
    const catRes = await db.query('SELECT id FROM categories LIMIT 1');
    categoryId = catRes.rows[0].id;

    const sellerRes = await request(app).post('/api/auth/register')
      .send({ email: `test-settle-seller-${Date.now()}@example.com`, password: 'Pass123!', name: 'Settle Seller' });
    sellerToken = sellerRes.body.accessToken;
    sellerId = sellerRes.body.user.id;

    const buyerARes = await request(app).post('/api/auth/register')
      .send({ email: `test-settle-buyerA-${Date.now()}@example.com`, password: 'Pass123!', name: 'Settle BuyerA' });
    buyerAToken = buyerARes.body.accessToken;
    buyerAId = buyerARes.body.user.id;

    const buyerBRes = await request(app).post('/api/auth/register')
      .send({ email: `test-settle-buyerB-${Date.now()}@example.com`, password: 'Pass123!', name: 'Settle BuyerB' });
    buyerBToken = buyerBRes.body.accessToken;
  });

  afterAll(async () => {
    await db.query("DELETE FROM disputes WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%'))");
    await db.query("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%'))");
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%')");
    await db.query("DELETE FROM bids WHERE bidder_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%')");
    await db.query("DELETE FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%')");
    await db.query("DELETE FROM listings WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%')");
    await db.query("DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-settle-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-settle-%'");
    await db.pool.end();
  });

  async function createAuctionWithBid({ endedAlready = true, placeBid = true, reservePrice = null } = {}) {
    // Create listing
    const lRes = await request(app).post('/api/listings').set('Authorization', `Bearer ${sellerToken}`)
      .send({ title: `Settle Test Listing ${Date.now()}`, category_id: categoryId, condition: 'New',
              photos: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg', 'https://example.com/p3.jpg', 'https://example.com/p4.jpg', 'https://example.com/p5.jpg', 'https://example.com/p6.jpg'], listing_type: 'auction' });
    const listingId = lRes.body.listing.id;

    // Create auction with past end_time if endedAlready
    const startTime = new Date(Date.now() - 2 * 3600000);
    const endTime   = endedAlready ? new Date(Date.now() - 1000) : new Date(Date.now() + 3600000);

    const aRes = await db.query(
      `INSERT INTO auctions (listing_id, seller_id, start_bid, min_bid_increment, start_time, end_time, status, total_bids, reserve_price, created_at, updated_at)
       VALUES ($1,$2,100.00,10.00,$3,$4,'active',0,$5,NOW(),NOW()) RETURNING *`,
      [listingId, sellerId, startTime.toISOString(), endTime.toISOString(), reservePrice]
    );
    const auctionId = aRes.rows[0].id;

    if (placeBid) {
      await db.query(
        `INSERT INTO bids (auction_id, bidder_id, bid_amount, created_at) VALUES ($1,$2,150.00,NOW())`,
        [auctionId, buyerAId]
      );
      await db.query(
        `UPDATE auctions SET current_bid=150.00, total_bids=1 WHERE id=$1`, [auctionId]
      );
    }

    return { auctionId, listingId };
  }

  describe('POST /api/auctions/:id/settle', () => {
    it('should settle an ended auction with bids and create an order', async () => {
      const { auctionId } = await createAuctionWithBid();

      const res = await request(app)
        .post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settled).toBe(true);
      expect(res.body.order).toBeTruthy();
      expect(Number(res.body.order.total_amount)).toBe(150);
      expect(res.body.order.buyer_id).toBe(buyerAId);
      expect(res.body.reason).toBe('settled');
    });

    it('should be idempotent — calling settle twice returns same order', async () => {
      const { auctionId } = await createAuctionWithBid();

      const res1 = await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);
      const res2 = await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.order.id).toBe(res2.body.order.id);
    });

    it('should handle no-bid auction gracefully', async () => {
      const { auctionId } = await createAuctionWithBid({ placeBid: false });

      const res = await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settled).toBe(true);
      expect(res.body.order).toBeNull();
      expect(res.body.reason).toBe('no_bids');
    });

    it('should handle reserve price not met', async () => {
      const { auctionId } = await createAuctionWithBid({ reservePrice: 500 }); // bid was 150 < 500

      const res = await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settled).toBe(true);
      expect(res.body.order).toBeNull();
      expect(res.body.reason).toBe('reserve_not_met');
    });

    it('should reject settle attempt by non-seller', async () => {
      const { auctionId } = await createAuctionWithBid();

      const res = await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${buyerAToken}`);

      expect(res.status).toBe(403);
    });

    it('should reject settle on auction not yet ended', async () => {
      const { auctionId } = await createAuctionWithBid({ endedAlready: false });

      const res = await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settled).toBe(false);
      expect(res.body.reason).toBe('auction_not_ended');
    });

    it('should mark listing as sold after settlement', async () => {
      const { auctionId, listingId } = await createAuctionWithBid();

      await request(app).post(`/api/auctions/${auctionId}/settle`)
        .set('Authorization', `Bearer ${sellerToken}`);

      const listingRes = await request(app).get(`/api/listings/${listingId}`);
      expect(listingRes.body.listing.status).toBe('sold');
    });

    it('should return 401 without authentication', async () => {
      const { auctionId } = await createAuctionWithBid();
      const res = await request(app).post(`/api/auctions/${auctionId}/settle`);
      expect(res.status).toBe(401);
    });
  });
});
