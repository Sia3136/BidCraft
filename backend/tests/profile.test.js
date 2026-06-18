const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000); // Neon DB round-trips

describe('User Profile API Integration Tests', () => {
  let userToken = '';
  let userId = null;
  let otherUserToken = '';
  let otherUserId = null;

  beforeAll(async () => {
    // Create primary user
    const email = `test-profile-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!', name: 'Profile Test User' });
    userToken = res.body.accessToken;
    userId = res.body.user.id;

    // Create secondary user for public profile test
    const email2 = `test-profile-other-${Date.now()}@example.com`;
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ email: email2, password: 'Password123!', name: 'Other Profile User' });
    otherUserToken = res2.body.accessToken;
    otherUserId = res2.body.user.id;
  });

  afterAll(async () => {
    await db.query("DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-profile-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-profile-%'");
    await db.pool.end();
  });

  describe('GET /api/profile', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(401);
    });

    it('should return own profile for authenticated user', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.profile).toHaveProperty('id');
      expect(res.body.profile).toHaveProperty('email');
      expect(res.body.profile).toHaveProperty('name');
      expect(res.body.profile).toHaveProperty('role');
      expect(res.body.profile).toHaveProperty('bio');
      expect(res.body.profile).toHaveProperty('trust_score');
      // Email should NOT be hidden for own profile
      expect(res.body.profile.email).toMatch(/@example\.com/);
    });

    it('should create profile row lazily on first access', async () => {
      // Profile row should exist after GET /api/profile
      const result = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
      expect(result.rows.length).toBe(1);
    });
  });

  describe('PUT /api/profile', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .put('/api/profile')
        .send({ name: 'Unauthorized' });
      expect(res.status).toBe(401);
    });

    it('should update name successfully', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Profile Name' });

      expect(res.status).toBe(200);
      expect(res.body.profile.name).toBe('Updated Profile Name');
    });

    it('should update bio and phone', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          bio: 'I sell vintage electronics and rare collectibles.',
          phone: '+1-555-0100'
        });

      expect(res.status).toBe(200);
      expect(res.body.profile.bio).toBe('I sell vintage electronics and rare collectibles.');
      expect(res.body.profile.phone).toBe('+1-555-0100');
    });

    it('should update avatar_url with valid URL', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ avatar_url: 'https://example.com/my-avatar.png' });

      expect(res.status).toBe(200);
      expect(res.body.profile.avatar_url).toBe('https://example.com/my-avatar.png');
    });

    it('should update social_links JSONB', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          social_links: { twitter: 'https://twitter.com/testuser', instagram: 'https://instagram.com/testuser' }
        });

      expect(res.status).toBe(200);
      expect(res.body.profile.social_links).toMatchObject({
        twitter: 'https://twitter.com/testuser'
      });
    });

    it('should reject invalid avatar_url (not a URI)', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ avatar_url: 'not-a-url' });

      expect(res.status).toBe(400);
    });

    it('should return 400 with no updates provided', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('no_updates_provided');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return public profile for any user (no auth needed)', async () => {
      const res = await request(app).get(`/api/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.profile).toHaveProperty('id');
      expect(res.body.profile).toHaveProperty('name');
      expect(res.body.profile).toHaveProperty('trust_score');
      // Email should NOT be exposed in public profile
      expect(res.body.profile).not.toHaveProperty('email');
      // Phone should NOT be exposed in public profile
      expect(res.body.profile).not.toHaveProperty('phone');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app).get('/api/users/99999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('user_not_found');
    });

    it('should return profile for other user', async () => {
      const res = await request(app).get(`/api/users/${otherUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.profile.id).toBe(otherUserId);
    });
  });
});
