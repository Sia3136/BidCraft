const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Follows API Integration Tests', () => {
  let userAToken = '';
  let userAId = null;
  let userBToken = '';
  let userBId = null;

  beforeAll(async () => {
    // Create User A
    const emailA = `test-follow-a-${Date.now()}@example.com`;
    const resA = await request(app)
      .post('/api/auth/register')
      .send({ email: emailA, password: 'Password123!', name: 'Follower User' });
    userAToken = resA.body.accessToken;
    userAId = resA.body.user.id;

    // Create User B
    const emailB = `test-follow-b-${Date.now()}@example.com`;
    const resB = await request(app)
      .post('/api/auth/register')
      .send({ email: emailB, password: 'Password123!', name: 'Seller User' });
    userBToken = resB.body.accessToken;
    userBId = resB.body.user.id;
  });

  afterAll(async () => {
    await db.query("DELETE FROM follows WHERE follower_id IN (SELECT id FROM users WHERE email LIKE 'test-follow-%')");
    await db.query("DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-follow-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-follow-%'");
    await db.pool.end();
  });

  describe('POST /api/users/:sellerId/follow', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post(`/api/users/${userBId}/follow`);
      expect(res.status).toBe(401);
    });

    it('should follow a seller successfully', async () => {
      const res = await request(app)
        .post(`/api/users/${userBId}/follow`)
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/now following/);
    });

    it('should reject duplicate follows', async () => {
      const res = await request(app)
        .post(`/api/users/${userBId}/follow`)
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('already_following');
    });

    it('should prevent self-follow', async () => {
      const res = await request(app)
        .post(`/api/users/${userAId}/follow`)
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('cannot_follow_self');
    });

    it('should return 404 for a non-existent seller', async () => {
      const res = await request(app)
        .post('/api/users/999999/follow')
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('seller_not_found');
    });
  });

  describe('GET /api/users/:sellerId/followers', () => {
    it('should list followers for a user', async () => {
      const res = await request(app).get(`/api/users/${userBId}/followers`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.followers)).toBe(true);
      expect(res.body.followers.length).toBe(1);
      expect(res.body.followers[0].user_id).toBe(userAId);
      expect(res.body.followers[0].name).toBe('Follower User');
    });
  });

  describe('GET /api/me/following', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/me/following');
      expect(res.status).toBe(401);
    });

    it('should return the users followed by the current user', async () => {
      const res = await request(app)
        .get('/api/me/following')
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.following)).toBe(true);
      expect(res.body.following.length).toBe(1);
      expect(res.body.following[0].user_id).toBe(userBId);
      expect(res.body.following[0].name).toBe('Seller User');
    });
  });

  describe('DELETE /api/users/:sellerId/follow', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).delete(`/api/users/${userBId}/follow`);
      expect(res.status).toBe(401);
    });

    it('should unfollow a seller successfully', async () => {
      const res = await request(app)
        .delete(`/api/users/${userBId}/follow`)
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify list is empty
      const listRes = await request(app)
        .get('/api/me/following')
        .set('Authorization', `Bearer ${userAToken}`);
      expect(listRes.body.following.length).toBe(0);
    });

    it('should return 404 when unfollowing a user who is not followed', async () => {
      const res = await request(app)
        .delete(`/api/users/${userBId}/follow`)
        .set('Authorization', `Bearer ${userAToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('not_following');
    });
  });
});
