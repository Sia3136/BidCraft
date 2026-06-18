const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBid } = require('../controllers/bidsController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createBid);

module.exports = router;
