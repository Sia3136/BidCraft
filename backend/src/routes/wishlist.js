const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');

router.get('/', authMiddleware, getWishlist);
router.post('/:listingId', authMiddleware, addToWishlist);
router.delete('/:listingId', authMiddleware, removeFromWishlist);

module.exports = router;
