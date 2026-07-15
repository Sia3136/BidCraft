jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000); // Neon DB round-trips can exceed default 5s

describe('Auctions and Bidding Integration Tests', () => {
  let sellerToken = '';
  let buyerAToken = '';
  let buyerBToken = '';
  let categoryId = null;
  let listingId = null;
  let auctionId = null;

  beforeAll(async () => {
    // Get category
    const catResult = await db.query("SELECT id FROM categories LIMIT 1");
    categoryId = catResult.rows[0].id;

    // Create seller
    const sellerEmail = `test-seller-auc-${Date.now()}@example.com`;
    const sellerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: sellerEmail, password: 'Password123!', name: 'Seller User' });
    sellerToken = sellerRes.body.accessToken;

    // Create Buyer A
    const buyerAEmail = `test-buyer-a-${Date.now()}@example.com`;
    const buyerARes = await request(app)
      .post('/api/auth/register')
      .send({ email: buyerAEmail, password: 'Password123!', name: 'Buyer A' });
    buyerAToken = buyerARes.body.accessToken;

    // Create Buyer B
    const buyerBEmail = `test-buyer-b-${Date.now()}@example.com`;
    const buyerBRes = await request(app)
      .post('/api/auth/register')
      .send({ email: buyerBEmail, password: 'Password123!', name: 'Buyer B' });
    buyerBToken = buyerBRes.body.accessToken;

    // Pre-authorize Buyer A and Buyer B by registering mock card details
    await request(app)
      .post('/api/payments/save-card')
      .set('Authorization', `Bearer ${buyerAToken}`)
      .send({ razorpay_payment_id: 'pay_mockbuyerA' });

    await request(app)
      .post('/api/payments/save-card')
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({ razorpay_payment_id: 'pay_mockbuyerB' });

    // Create an auction listing

    await db.query("UPDATE users SET email_verified = true");
    const listingRes = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'Test Listing 1',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
          buyingMethod: 'Buy Now',
        price: null
      });
    listingId = listingRes.body.listing.id;
  });

  afterAll(async () => {
    // Cleanup — order matters: dependent tables first, users last
    await db.query("DELETE FROM disputes WHERE order_id IN (SELECT id FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM escrow WHERE order_id IN (SELECT id FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM bids WHERE auction_id IN (SELECT id FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM listings WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-%'");
    await db.pool.end();
  });

  // ─────────────────────────────────────────────
  // LIFECYCLE: Scheduled auction (future start)
  // ─────────────────────────────────────────────
  describe('Auction Lifecycle — Scheduled Status', () => {
    let scheduledAuctionId = null;
    let scheduledListingId = null;

    beforeAll(async () => {
      // Create a new listing for scheduled auction test
      const listingRes = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Listing 1',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
          buyingMethod: 'Buy Now',
          price: null
        });
      scheduledListingId = listingRes.body.listing.id;
    });

    it('should create auction with scheduled status when start_time is in the future', async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const endTime = new Date(Date.now() + 25 * 60 * 60 * 1000); // 25 hours from now

      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          listing_id: scheduledListingId,
          start_bid: 50.00,
          min_bid_increment: 5.00,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.auction.status).toBe('scheduled');
      scheduledAuctionId = res.body.auction.id;
    });

    it('should block bidding on a scheduled (not-yet-started) auction', async () => {
      const res = await request(app)
        .post(`/api/auctions/${scheduledAuctionId}/bids`)
        .set('Authorization', `Bearer ${buyerAToken}`)
        .send({ bid_amount: 60.00 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('auction_not_started');
    });

    it('should allow seller to cancel a scheduled auction', async () => {
      const res = await request(app)
        .put(`/api/auctions/${scheduledAuctionId}/cancel`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.auction.status).toBe('cancelled');
    });

    it('should block bidding on a cancelled auction', async () => {
      const res = await request(app)
        .post(`/api/auctions/${scheduledAuctionId}/bids`)
        .set('Authorization', `Bearer ${buyerAToken}`)
        .send({ bid_amount: 60.00 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('auction_not_active');
    });

    it('should reject cancelling an already-cancelled auction', async () => {
      const res = await request(app)
        .put(`/api/auctions/${scheduledAuctionId}/cancel`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('auction_already_cancelled');
    });
  });

  // ─────────────────────────────────────────────
  // LIFECYCLE: Ended auction (past end_time)
  // ─────────────────────────────────────────────
  describe('Auction Lifecycle — Ended Status', () => {
    let endedAuctionId = null;
    let endedListingId = null;

    beforeAll(async () => {
      // Create a listing for the ended auction test
      const listingRes = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Listing 1',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
          buyingMethod: 'Buy Now',
          price: null
        });
      endedListingId = listingRes.body.listing.id;

      // Insert auction directly with past end_time to simulate ended state
      const pastStart = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const pastEnd = new Date(Date.now() - 60 * 60 * 1000);       // 1 hour ago

      // Get seller_id from the token
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${sellerToken}`);
      const sellerId = meRes.body.user.id;

      const auctionRes = await db.query(
        `INSERT INTO auctions (listing_id, seller_id, start_bid, current_bid, reserve_price, min_bid_increment, start_time, end_time, status, total_bids, created_at, updated_at)
         VALUES ($1, $2, 100.00, NULL, NULL, 10.00, $3, $4, 'active', 0, NOW(), NOW())
         RETURNING *`,
        [endedListingId, sellerId, pastStart.toISOString(), pastEnd.toISOString()]
      );
      endedAuctionId = auctionRes.rows[0].id;
    });

    it('should resolve status as ended when end_time has passed', async () => {
      const res = await request(app).get(`/api/auctions/${endedAuctionId}`);

      expect(res.status).toBe(200);
      expect(res.body.auction.status).toBe('ended');
    });

    it('should block bidding on an ended auction', async () => {
      const res = await request(app)
        .post(`/api/auctions/${endedAuctionId}/bids`)
        .set('Authorization', `Bearer ${buyerAToken}`)
        .send({ bid_amount: 150.00 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('auction_ended');
    });

    it('should block cancelling an ended auction', async () => {
      const res = await request(app)
        .put(`/api/auctions/${endedAuctionId}/cancel`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('cannot_cancel_ended_auction');
    });
  });

  // ─────────────────────────────────────────────
  // ACTIVE AUCTION — existing tests
  // ─────────────────────────────────────────────
  describe('POST /api/auctions', () => {
    it('should create an auction successfully for owner listing', async () => {
      const startTime = new Date();
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 24);

      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          listing_id: listingId,
          start_bid: 100.00,
          reserve_price: 200.00,
          min_bid_increment: 10.00,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.auction).toHaveProperty('id');
      expect(Number(res.body.auction.start_bid)).toBe(100.00);
      // start_time is now or past, so should be 'active'
      expect(res.body.auction.status).toBe('active');
      auctionId = res.body.auction.id;
    });

    it('should fail if listing does not belong to the caller', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${buyerAToken}`)
        .send({
          listing_id: listingId,
          start_bid: 100.00,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 86400000).toISOString()
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/auctions', () => {
    it('should return list of auctions', async () => {
      const res = await request(app)
        .get('/api/auctions');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.auctions)).toBe(true);
    });

    it('should filter auctions by status=active', async () => {
      const res = await request(app)
        .get('/api/auctions?status=active');

      expect(res.status).toBe(200);
      // All returned auctions should have status active
      res.body.auctions.forEach((a) => {
        expect(a.status).toBe('active');
      });
    });
  });

  describe('POST /api/auctions/:id/bids', () => {
    it('should fail if bidder has not pre-authorized their card', async () => {
      // Register a third buyer who does not perform pre-authorization
      const testEmail = `test-no-auth-${Date.now()}@example.com`;
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: 'Password123!', name: 'No PreAuth Buyer' });
      const noAuthToken = registerRes.body.accessToken;

      const res = await request(app)
        .post(`/api/auctions/${auctionId}/bids`)
        .set('Authorization', `Bearer ${noAuthToken}`)
        .send({ bid_amount: 115.00 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('pre_authorization_required');
    });

    it('should place a valid bid successfully', async () => {
      const res = await request(app)
        .post(`/api/auctions/${auctionId}/bids`)
        .set('Authorization', `Bearer ${buyerAToken}`)
        .send({
          bid_amount: 115.00
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.bidAmount).toBe(115.00);
    });

    it('should fail if bid is below starting bid + increment', async () => {
      // Current bid is 115. Min increment is 10. Next bid must be >= 125.
      const res = await request(app)
        .post(`/api/auctions/${auctionId}/bids`)
        .set('Authorization', `Bearer ${buyerBToken}`)
        .send({
          bid_amount: 120.00 // Too low
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('bid_too_low');
    });

    it('should prevent seller from bidding on their own auction', async () => {
      const res = await request(app)
        .post(`/api/auctions/${auctionId}/bids`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          bid_amount: 150.00
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('seller_cannot_bid_on_own_auction');
    });
  });

  describe('Cancel Auction Authorization', () => {
    it('should reject cancel attempt by non-owner', async () => {
      const res = await request(app)
        .put(`/api/auctions/${auctionId}/cancel`)
        .set('Authorization', `Bearer ${buyerAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('unauthorized_action');
    });
  });

  describe('Concurrency Race Condition Tests', () => {
    it('should process concurrent identical bids, allowing only one to succeed', async () => {
      // Current bid is 115. Min increment is 10. Next bid must be >= 125.
      // We will fire two concurrent bids of 130.00 at the same time.
      const bidPromiseA = request(app)
        .post(`/api/auctions/${auctionId}/bids`)
        .set('Authorization', `Bearer ${buyerAToken}`)
        .send({ bid_amount: 130.00 });

      const bidPromiseB = request(app)
        .post(`/api/auctions/${auctionId}/bids`)
        .set('Authorization', `Bearer ${buyerBToken}`)
        .send({ bid_amount: 130.00 });

      const [resA, resB] = await Promise.all([bidPromiseA, bidPromiseB]);

      console.log('CONCURRENCY TEST RESULT A:', resA.status, resA.body);
      console.log('CONCURRENCY TEST RESULT B:', resB.status, resB.body);

      // Assert that exactly one bid succeeded (201) and one failed (400 - bid_too_low)
      const statuses = [resA.status, resB.status].sort();
      expect(statuses).toEqual([201, 400]);

      const successRes = resA.status === 201 ? resA : resB;
      const failRes = resA.status === 400 ? resA : resB;

      expect(successRes.body.success).toBe(true);
      expect(failRes.body.error).toBe('bid_too_low');

      // Verify final auction state
      const auctionRes = await request(app)
        .get(`/api/auctions/${auctionId}`);
      expect(Number(auctionRes.body.auction.current_bid)).toBe(130.00);
      
      // Initially, total_bids was 1 (from the 115 bid). It should now be 2.
      expect(auctionRes.body.auction.total_bids).toBe(2);
    });
  });
});
