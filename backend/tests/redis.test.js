const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');
const redis = require('../src/utils/redis');

// Mock redis
jest.mock('../src/utils/redis', () => {
  let store = {};
  return {
    get: jest.fn(async (key) => store[key] || null),
    set: jest.fn(async (key, value) => { store[key] = value; }),
    del: jest.fn(async (key) => { delete store[key]; }),
    keys: jest.fn(async (pattern) => Object.keys(store).filter(k => k.includes('listings'))),
    __resetStore: () => { store = {}; }
  };
});

describe('Redis Caching Integration Tests', () => {
  let token = '';
  let categoryId = null;

  beforeAll(async () => {
    // Register user
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: `redis-seller-${Date.now()}@example.com`, password: 'Password123!', name: 'Redis Seller' });
    token = res.body.accessToken;

    // Create a category
    const catRes = await db.query("INSERT INTO categories (name, slug) VALUES ('Redis Test Category', 'redis-test-category') RETURNING id");
    categoryId = catRes.rows[0].id;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    redis.__resetStore();
  });

  afterAll(async () => {
    await db.query("DELETE FROM listings WHERE seller_id IN (SELECT id FROM users WHERE email LIKE 'redis-%')");
    await db.query("DELETE FROM categories WHERE name = 'Redis Test Category'");
    await db.query("DELETE FROM users WHERE email LIKE 'redis-%'");
    await db.pool.end();
  });

  it('should cache getListings response', async () => {
    const res1 = await request(app).get('/api/listings');
    expect(res1.status).toBe(200);
    expect(redis.set).toHaveBeenCalled();

    const res2 = await request(app).get('/api/listings');
    expect(res2.status).toBe(200);
    expect(redis.get).toHaveBeenCalled();
  });

  it('should invalidate listings cache on creating a new listing', async () => {
    const payload = {
      title: 'Test Listing 1',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
          buyingMethod: 'Buy Now',
      price: 100
    };

    // Pre-populate cache so keys() returns something and del() gets called
    await redis.set('cache:listings:dummy', 'data');

    const res = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    
    expect(res.status).toBe(201);
    expect(redis.keys).toHaveBeenCalled();
    expect(redis.del).toHaveBeenCalled(); // Should clear cache keys
  });
});

