const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

describe('Admin Analytics API Integration Tests', () => {
  let adminToken = '';
  let buyerToken = '';
  let adminUserId = null;
  let buyerUserId = null;

  beforeAll(async () => {
    // 1. Create buyer user
    const res1 = await request(app)
      .post('/api/auth/register')
      .send({ email: `analytics-buyer-${Date.now()}@example.com`, password: 'Password123!', name: 'Analytics Buyer' });
    buyerToken = res1.body.accessToken;
    buyerUserId = res1.body.user.id;

    // 2. Create admin user
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ email: `analytics-admin-${Date.now()}@example.com`, password: 'Password123!', name: 'Analytics Admin' });
    adminToken = res2.body.accessToken;
    adminUserId = res2.body.user.id;

    // Promote to admin
    await db.query("UPDATE users SET role = 'admin' WHERE id = $1", [adminUserId]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM users WHERE email LIKE 'analytics-%'");
    await db.pool.end();
  });

  describe('GET /api/admin/analytics', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/admin/analytics');
      expect(res.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(res.status).toBe(403);
    });

    it('should return analytics data for admins', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalUsers');
      expect(res.body).toHaveProperty('activeListings');
      expect(res.body).toHaveProperty('completedOrders');
      expect(res.body).toHaveProperty('totalRevenue');
      expect(res.body).toHaveProperty('pendingDisputes');
      
      expect(typeof res.body.totalUsers).toBe('number');
      expect(typeof res.body.totalRevenue).toBe('number');
    });
  });
});
