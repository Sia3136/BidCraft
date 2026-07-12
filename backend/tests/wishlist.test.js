jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Wishlist API Integration Tests', () => {
  let userToken = '';
  let sellerToken = '';
  let categoryId = null;
  let listingId = null;

  beforeAll(async () => {
    // Get a category ID
    const catRes = await db.query('SELECT id FROM categories LIMIT 1');
    categoryId = catRes.rows[0].id;

    // Create user
    const userEmail = `test-wish-buyer-${Date.now()}@example.com`;
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({ email: userEmail, password: 'Password123!', name: 'Wishlist Buyer' });
    userToken = userRes.body.accessToken;

    // Create seller
    const sellerEmail = `test-wish-seller-${Date.now()}@example.com`;
    const sellerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: sellerEmail, password: 'Password123!', name: 'Wishlist Seller' });
    sellerToken = sellerRes.body.accessToken;

    // Create a listing
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
    await db.query("DELETE FROM wishlist WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-wish-%')");
    await db.query("DELETE FROM listings WHERE title = 'Test Wishlist Item'");
    await db.query("DELETE FROM users WHERE email LIKE 'test-wish-%'");
    await db.pool.end();
  });

  describe('POST /api/wishlist/:listingId', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).post(`/api/wishlist/${listingId}`);
      expect(res.status).toBe(401);
    });

    it('should add the listing to the wishlist successfully', async () => {
      const res = await request(app)
        .post(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject a duplicate wishlist request', async () => {
      const res = await request(app)
        .post(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('already_wishlisted');
    });

    it('should return 404 for a non-existent listing', async () => {
      const res = await request(app)
        .post('/api/wishlist/999999')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('listing_not_found');
    });
  });

  describe('GET /api/wishlist', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/wishlist');
      expect(res.status).toBe(401);
    });

    it('should return list of wishlisted items with listing details', async () => {
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.wishlist)).toBe(true);
      expect(res.body.wishlist.length).toBe(1);
      expect(res.body.wishlist[0].id).toBe(listingId);
      expect(res.body.wishlist[0].title).toBe('Test Wishlist Item');
      expect(res.body.wishlist[0].seller_name).toBe('Wishlist Seller');
    });
  });

  describe('DELETE /api/wishlist/:listingId', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).delete(`/api/wishlist/${listingId}`);
      expect(res.status).toBe(401);
    });

    it('should remove the listing from the wishlist successfully', async () => {
      const res = await request(app)
        .delete(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it's gone
      const listRes = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`);
      expect(listRes.body.wishlist.length).toBe(0);
    });

    it('should return 404 when removing an item not in wishlist', async () => {
      const res = await request(app)
        .delete(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('wishlist_item_not_found');
    });
  });
});
