const express = require('express');
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getAuctionById,
  cancelAuction,
  createDeposit,
  verifyDeposit,
  submitDecision
} = require('../controllers/auctionsController');
const { settleAuction } = require('../controllers/settlementController');
const authMiddleware = require('../middleware/auth');
const bidsRouter = require('./bids');

router.post('/', authMiddleware, createAuction);
router.get('/', getAuctions);
router.get('/:id', getAuctionById);
router.put('/:id/cancel', authMiddleware, cancelAuction);
router.post('/:id/settle', authMiddleware, settleAuction);
router.post('/:id/deposit', authMiddleware, createDeposit);
router.post('/:id/deposit/verify', authMiddleware, verifyDeposit);
router.post('/:id/decision', authMiddleware, submitDecision);
router.use('/:id/bids', bidsRouter);

module.exports = router;
