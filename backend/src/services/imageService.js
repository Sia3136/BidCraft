/**
 * imageService.js
 * Handles Cloudinary upload from in-memory buffer (no disk I/O).
 * Works with Neon/Render serverless environments.
 */
const cloudinary = require('cloudinary').v2;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const MOCK_MODE = !CLOUDINARY_CLOUD_NAME || process.env.NODE_ENV === 'test';

if (!MOCK_MODE) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

/**
 * Upload a single file buffer to Cloudinary.
 * @param {Buffer} buffer  - File buffer from multer memoryStorage
 * @param {string} mimetype - e.g. 'image/jpeg'
 * @returns {Promise<{url: string, public_id: string}>}
 */
function uploadToCloudinary(buffer, mimetype) {
  if (MOCK_MODE) {
    const mockId = `mock_image_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return Promise.resolve({
      url: `https://via.placeholder.com/600?text=${mockId}`,
      public_id: mockId
    });
  }

  return new Promise((resolve, reject) => {
    const resourceType = 'image';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'bidcraft/listings',
        resource_type: resourceType,
        format: mimetype.split('/')[1] === 'jpeg' ? 'jpg' : mimetype.split('/')[1],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, height: 1200, crop: 'limit' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Upload multiple buffers concurrently.
 * @param {Array<{buffer: Buffer, mimetype: string}>} files
 * @returns {Promise<Array<{url: string, public_id: string}>>}
 */
async function uploadMany(files) {
  return Promise.all(files.map((f) => uploadToCloudinary(f.buffer, f.mimetype)));
}

module.exports = { uploadToCloudinary, uploadMany, MOCK_MODE };
