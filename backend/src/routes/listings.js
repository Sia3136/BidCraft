const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getLiveAuctions,
  getNewArrivals,
  uploadImage
} = require('../controllers/listingsController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },  // 8MB max per image
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  }
});

router.post('/', authMiddleware, createListing);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);
router.get('/auctions/live', getLiveAuctions);
router.get('/new-arrivals', getNewArrivals);
router.get('/', getListings);
router.get('/:id', getListingById);
router.put('/:id', authMiddleware, updateListing);
router.delete('/:id', authMiddleware, deleteListing);

module.exports = router;
