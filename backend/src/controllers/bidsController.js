const { placeBid } = require('../services/auctionService');
const db = require('../utils/db');
const Joi = require('joi');

const placeBidSchema = Joi.object({
  bid_amount: Joi.number().precision(2).positive().required()
});

async function createBid(req, res, next) {
  try {
    const { id: auctionId } = req.params;
    const { error, value } = placeBidSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const bidderId = req.userId;
    const { bid_amount: bidAmount } = value;

    // Check if bidder is the seller of the auction
    const sellerCheck = await db.query('SELECT seller_id FROM auctions WHERE id = $1', [auctionId]);
    const auction = sellerCheck.rows[0];
    if (!auction) return res.status(404).json({ error: 'auction_not_found' });
    if (auction.seller_id === bidderId) {
      return res.status(400).json({ error: 'seller_cannot_bid_on_own_auction' });
    }

    await placeBid({
      auctionId,
      bidderId,
      bidAmount
    });

    res.status(201).json({ success: true, bidAmount });
  } catch (err) {
    if (
      err.message === 'auction_not_found' ||
      err.message === 'auction_not_active' ||
      err.message === 'auction_ended' ||
      err.message === 'auction_not_started' ||
      err.message === 'bid_too_low' ||
      err.message === 'pre_authorization_required'
    ) {
      const statusCode = err.message === 'auction_not_found' ? 404 : 400;
      return res.status(statusCode).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { createBid };
