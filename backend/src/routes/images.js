const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { uploadImages, resolveImage } = require('../controllers/imagesController');

// Use memoryStorage — no disk writes, works in serverless/Neon environments
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 6                    // Max 6 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Pass error to multer error handler
      cb(Object.assign(new Error('invalid_file_type'), { status: 400 }), false);
    }
  }
});

// Multer error handler middleware
function multerErrorHandler(err, req, res, next) {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'file_too_large', message: 'Each file must be under 5MB' });
  }
  if (err && err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'too_many_files', message: 'Maximum 6 files per upload' });
  }
  if (err && err.message === 'invalid_file_type') {
    return res.status(400).json({ error: 'invalid_file_type', message: 'Only JPEG, PNG, and WebP images are allowed' });
  }
  next(err);
}

// POST /api/images/upload — requires auth, accepts up to 6 images
router.post(
  '/upload',
  authMiddleware,
  upload.array('images', 6),
  multerErrorHandler,
  uploadImages
);

// GET /api/images/resolve/:publicId — resolve Cloudinary URL with Redis cache
router.get('/resolve/:publicId', resolveImage);

module.exports = router;
