jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Notifications API Integration Tests', () => {
  let buyerAToken = '', buyerAId = null;
  let buyerBToken = '', buyerBId = null;
  let sellerToken = '', sellerId = null;
  let categoryId = null;
  let listingId = null;
  let auctionId = null;
  let orderId = null;
  let disputeId = null;

  beforeAll(async () => {
    // Get a category ID
    const catRes = await db.query('SELECT id FROM categories LIMIT 1');
    categoryId = catRes.rows[0].id;

    // Create Buyer A
    const resA = await request(app).post('/api/auth/register')
      .send({ email: `test-notif-buyera-${Date.now()}@example.com`, password: 'Password123!', name: 'Buyer A' });
    buyerAToken = resA.body.accessToken;
    buyerAId = resA.body.user.id;

    // Create Buyer B
    const resB = await request(app).post('/api/auth/register')
      .send({ email: `test-notif-buyerb-${Date.now()}@example.com`, password: 'Password123!', name: 'Buyer B' });
    buyerBToken = resB.body.accessToken;
    buyerBId = resB.body.user.id;

    // Pre-authorize Buyer A and Buyer B by registering mock card details
    await request(app)
      .post('/api/payments/save-card')
      .set('Authorization', `Bearer ${buyerAToken}`)
      .send({ razorpay_payment_id: 'pay_mockbuyerA' });

    await request(app)
      .post('/api/payments/save-card')
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({ razorpay_payment_id: 'pay_mockbuyerB' });


    // Create Seller
    const resS = await request(app).post('/api/auth/register')
      .send({ email: `test-notif-seller-${Date.now()}@example.com`, password: 'Password123!', name: 'Main Seller' });
    sellerToken = resS.body.accessToken;
    sellerId = resS.body.user.id;

    // Create a listing for the seller
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
        price: 100.00
      });
    listingId = listingRes.body.listing.id;
  });

  afterAll(async () => {
    // Clean up
    const likePattern = 'test-notif-%';
    await db.query("DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)", [likePattern]);
    await db.query("DELETE FROM disputes WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE $1))", [likePattern]);
    await db.query("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE $1))", [likePattern]);
    await db.query("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE $1)", [likePattern]);
    await db.query("DELETE FROM bids WHERE auction_id IN (SELECT id FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE $1))", [likePattern]);
    await db.query("DELETE FROM auctions WHERE seller_id IN (SELECT id FROM users WHERE email LIKE $1)", [likePattern]);
    await db.query("DELETE FROM follows WHERE follower_id IN (SELECT id FROM users WHERE email LIKE $1)", [likePattern]);
    await db.query("DELETE FROM listings WHERE seller_id IN (SELECT id FROM users WHERE email LIKE $1)", [likePattern]);
    await db.query("DELETE FROM users WHERE email LIKE $1", [likePattern]);
    await db.pool.end();
  });

  it('should trigger new_follower notification when followed', async () => {
    // Buyer A follows Seller
    const followRes = await request(app)
      .post(`/api/users/${sellerId}/follow`)
      .set('Authorization', `Bearer ${buyerAToken}`);
    expect(followRes.status).toBe(201);

    // Fetch Seller's notifications
    const notifRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${sellerToken}`);
    
    expect(notifRes.status).toBe(200);
    expect(notifRes.body.notifications.length).toBe(1);
    expect(notifRes.body.notifications[0].type).toBe('new_follower');
    expect(notifRes.body.notifications[0].message).toMatch(/Buyer A/);
  });

  it('should trigger outbid notification during bidding', async () => {
    // Create an auction
    const startTime = new Date();
    const endTime = new Date(Date.now() + 3600000); // 1 hour later
    const auctionRes = await db.query(
      `INSERT INTO auctions (listing_id, seller_id, start_bid, current_bid, reserve_price, min_bid_increment, start_time, end_time, status)
       VALUES ($1, $2, 100.00, NULL, 120.00, 10.00, $3, $4, 'active') RETURNING id`,
      [listingId, sellerId, startTime.toISOString(), endTime.toISOString()]
    );
    auctionId = auctionRes.rows[0].id;

    // Buyer A places first bid ($115)
    const bid1 = await request(app)
      .post(`/api/auctions/${auctionId}/bids`)
      .set('Authorization', `Bearer ${buyerAToken}`)
      .send({ bid_amount: 115.00 });
    expect(bid1.status).toBe(201);

    // Buyer B places higher bid ($125) outbidding Buyer A
    const bid2 = await request(app)
      .post(`/api/auctions/${auctionId}/bids`)
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({ bid_amount: 125.00 });
    expect(bid2.status).toBe(201);

    // Fetch Buyer A's notifications (outbid notification expected)
    const notifRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${buyerAToken}`);
    
    const outbidNotif = notifRes.body.notifications.find(n => n.type === 'outbid');
    expect(outbidNotif).toBeDefined();
    expect(outbidNotif.message).toMatch(/Test Notification Listing/);
    expect(outbidNotif.message).toMatch(/125/);
  });

  it('should trigger auction_won and auction_lost notifications on settlement', async () => {
    // Force end the auction in the DB
    await db.query('UPDATE auctions SET end_time = NOW() - INTERVAL \'1 minute\' WHERE id = $1', [auctionId]);

    // Seller settles the auction
    const settleRes = await request(app)
      .post(`/api/auctions/${auctionId}/settle`)
      .set('Authorization', `Bearer ${sellerToken}`);
    
    expect(settleRes.status).toBe(200);
    expect(settleRes.body.settled).toBe(true);
    orderId = settleRes.body.order.id;

    // Fetch Buyer B's notifications (Winner: auction_won)
    const winRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${buyerBToken}`);
    const wonNotif = winRes.body.notifications.find(n => n.type === 'auction_won');
    expect(wonNotif).toBeDefined();
    expect(wonNotif.title).toBe('Auction Won!');

    // Fetch Buyer A's notifications (Loser: auction_lost)
    const loseRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${buyerAToken}`);
    const lostNotif = loseRes.body.notifications.find(n => n.type === 'auction_lost');
    expect(lostNotif).toBeDefined();
    expect(lostNotif.title).toBe('Auction Ended');
  });

  it('should trigger payment_received notification on verification', async () => {
    // Verify payment (forces order to paid)
    // We can simulate payment verification in mock mode
    const payOrderRes = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({ order_id: orderId });
    expect(payOrderRes.status).toBe(201);
    
    const providerOrderId = payOrderRes.body.provider_order_id;
    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({
        order_id: orderId,
        razorpay_order_id: providerOrderId,
        razorpay_payment_id: 'mock_pay_notif',
        razorpay_signature: `mock_sig_${providerOrderId}_mock_pay_notif`
      });
    expect(verifyRes.status).toBe(200);

    // Fetch Seller's notifications (should see payment_received)
    const notifRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${sellerToken}`);
    const payNotif = notifRes.body.notifications.find(n => n.type === 'payment_received');
    expect(payNotif).toBeDefined();
    expect(payNotif.title).toBe('Payment Received!');
  });

  it('should trigger order_shipped notification', async () => {
    // Seller ships order
    const shipRes = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ status: 'shipped' });
    expect(shipRes.status).toBe(200);

    // Fetch Buyer B's notifications (should see order_shipped)
    const notifRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${buyerBToken}`);
    const shipNotif = notifRes.body.notifications.find(n => n.type === 'order_shipped');
    expect(shipNotif).toBeDefined();
    expect(shipNotif.title).toBe('Order Shipped!');
  });

  it('should trigger dispute_update notifications', async () => {
    // Buyer B opens dispute
    const dispRes = await request(app)
      .post('/api/disputes')
      .set('Authorization', `Bearer ${buyerBToken}`)
      .send({ order_id: orderId, reason: 'Item arrived damaged' });
    expect(dispRes.status).toBe(201);
    disputeId = dispRes.body.dispute.id;

    // Seller gets dispute_update notification
    const sellNotif = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${sellerToken}`);
    const disputeOpenNotif = sellNotif.body.notifications.find(n => n.type === 'dispute_update' && n.title === 'Dispute Opened!');
    expect(disputeOpenNotif).toBeDefined();

    // Seller updates status to review
    const dispUpdate = await request(app)
      .patch(`/api/disputes/${disputeId}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ status: 'under_review' });
    expect(dispUpdate.status).toBe(200);

    // Buyer B gets dispute_update notification
    const buyNotif = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${buyerBToken}`);
    const disputeStatusNotif = buyNotif.body.notifications.find(n => n.type === 'dispute_update' && n.title === 'Dispute Status Updated!');
    expect(disputeStatusNotif).toBeDefined();
    expect(disputeStatusNotif.message).toMatch(/review/);
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark a specific notification as read', async () => {
      // Get Buyer B's notifications
      const notifRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${buyerBToken}`);
      
      const unreadNotif = notifRes.body.notifications.find(n => !n.is_read);
      expect(unreadNotif).toBeDefined();

      // Mark as read
      const readRes = await request(app)
        .patch(`/api/notifications/${unreadNotif.id}/read`)
        .set('Authorization', `Bearer ${buyerBToken}`);
      
      expect(readRes.status).toBe(200);
      expect(readRes.body.success).toBe(true);
      expect(readRes.body.notification.is_read).toBe(true);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      // Mark all as read for Seller
      const readAllRes = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${sellerToken}`);
      
      expect(readAllRes.status).toBe(200);
      expect(readAllRes.body.success).toBe(true);
      expect(readAllRes.body.count).toBeGreaterThan(0);

      // Verify all are read
      const finalNotifRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${sellerToken}`);
      
      const hasUnread = finalNotifRes.body.notifications.some(n => !n.is_read);
      expect(hasUnread).toBe(false);
    });
  });
});
