require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test';
const request = require('supertest');
const app = require('./src/app');
const db = require('./src/utils/db');

async function test() {
  const sellerEmail = 'test-seller-debug-' + Date.now() + '@example.com';
  const sellerRes = await request(app)
    .post('/api/auth/register')
    .send({ email: sellerEmail, password: 'Password123!', name: 'Seller User' });
  const token = sellerRes.body.accessToken;
  await db.query("UPDATE users SET email_verified = true");
  const res = await request(app)
    .post('/api/listings')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: 'Test Listing 1',
      description: 'This is a highly detailed description of the test item that meets the minimum length requirement. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: 'Art',
      subcategory: 'Paintings',
      imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
      buyingMethod: 'Buy Now',
      price: null
    });
  console.log('STATUS:', res.status);
  console.log('BODY:', res.body);
  process.exit(0);
}
test();
