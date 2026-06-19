const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000);

describe('KYC Identity Verification API Integration Tests', () => {
  let userToken = '';
  let userId = null;
  let adminToken = '';
  let adminUserId = null;

  beforeAll(async () => {
    // 1. Create seller user
    const email = `test-kyc-seller-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!', name: 'KYC Seller User' });
    userToken = res.body.accessToken;
    userId = res.body.user.id;

    // 2. Create admin user
    const adminEmail = `test-kyc-admin-${Date.now()}@example.com`;
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ email: adminEmail, password: 'Password123!', name: 'KYC Admin User' });
    adminToken = res2.body.accessToken;
    adminUserId = res2.body.user.id;

    // Promote the second user to admin role in database
    await db.query("UPDATE users SET role = 'admin' WHERE id = $1", [adminUserId]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-kyc-%')");
    await db.query("DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-kyc-%')");
    await db.query("DELETE FROM users WHERE email LIKE 'test-kyc-%'");
    await db.pool.end();
  });

  describe('POST /api/profile/kyc (Submit KYC)', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/profile/kyc')
        .send({ document_type: 'passport', document_url: 'https://example.com/doc.jpg' });
      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid/missing document parameters', async () => {
      const res = await request(app)
        .post('/api/profile/kyc')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ document_type: 'passport' }); // missing url
      expect(res.status).toBe(400);
    });

    it('should successfully submit KYC documents and set status to pending', async () => {
      const res = await request(app)
        .post('/api/profile/kyc')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ document_type: 'aadhar', document_url: 'https://example.com/aadhar.png' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.kyc_status).toBe('pending');
      expect(res.body.kyc_document_type).toBe('aadhar');

      // Verify DB profile record
      const dbRes = await db.query('SELECT kyc_status, is_verified, kyc_document_type FROM profiles WHERE user_id = $1', [userId]);
      expect(dbRes.rows[0].kyc_status).toBe('pending');
      expect(dbRes.rows[0].is_verified).toBe(false);
    });
  });

  describe('GET /api/admin/kyc (List Pending KYC)', () => {
    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .get('/api/admin/kyc')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should return list of pending KYC submissions for admins', async () => {
      const res = await request(app)
        .get('/api/admin/kyc')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      const application = res.body.find(a => a.id === userId);
      expect(application).toBeDefined();
      expect(application.kyc_status).toBe('pending');
      expect(application.kyc_document_type).toBe('aadhar');
    });
  });

  describe('PATCH /api/admin/kyc/:userId (Review KYC)', () => {
    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .patch(`/api/admin/kyc/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'approved' });
      expect(res.status).toBe(403);
    });

    it('should reject review with invalid status value', async () => {
      const res = await request(app)
        .patch(`/api/admin/kyc/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid_status_xyz' });
      expect(res.status).toBe(400);
    });

    it('should approve KYC successfully, setting is_verified to true', async () => {
      const res = await request(app)
        .patch(`/api/admin/kyc/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.kyc_status).toBe('approved');
      expect(res.body.is_verified).toBe(true);

      // Verify user's profile is verified in DB
      const dbRes = await db.query('SELECT kyc_status, is_verified FROM profiles WHERE user_id = $1', [userId]);
      expect(dbRes.rows[0].kyc_status).toBe('approved');
      expect(dbRes.rows[0].is_verified).toBe(true);

      // Verify user has been notified
      const notificationRes = await db.query("SELECT * FROM notifications WHERE user_id = $1 AND type = 'kyc_update'", [userId]);
      expect(notificationRes.rows.length).toBeGreaterThan(0);
      expect(notificationRes.rows[0].title).toBe('KYC Approved!');
    });

    it('should reject KYC successfully, setting is_verified to false and saving rejection reason', async () => {
      // Re-submit KYC
      await request(app)
        .post('/api/profile/kyc')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ document_type: 'passport', document_url: 'https://example.com/passport.png' });

      // Reject KYC as Admin
      const res = await request(app)
        .patch(`/api/admin/kyc/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'rejected', rejection_reason: 'Image is blurry and unreadable' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.kyc_status).toBe('rejected');
      expect(res.body.is_verified).toBe(false);
      expect(res.body.kyc_rejection_reason).toBe('Image is blurry and unreadable');

      // Verify in DB
      const dbRes = await db.query('SELECT kyc_status, is_verified, kyc_rejection_reason FROM profiles WHERE user_id = $1', [userId]);
      expect(dbRes.rows[0].kyc_status).toBe('rejected');
      expect(dbRes.rows[0].is_verified).toBe(false);
      expect(dbRes.rows[0].kyc_rejection_reason).toBe('Image is blurry and unreadable');
    });
  });
});
