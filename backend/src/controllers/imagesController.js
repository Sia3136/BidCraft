const { uploadMany } = require('../services/imageService');
const similarityService = require('../services/similarityService');
const redisClient = require('../utils/redis');

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;

async function uploadImages(req, res, next) {
  try {
    // req.files is set by multer (array of files)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'no_files_provided' });
    }

    // Validate each file
    for (const file of req.files) {
      if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'invalid_file_type',
          message: `Only JPEG, PNG, and WebP images are allowed. Got: ${file.mimetype}`
        });
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return res.status(400).json({
          error: 'file_too_large',
          message: `Each file must be under ${MAX_FILE_SIZE_MB}MB`
        });
      }
    }

    // Detect duplicates (pluggable similarity-detection architecture)
    const similarityResult = await similarityService.detectDuplicates(req.files.map(f => f.buffer));
    if (similarityResult.hasDuplicates) {
      return res.status(400).json({ error: 'duplicate_images_detected', message: 'Similar images detected. Please upload unique photos.' });
    }

    // Upload all to Cloudinary concurrently
    const results = await uploadMany(
      req.files.map((f) => ({ buffer: f.buffer, mimetype: f.mimetype }))
    );

    res.status(201).json({
      images: results.map((r) => ({ url: r.url, public_id: r.public_id })),
      urls: results.map((r) => r.url)
    });
  } catch (err) {
    next(err);
  }
}

async function resolveImage(req, res, next) {
  try {
    const { publicId } = req.params;
    if (!publicId) return res.status(400).json({ error: 'missing_public_id' });

    const cacheKey = `img:${publicId}`;
    try {
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        return res.json({ url: cachedUrl, source: 'cache' });
      }
    } catch (redisErr) {
      console.warn('Redis cache get error:', redisErr.message);
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;

    try {
      await redisClient.set(cacheKey, url, { ex: 86400 }); // Cache for 24 hours
    } catch (redisErr) {
      console.warn('Redis cache set error:', redisErr.message);
    }

    res.json({ url, source: 'cloudinary' });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadImages, resolveImage };
