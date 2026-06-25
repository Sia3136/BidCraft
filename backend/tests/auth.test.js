jest.mock('../src/services/paymentService', () => require('../src/services/__mocks__/paymentService'));
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('Auth Integration Tests', () => {
  const testEmail = `test-auth-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  let accessToken = '';

  afterAll(async () => {
    // Cleanup test users
    await db.query("DELETE FROM users WHERE email LIKE 'test-auth-%' OR email LIKE 'google_mock_%'");
    await db.pool.end();
  });


  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          name: testName
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testEmail);
    });

    it('should fail registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          name: testName
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('email_taken');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      accessToken = res.body.accessToken;
    });

    it('should fail login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid_credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testEmail);
    });

    it('should fail with missing token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('missing_auth');
    });
  });

  describe('POST /api/auth/google', () => {
    it('should sign in or create user using mock google token', async () => {
      const mockToken = `mock_token_googleuser_${Date.now()}`;
      const res = await request(app)
        .post('/api/auth/google')
        .send({ token: mockToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toContain('google_mock_');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return success response', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
