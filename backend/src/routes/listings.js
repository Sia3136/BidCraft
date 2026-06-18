const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
} = require('../controllers/listingsController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createListing);
router.get('/', getListings);
router.get('/:id', getListingById);
router.put('/:id', authMiddleware, updateListing);
router.delete('/:id', authMiddleware, deleteListing);

module.exports = router;
