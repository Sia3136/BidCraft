/**
 * settlementService.js
 * Closes an ended auction atomically:
 *   - Finds the highest valid bid
 *   - Creates an order (idempotent — safe to call multiple times)
 *   - Marks auction as closed
 *   - Marks listing as sold
 *   - Handles no-bid and reserve-not-met cases
 */
const db = require('../utils/db');

/**
 * Close an auction and create the resulting order.
 * @param {number|string} auctionId
 * @returns {{ settled: boolean, order: object|null, reason: string }}
 */
async function closeAuction(auctionId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the auction row to prevent concurrent settlement
    const auctionRes = await client.query(
      `SELECT a.*, l.seller_id as listing_seller_id
       FROM auctions a
       JOIN listings l ON l.id = a.listing_id
       WHERE a.id = $1
       FOR UPDATE`,
      [auctionId]
    );

    const auction = auctionRes.rows[0];
    if (!auction) throw new Error('auction_not_found');

    // Idempotency: if already closed, return the existing order (if any)
    if (auction.status === 'closed') {
      const existingOrder = await client.query(
        'SELECT * FROM orders WHERE auction_id = $1',
        [auctionId]
      );
      await client.query('COMMIT');
      return {
        settled: true,
        order: existingOrder.rows[0] || null,
        reason: 'already_closed'
      };
    }

    // Only settle auctions that have ended
    const now = new Date();
    if (new Date(auction.end_time) > now && auction.status !== 'cancelled') {
      await client.query('ROLLBACK');
      return { settled: false, order: null, reason: 'auction_not_ended' };
    }

    // Cannot settle cancelled auctions
    if (auction.status === 'cancelled') {
      await client.query('ROLLBACK');
      return { settled: false, order: null, reason: 'auction_cancelled' };
    }

    // Idempotency: check if order already exists for this auction
    const existingOrder = await client.query(
      'SELECT * FROM orders WHERE auction_id = $1',
      [auctionId]
    );
    if (existingOrder.rows.length > 0) {
      // Mark auction closed if not already done
      await client.query(
        `UPDATE auctions SET status = 'closed', updated_at = NOW() WHERE id = $1`,
        [auctionId]
      );
      await client.query('COMMIT');
      return { settled: true, order: existingOrder.rows[0], reason: 'already_settled' };
    }

    // Find the highest bid
    const bidRes = await client.query(
      `SELECT id, bidder_id, bid_amount
       FROM bids
       WHERE auction_id = $1
       ORDER BY bid_amount DESC, created_at ASC
       LIMIT 1`,
      [auctionId]
    );

    const winningBid = bidRes.rows[0];

    // No bids — close with no order
    if (!winningBid) {
      await client.query(
        `UPDATE auctions SET status = 'closed', updated_at = NOW() WHERE id = $1`,
        [auctionId]
      );
      await client.query('COMMIT');
      return { settled: true, order: null, reason: 'no_bids' };
    }

    // Reserve price not met
    if (auction.reserve_price !== null &&
        Number(winningBid.bid_amount) < Number(auction.reserve_price)) {
      await client.query(
        `UPDATE auctions SET status = 'closed', updated_at = NOW() WHERE id = $1`,
        [auctionId]
      );
      await client.query('COMMIT');
      return { settled: true, order: null, reason: 'reserve_not_met' };
    }

    // Create the order
    const orderRes = await client.query(
      `INSERT INTO orders
         (buyer_id, seller_id, listing_id, auction_id, winner_bid_id, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'awaiting_payment', NOW(), NOW())
       RETURNING *`,
      [
        winningBid.bidder_id,
        auction.seller_id,
        auction.listing_id,
        auctionId,
        winningBid.id,
        winningBid.bid_amount
      ]
    );

    const order = orderRes.rows[0];

    // Close the auction
    await client.query(
      `UPDATE auctions SET status = 'closed', updated_at = NOW() WHERE id = $1`,
      [auctionId]
    );

    // Mark listing as sold
    await client.query(
      `UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = $1`,
      [auction.listing_id]
    );

    await client.query('COMMIT');
    return { settled: true, order, reason: 'settled' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { closeAuction };
