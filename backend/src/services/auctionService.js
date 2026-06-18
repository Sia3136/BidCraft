const db = require('../utils/db');
const { resolveStatus } = require('../utils/auctionLifecycle');

async function placeBid({ auctionId, bidderId, bidAmount }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      `SELECT id, start_bid, current_bid, min_bid_increment, reserve_price, start_time, end_time, status
       FROM auctions
       WHERE id = $1
       FOR UPDATE`,
      [auctionId]
    );

    const auction = res.rows[0];
    if (!auction) throw new Error('auction_not_found');

    // Use lifecycle resolver for accurate status
    const effectiveStatus = resolveStatus(auction);
    if (effectiveStatus === 'scheduled') throw new Error('auction_not_started');
    if (effectiveStatus === 'ended') throw new Error('auction_ended');
    if (effectiveStatus === 'cancelled') throw new Error('auction_not_active');
    if (effectiveStatus !== 'active') throw new Error('auction_not_active');

    const currentBid = auction.current_bid !== null ? Number(auction.current_bid) : Number(auction.start_bid || 0);
    const minIncrement = Number(auction.min_bid_increment || 0);
    const minRequired = currentBid + minIncrement;

    if (Number(bidAmount) < minRequired) throw new Error('bid_too_low');

    // Insert bid and update auction atomically
    await client.query(
      'INSERT INTO bids (auction_id, bidder_id, bid_amount, created_at) VALUES ($1,$2,$3,NOW())',
      [auctionId, bidderId, bidAmount]
    );

    await client.query(
      'UPDATE auctions SET current_bid = $1, total_bids = total_bids + 1, updated_at = NOW() WHERE id = $2',
      [bidAmount, auctionId]
    );

    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { placeBid };
