const { uploadMany } = require('../services/imageService');

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

module.exports = { uploadImages };
