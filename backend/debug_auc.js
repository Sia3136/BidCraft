process.env.RAZORPAY_WEBHOOK_SECRET = 'test';
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('./src/app');
const db = require('./src/utils/db');
async function test() {
  const sellerRes = await request(app).post('/api/auth/register').send({ email: 'test-auc-debug-' + Date.now() + '@example.com', password: 'Password123!', name: 'Seller' });
  const token = sellerRes.body.accessToken;
  await db.query("UPDATE users SET email_verified = true");
  const listingRes = await request(app).post('/api/listings').set('Authorization', 'Bearer ' + token).send({
    title: 'Test Listing 1', description: 'This is a highly detailed description of the test item that meets the minimum length requirement. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Art', subcategory: 'Paintings', imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'], buyingMethod: 'Buy Now', price: 100.00
  });
  console.log('Listing status:', listingRes.status);
  const startTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const endTime = new Date(Date.now() + 25 * 60 * 60 * 1000); // 25 hours from now
  const auctionRes = await request(app).post('/api/auctions').set('Authorization', 'Bearer ' + token).send({
    listing_id: listingRes.body.listing.id, start_bid: 50.00, min_bid_increment: 5.00, start_time: startTime.toISOString(), end_time: endTime.toISOString()
  });
  console.log('Auction status:', auctionRes.status, 'Body:', auctionRes.body);
  process.exit(0);
}
test();
