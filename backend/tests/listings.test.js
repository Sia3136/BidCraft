jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Listings Integration Tests', () => {
  let sellerToken = '';
  let otherUserToken = '';
  let categoryId = null;
  let testListingId = null;

  beforeAll(async () => {
    // Get a valid category
    const catResult = await db.query("SELECT id FROM categories LIMIT 1");
    categoryId = catResult.rows[0].id;

    // Create seller
    const sellerEmail = `test-seller-${Date.now()}@example.com`;
    const sellerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: sellerEmail, password: 'Password123!', name: 'Seller User' });
    sellerToken = sellerRes.body.accessToken;

    // Create other user
    const otherEmail = `test-other-${Date.now()}@example.com`;
    const otherRes = await request(app)
      .post('/api/auth/register')
      .send({ email: otherEmail, password: 'Password123!', name: 'Other User' });
    otherUserToken = otherRes.body.accessToken;
    await db.query("UPDATE users SET email_verified = true");
  });

  afterAll(async () => {
    // Cleanup listings and users
    await db.query("DELETE FROM listings WHERE title LIKE 'Test Listing%'");
    await db.query("DELETE FROM users WHERE email LIKE 'test-seller-%' OR email LIKE 'test-other-%'");
    await db.pool.end();
  });


  describe('POST /api/listings', () => {
    it('should create a listing successfully', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Listing 1',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
          buyingMethod: 'Buy Now',
          price: 500.00
        });

      expect(res.status).toBe(201);
      expect(res.body.listing).toHaveProperty('id');
      expect(res.body.listing.title).toBe('Test Listing 1');
      testListingId = res.body.listing.id;
    });

    it('should fail creation with missing field', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          description: 'No title provided',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg'],
          buyingMethod: 'Buy Now'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/listings', () => {
    it('should return list of active listings', async () => {
      const res = await request(app)
        .get('/api/listings');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.listings.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/listings/:id', () => {
    it('should return details of specific listing', async () => {
      const res = await request(app)
        .get(`/api/listings/${testListingId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(testListingId);
    });

    it('should return 404 for non-existent listing', async () => {
      const res = await request(app)
        .get('/api/listings/99999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Listing not found');
    });
  });

  describe('PUT /api/listings/:id', () => {
    it('should update listing successfully if owner', async () => {
      const res = await request(app)
        .put(`/api/listings/${testListingId}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Listing 1 Updated',
          price: 450.00
        });

      expect(res.status).toBe(200);
      expect(res.body.listing.title).toBe('Test Listing 1 Updated');
      expect(Number(res.body.listing.price)).toBe(450.00);
    });

    it('should fail update if not owner', async () => {
      const res = await request(app)
        .put(`/api/listings/${testListingId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          title: 'Attempted hack'
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('unauthorized_action');
    });
  });

  describe('DELETE /api/listings/:id', () => {
    it('should fail delete if not owner', async () => {
      const res = await request(app)
        .delete(`/api/listings/${testListingId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('unauthorized_action');
    });

    it('should delete listing successfully if owner', async () => {
      const res = await request(app)
        .delete(`/api/listings/${testListingId}`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/listings/${testListingId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
