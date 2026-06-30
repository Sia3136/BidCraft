const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', authMiddleware, getCart);
router.post('/:listingId', authMiddleware, addToCart);
router.delete('/:listingId', authMiddleware, removeFromCart);

module.exports = router;
