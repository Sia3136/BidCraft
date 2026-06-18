const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createReview, getSellerReviews, getOrderReview } = require('../controllers/reviewsController');

router.post('/',                   authMiddleware, createReview);
router.get('/seller/:userId',      getSellerReviews);
router.get('/order/:orderId',      getOrderReview);

module.exports = router;
