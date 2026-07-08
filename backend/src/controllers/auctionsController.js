const db = require('../utils/db');
const Joi = require('joi');
const { withResolvedStatus, resolveStatus } = require('../utils/auctionLifecycle');

const createAuctionSchema = Joi.object({
  listing_id: Joi.number().integer().required(),
  start_bid: Joi.number().precision(2).min(0).required(),
  reserve_price: Joi.number().precision(2).positive().allow(null),
  min_bid_increment: Joi.number().precision(2).min(0).default(10.00),
  start_time: Joi.date().required(),
  end_time: Joi.date().greater(Joi.ref('start_time')).required()
});

async function createAuction(req, res, next) {
  try {
    const { error, value } = createAuctionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { listing_id, start_bid, reserve_price, min_bid_increment, start_time, end_time } = value;
    const sellerId = req.userId;

    // Check if listing exists, belongs to user, and is of type 'auction'
    const listingCheck = await db.query(
      'SELECT seller_id, listing_type FROM listings WHERE id = $1',
      [listing_id]
    );

    const listing = listingCheck.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id !== sellerId) return res.status(403).json({ error: 'unauthorized_action' });
    if (listing.listing_type !== 'auction') return res.status(400).json({ error: 'listing_type_must_be_auction' });

    // Check if auction already exists for this listing
    const existingAuction = await db.query('SELECT id FROM auctions WHERE listing_id = $1', [listing_id]);
    if (existingAuction.rows.length > 0) {
      return res.status(409).json({ error: 'auction_already_exists_for_listing' });
    }

    // Determine initial stored status based on start_time
    const initialStatus = new Date(start_time) > new Date() ? 'scheduled' : 'active';

    const result = await db.query(
      `INSERT INTO auctions (listing_id, seller_id, start_bid, current_bid, reserve_price, min_bid_increment, start_time, end_time, status, total_bids, created_at, updated_at)
       VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8, 0, NOW(), NOW())
       RETURNING *`,
      [listing_id, sellerId, start_bid, reserve_price || null, min_bid_increment, start_time, end_time, initialStatus]
    );

    res.status(201).json({ auction: withResolvedStatus(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}

async function getAuctions(req, res, next) {
  try {
    const { status } = req.query;
    let queryText = `
      SELECT a.*, l.title, l.description, l.photos, l.condition
      FROM auctions a
      JOIN listings l ON a.listing_id = l.id
      WHERE 1=1`;
    const params = [];

    // Note: status filter applies AFTER resolveStatus, so we filter in JS
    queryText += ' ORDER BY a.end_time ASC';

    const result = await db.query(queryText, params);
    let auctions = result.rows.map(withResolvedStatus);

    // Apply status filter after resolution (client-side, since status is computed)
    if (status) {
      auctions = auctions.filter((a) => a.status === status);
    }

    res.json({ auctions });
  } catch (err) {
    next(err);
  }
}

async function getAuctionById(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch auction joined with listing info
    const auctionRes = await db.query(
      `SELECT a.*, l.title, l.description, l.photos, l.condition
       FROM auctions a
       JOIN listings l ON a.listing_id = l.id
       WHERE a.id = $1`,
      [id]
    );

    const auction = auctionRes.rows[0];
    if (!auction) return res.status(404).json({ error: 'auction_not_found' });

    // Fetch bids history for this auction
    const bidsRes = await db.query(
      `SELECT b.id, b.bid_amount, b.created_at, u.name as bidder_name, u.avatar_url as bidder_avatar
       FROM bids b
       JOIN users u ON b.bidder_id = u.id
       WHERE b.auction_id = $1
       ORDER BY b.bid_amount DESC, b.created_at ASC`,
      [id]
    );

    res.json({
      auction: withResolvedStatus(auction),
      bids: bidsRes.rows
    });
  } catch (err) {
    next(err);
  }
}

async function cancelAuction(req, res, next) {
  try {
    const { id } = req.params;

    const auctionRes = await db.query('SELECT * FROM auctions WHERE id = $1', [id]);
    const auction = auctionRes.rows[0];
    if (!auction) return res.status(404).json({ error: 'auction_not_found' });
    if (auction.seller_id !== req.userId) return res.status(403).json({ error: 'unauthorized_action' });

    const effectiveStatus = resolveStatus(auction);
    if (effectiveStatus === 'ended') {
      return res.status(400).json({ error: 'cannot_cancel_ended_auction' });
    }
    if (effectiveStatus === 'cancelled') {
      return res.status(400).json({ error: 'auction_already_cancelled' });
    }

    const result = await db.query(
      'UPDATE auctions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      ['cancelled', id]
    );

    res.json({ auction: withResolvedStatus(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}

const paymentService = require('../services/paymentService');

const createDepositSchema = Joi.object({
  amount: Joi.number().precision(2).required()
});

async function createDeposit(req, res, next) {
  try {
    const { id: auctionId } = req.params;
    const { error, value } = createDepositSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    // Check if deposit already exists
    const existing = await db.query('SELECT id FROM bid_deposits WHERE auction_id = $1 AND user_id = $2 AND status = $3', [auctionId, req.userId, 'held']);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Deposit already paid' });

    const rpOrder = await paymentService.createOrder({
      amount: value.amount,
      currency: 'INR',
      receipt: `deposit_${auctionId}_${req.userId}`
    });

    res.json({
      provider_order_id: rpOrder.id,
      amount: value.amount,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID || 'mock_key'
    });
  } catch(err) { next(err); }
}

const verifyDepositSchema = Joi.object({
  razorpay_order_id:  Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  amount: Joi.number().precision(2).required()
});

async function verifyDeposit(req, res, next) {
  try {
    const { id: auctionId } = req.params;
    const { error, value } = verifyDepositSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const valid = paymentService.verifySignature(value.razorpay_order_id, value.razorpay_payment_id, value.razorpay_signature);
    if (!valid && !paymentService.MOCK_MODE) return res.status(400).json({ error: 'invalid_signature' });

    await db.query(
      `INSERT INTO bid_deposits (auction_id, user_id, amount, razorpay_payment_id, status) VALUES ($1, $2, $3, $4, 'held')
       ON CONFLICT (auction_id, user_id) DO UPDATE SET amount = EXCLUDED.amount, razorpay_payment_id = EXCLUDED.razorpay_payment_id, status = 'held'`, 
      [auctionId, req.userId, value.amount, value.razorpay_payment_id]
    );

    res.json({ success: true });
  } catch(err) { next(err); }
}

const submitDecisionSchema = Joi.object({
  decision: Joi.string().valid('confirm', 'decline').required()
});

async function submitDecision(req, res, next) {
  try {
    const { id: auctionId } = req.params;
    const { error, value } = submitDecisionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (value.decision === 'confirm') {
      // Just mark as success, user proceeds to checkout
      return res.json({ success: true });
    } else {
      const settlementService = require('../services/settlementService');
      await settlementService.processDecline(auctionId, req.userId);
      return res.json({ success: true });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  cancelAuction,
  createDeposit,
  verifyDeposit,
  submitDecision
};
