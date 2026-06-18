const express = require('express');
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getAuctionById,
  cancelAuction
} = require('../controllers/auctionsController');
const { settleAuction } = require('../controllers/settlementController');
const authMiddleware = require('../middleware/auth');
const bidsRouter = require('./bids');

router.post('/', authMiddleware, createAuction);
router.get('/', getAuctions);
router.get('/:id', getAuctionById);
router.put('/:id/cancel', authMiddleware, cancelAuction);
router.post('/:id/settle', authMiddleware, settleAuction);
router.use('/:id/bids', bidsRouter);

module.exports = router;
