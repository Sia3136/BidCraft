const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');
const redis = require('../src/utils/redis');

jest.mock('../src/utils/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn().mockResolvedValue([]),
}));

describe('Search & Filters API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await db.pool.end();
  });

  describe('GET /api/listings with advanced query params', () => {
    it('should paginate results using page and limit', async () => {
      const res = await request(app).get('/api/listings?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('listings');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination.limit).toBe(5);
      expect(res.body.pagination.page).toBe(1);
    });

    it('should filter listings by min_price and max_price', async () => {
      const res = await request(app).get('/api/listings?min_price=10&max_price=1000');
      expect(res.status).toBe(200);
      // Ensure all returned listings are within price range if they have prices
      res.body.listings.forEach(listing => {
        const price = Number(listing.price || listing.start_bid || 0);
        expect(price).toBeGreaterThanOrEqual(10);
        expect(price).toBeLessThanOrEqual(1000);
      });
    });

    it('should sort listings by price ascending', async () => {
      const res = await request(app).get('/api/listings?sort_by=price&sort_dir=asc');
      expect(res.status).toBe(200);
      
      const prices = res.body.listings.map(l => Number(l.price || l.start_bid || 0));
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i+1]);
      }
    });

    it('should sort listings by price descending', async () => {
      const res = await request(app).get('/api/listings?sort_by=price&sort_dir=desc');
      expect(res.status).toBe(200);
      
      const prices = res.body.listings.map(l => Number(l.price || l.start_bid || 0));
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i+1]);
      }
    });

    it('should filter listings by condition', async () => {
      const res = await request(app).get('/api/listings?condition=new');
      expect(res.status).toBe(200);
      res.body.listings.forEach(listing => {
        expect(listing.condition).toBe('new');
      });
    });
  });
});
