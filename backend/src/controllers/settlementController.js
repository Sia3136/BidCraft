const db = require('../utils/db');
const { closeAuction } = require('../services/settlementService');

async function settleAuction(req, res, next) {
  try {
    const { id } = req.params;

    // Only the seller of the auction may settle it (or admin in future)
    const auctionCheck = await db.query(
      'SELECT seller_id, status FROM auctions WHERE id = $1',
      [id]
    );
    const auction = auctionCheck.rows[0];
    if (!auction) return res.status(404).json({ error: 'auction_not_found' });
    if (auction.seller_id !== req.userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    const result = await closeAuction(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'auction_not_found') {
      return res.status(404).json({ error: 'auction_not_found' });
    }
    next(err);
  }
}

module.exports = { settleAuction };
