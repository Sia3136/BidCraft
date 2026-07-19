jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000); // Neon DB round-trips can exceed default 5s

describe('Auctions and Bidding Integration Tests', () => {
  let sellerToken = '';
  let sellerId = null;
  let buyerAToken = '';
  let buyerAId = null;
  let buyerBToken = '';
  let buyerBId = null;
  let noAuthToken = '';
  let noAuthId = null;
  let categoryId = null;
  let activeListingId = null;
  let activeAuctionId = null;

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
    sellerId = sellerRes.body.user.id;

    // Create Buyer A
    const buyerAEmail = `test-buyer-a-${Date.now()}@example.com`;
    const buyerARes = await request(app)
      .post('/api/auth/register')
      .send({ email: buyerAEmail, password: 'Password123!', name: 'Buyer A' });
    buyerAToken = buyerARes.body.accessToken;
    buyerAId = buyerARes.body.user.id;

    // Create Buyer B
    const buyerBEmail = `test-buyer-b-${Date.now()}@example.com`;
    const buyerBRes = await request(app)
      .post('/api/auth/register')
      .send({ email: buyerBEmail, password: 'Password123!', name: 'Buyer B' });
    buyerBToken = buyerBRes.body.accessToken;
    buyerBId = buyerBRes.body.user.id;

    // Create Third Buyer without pre-auth
    const testEmail = `test-no-auth-${Date.now()}@example.com`;
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'Password123!', name: 'No PreAuth Buyer' });
    noAuthToken = registerRes.body.accessToken;
    noAuthId = registerRes.body.user.id;
    await db.query('INSERT INTO profiles (user_id, is_verified) VALUES ($1, true)', [noAuthId]);
    await db.query("UPDATE users SET email_verified = true WHERE email = $1", [testEmail]);

    // Pre-authorize Buyer A and Buyer B by registering mock card details
    await request(app)
      .post('/api/payments/save-card')
      .set('Authorization', `Bearer ${buyerAToken}`)
      .send({ razorpay_payment_id: 'pay_mockbuyerA' });

    await request(app)
      .post('/api/payments/save-card')
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({ razorpay_payment_id: 'pay_mockbuyerB' });

    await db.query("UPDATE users SET email_verified = true");
  });

  afterAll(async () => {
    // Cleanup — order matters: dependent tables first, users last
    await db.query("DELETE FROM disputes WHERE order_id IN (SELECT id FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM escrow WHERE order_id IN (SELECT id FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM orders WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    
    await db.query("DELETE FROM bid_deposits WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM bids WHERE auction_id IN (SELECT id FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%'))");
    await db.query("DELETE FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM listings WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    
    await db.query("DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-%'");
    await db.pool.end();
  });

  // =====================================================================
  // 1. PRODUCTION WORKFLOW TESTS
  // =====================================================================
  describe('1. Production Workflow Tests', () => {
    it('should automatically create an auction when POST /api/listings is called with buyingMethod: Auction', async () => {
      const listingRes = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Active Workflow Test Listing',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg'],
          buyingMethod: 'Auction',
          price: 100.00,
          auctionEndsAt: new Date(Date.now() + 86400000).toISOString()
        });
      expect(listingRes.status).toBe(201);
      activeListingId = listingRes.body.listing.id;

      // Verify that the database automatically created an auction for this listing
      const auctionQuery = await db.query('SELECT * FROM auctions WHERE listing_id = $1', [activeListingId]);
      expect(auctionQuery.rows.length).toBe(1);
      
      const autoCreatedAuction = auctionQuery.rows[0];
      expect(autoCreatedAuction.status).toBe('active');
      expect(Number(autoCreatedAuction.start_bid)).toBe(100.00);
      
      activeAuctionId = autoCreatedAuction.id;

      // Insert deposits for Buyer A and B for this auction
      await db.query(`INSERT INTO bid_deposits (auction_id, user_id, amount, status, razorpay_payment_id, created_at, updated_at) VALUES ($1, $2, 50.00, 'held', 'pay_mock', NOW(), NOW())`, [activeAuctionId, buyerAId]);
      await db.query(`INSERT INTO bid_deposits (auction_id, user_id, amount, status, razorpay_payment_id, created_at, updated_at) VALUES ($1, $2, 50.00, 'held', 'pay_mock', NOW(), NOW())`, [activeAuctionId, buyerBId]);
    });

    it('should return 409 Conflict if POST /api/auctions is called on an auto-created auction listing', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          listing_id: activeListingId,
          start_bid: 100.00,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 86400000).toISOString()
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('auction_already_exists_for_listing');
    });

    it('should return 400 Bad Request if POST /api/auctions is called on a fixed-price listing', async () => {
      const fixedListingRes = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Fixed Price Test Listing',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg'],
          buyingMethod: 'Buy Now',
          price: 150.00
        });
      expect(fixedListingRes.status).toBe(201);
      const fixedListingId = fixedListingRes.body.listing.id;

      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          listing_id: fixedListingId,
          start_bid: 100.00,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 86400000).toISOString()
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('listing_type_must_be_auction');
    });
  });

  // =====================================================================
  // 2. AUCTION STATE TESTS
  // =====================================================================
  describe('2. Auction State Tests', () => {
    describe('Active State', () => {
      it('should fail if bidder has not placed a deposit', async () => {
        const res = await request(app)
          .post(`/api/auctions/${activeAuctionId}/bids`)
          .set('Authorization', `Bearer ${noAuthToken}`)
          .send({ bid_amount: 115.00 });
  
        expect(res.status).toBe(402);
        expect(res.body.error).toBe('A deposit is required to place a bid on this auction.');
      });
  
      it('should place a valid bid successfully', async () => {
        const res = await request(app)
          .post(`/api/auctions/${activeAuctionId}/bids`)
          .set('Authorization', `Bearer ${buyerAToken}`)
          .send({ bid_amount: 115.00 });
  
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
      });
  
      it('should fail if bid is below starting bid + increment', async () => {
        const res = await request(app)
          .post(`/api/auctions/${activeAuctionId}/bids`)
          .set('Authorization', `Bearer ${buyerBToken}`)
          .send({ bid_amount: 120.00 });
  
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('bid_too_low');
      });
  
      it('should prevent seller from bidding on their own auction', async () => {
        const res = await request(app)
          .post(`/api/auctions/${activeAuctionId}/bids`)
          .set('Authorization', `Bearer ${sellerToken}`)
          .send({ bid_amount: 150.00 });
  
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('seller_cannot_bid_on_own_auction');
      });

      it('should reject cancel attempt by non-owner', async () => {
        const res = await request(app)
          .put(`/api/auctions/${activeAuctionId}/cancel`)
          .set('Authorization', `Bearer ${buyerAToken}`);
  
        expect(res.status).toBe(403);
      });

      it('should process concurrent identical bids, allowing only one to succeed', async () => {
        const bidPromiseA = request(app)
          .post(`/api/auctions/${activeAuctionId}/bids`)
          .set('Authorization', `Bearer ${buyerAToken}`)
          .send({ bid_amount: 130.00 });
  
        const bidPromiseB = request(app)
          .post(`/api/auctions/${activeAuctionId}/bids`)
          .set('Authorization', `Bearer ${buyerBToken}`)
          .send({ bid_amount: 130.00 });
  
        const [resA, resB] = await Promise.all([bidPromiseA, bidPromiseB]);
  
        const statuses = [resA.status, resB.status].sort();
        expect(statuses).toEqual([201, 400]);
  
        const auctionRes = await request(app).get(`/api/auctions/${activeAuctionId}`);
        expect(Number(auctionRes.body.auction.current_bid)).toBe(130.00);
      });
    });

    describe('Scheduled State', () => {
      let scheduledAuctionId = null;

      beforeAll(async () => {
        // Create an auction natively via public endpoint
        const listingRes = await request(app)
          .post('/api/listings')
          .set('Authorization', `Bearer ${sellerToken}`)
          .send({
            title: 'Scheduled Test Listing',
            description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            category: 'Art',
            subcategory: 'Paintings',
            imageUrls: ['https://example.com/p1.jpg'],
            buyingMethod: 'Auction',
            price: 100.00,
            auctionEndsAt: new Date(Date.now() + 86400000).toISOString()
          });
        
        const listingId = listingRes.body.listing.id;
        const auctionQuery = await db.query('SELECT id FROM auctions WHERE listing_id = $1', [listingId]);
        scheduledAuctionId = auctionQuery.rows[0].id;

        // Manually update the start_time to the future to simulate scheduled state (no INSERT or DELETE used)
        const futureStart = new Date(Date.now() + 3600000).toISOString();
        await db.query(`UPDATE auctions SET start_time = $1, status = 'scheduled' WHERE id = $2`, [futureStart, scheduledAuctionId]);
        
        await db.query(`INSERT INTO bid_deposits (auction_id, user_id, amount, status, razorpay_payment_id, created_at, updated_at) VALUES ($1, $2, 50.00, 'held', 'pay_mock', NOW(), NOW())`, [scheduledAuctionId, buyerAId]);
      });

      it('should block bidding on a scheduled (not-yet-started) auction', async () => {
        const res = await request(app)
          .post(`/api/auctions/${scheduledAuctionId}/bids`)
          .set('Authorization', `Bearer ${buyerAToken}`)
          .send({ bid_amount: 115.00 });
  
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

      it('should reject cancelling an already-cancelled auction', async () => {
        const res = await request(app)
          .put(`/api/auctions/${scheduledAuctionId}/cancel`)
          .set('Authorization', `Bearer ${sellerToken}`);
  
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('auction_already_cancelled');
      });
    });

    describe('Ended State', () => {
      let endedAuctionId = null;

      beforeAll(async () => {
        // Create an auction natively via public endpoint
        const listingRes = await request(app)
          .post('/api/listings')
          .set('Authorization', `Bearer ${sellerToken}`)
          .send({
            title: 'Ended Test Listing',
            description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            category: 'Art',
            subcategory: 'Paintings',
            imageUrls: ['https://example.com/p1.jpg'],
            buyingMethod: 'Auction',
            price: 100.00,
            auctionEndsAt: new Date(Date.now() + 86400000).toISOString()
          });
        
        const listingId = listingRes.body.listing.id;
        const auctionQuery = await db.query('SELECT id FROM auctions WHERE listing_id = $1', [listingId]);
        endedAuctionId = auctionQuery.rows[0].id;

        // Manually update the end_time to the past to simulate ended state (no INSERT or DELETE used)
        const pastStart = new Date(Date.now() - 7200000).toISOString();
        const pastEnd = new Date(Date.now() - 3600000).toISOString();
        await db.query(`UPDATE auctions SET start_time = $1, end_time = $2, status = 'ended' WHERE id = $3`, [pastStart, pastEnd, endedAuctionId]);
        
        await db.query(`INSERT INTO bid_deposits (auction_id, user_id, amount, status, razorpay_payment_id, created_at, updated_at) VALUES ($1, $2, 50.00, 'held', 'pay_mock', NOW(), NOW())`, [endedAuctionId, buyerAId]);
      });

      it('should resolve status as ended when end_time has passed (GET /api/auctions/:id)', async () => {
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
  });
});
