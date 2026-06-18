const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBid } = require('../controllers/bidsController');
const authMiddleware = require('../middleware/auth');
const { bidLimiter } = require('../middleware/rateLimiter');

router.post('/', authMiddleware, bidLimiter, createBid);

module.exports = router;
