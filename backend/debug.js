require('dotenv').config();
process.env.NODE_ENV = 'development';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test';
const request = require('supertest');
const app = require('./src/app');
const { generateToken } = require('./src/utils/token');

async function test() {
  const token = generateToken({ id: 1, role: 'user' });
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
