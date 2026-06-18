const request = require('supertest');
const app = require('../src/app');
const db = require('../src/utils/db');

jest.setTimeout(30000); // Neon DB round-trips

// Skip image upload tests if Cloudinary is not configured
const CLOUDINARY_CONFIGURED =
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY.trim() !== '' &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME.trim() !== '';

describe('Images API Integration Tests', () => {
  let userToken = '';

  beforeAll(async () => {
    const email = `test-img-user-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!', name: 'Image Test User' });
    userToken = res.body.accessToken;
  });

  afterAll(async () => {
    await db.query("DELETE FROM users WHERE email LIKE 'test-img-%'");
    await db.pool.end();
  });

  describe('POST /api/images/upload', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/images/upload')
        .attach('images', Buffer.from('fake'), { filename: 'test.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(401);
    });

    it('should return 400 when no files are provided', async () => {
      // Use a dummy text field to trigger proper multipart parsing but no file parts
      const res = await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .field('note', 'no-file'); // multipart form with no image files

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('no_files_provided');
    });

    it('should return 400 for invalid file type (text file)', async () => {
      const res = await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('images', Buffer.from('this is a text file'), {
          filename: 'test.txt',
          contentType: 'text/plain'
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 for file exceeding 5MB size limit', async () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a'); // 6MB
      const res = await request(app)
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('images', largeBuffer, {
          filename: 'large.jpg',
          contentType: 'image/jpeg'
        });

      expect(res.status).toBe(400);
    });

    if (CLOUDINARY_CONFIGURED) {
      it('should upload a valid JPEG image and return a URL', async () => {
        // Minimal valid 1x1 JPEG (22 bytes)
        const minimalJpeg = Buffer.from(
          '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
          'base64'
        );

        const res = await request(app)
          .post('/api/images/upload')
          .set('Authorization', `Bearer ${userToken}`)
          .attach('images', minimalJpeg, {
            filename: 'test.jpg',
            contentType: 'image/jpeg'
          });

        expect(res.status).toBe(201);
        expect(res.body.images).toHaveLength(1);
        expect(res.body.images[0]).toHaveProperty('url');
        expect(res.body.images[0]).toHaveProperty('public_id');
        expect(res.body.images[0].url).toMatch(/^https:\/\//);
        expect(Array.isArray(res.body.urls)).toBe(true);
        expect(res.body.urls[0]).toMatch(/cloudinary\.com/);
      });
    } else {
      it('SKIPPED: Cloudinary not configured — upload test skipped', () => {
        console.log('ℹ️  Set CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET to run upload tests');
        expect(true).toBe(true);
      });
    }
  });
});
