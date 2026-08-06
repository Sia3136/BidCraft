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
const { getIo } = require('../socket');
const cacheService = require('./cacheService');

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

    // No bids — restart auction (RELIST)
    if (!winningBid) {
      const durationMs = new Date(auction.end_time).getTime() - new Date(auction.start_time).getTime();
      const newEndTime = new Date(Date.now() + durationMs);
      await client.query(
        `UPDATE auctions SET status = 'active', current_bid = start_bid, total_bids = 0, end_time = $1, updated_at = NOW() WHERE id = $2`,
        [newEndTime, auctionId]
      );
      await client.query(`DELETE FROM bids WHERE auction_id = $1`, [auctionId]);
      await client.query('COMMIT');
      cacheService.invalidateCache(['/', '/explore', `/product/${auction.listing_id}`]).catch(() => {});
      return { settled: true, order: null, reason: 'relisted_no_bids' };
    }

    // Reserve price not met — restart auction (RELIST)
    if (auction.reserve_price !== null &&
        Number(winningBid.bid_amount) < Number(auction.reserve_price)) {
      const durationMs = new Date(auction.end_time).getTime() - new Date(auction.start_time).getTime();
      const newEndTime = new Date(Date.now() + durationMs);
      await client.query(
        `UPDATE auctions SET status = 'active', current_bid = start_bid, total_bids = 0, end_time = $1, updated_at = NOW() WHERE id = $2`,
        [newEndTime, auctionId]
      );
      await client.query(`DELETE FROM bids WHERE auction_id = $1`, [auctionId]);
      await client.query('COMMIT');
      cacheService.invalidateCache(['/', '/explore', `/product/${auction.listing_id}`]).catch(() => {});
      return { settled: true, order: null, reason: 'relisted_reserve_not_met' };
    }

    // Create the order
    const orderRes = await client.query(
      `INSERT INTO orders
         (buyer_id, seller_id, listing_id, auction_id, winner_bid_id, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
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

    // Fetch listing title for notifications
    const listingRes = await client.query('SELECT title FROM listings WHERE id = $1', [auction.listing_id]);
    const listingTitle = listingRes.rows[0]?.title || 'item';

    const notificationService = require('./notificationService');
    
    // Notify winner
    await notificationService.createNotification(client, {
      userId: winningBid.bidder_id,
      type: 'auction_won',
      title: 'Auction Won!',
      message: `Congratulations! You won the auction for "${listingTitle}" with a bid of ${winningBid.bid_amount}.`,
      data: { auction_id: auctionId, order_id: order.id, bid_amount: winningBid.bid_amount }
    });

    // Notify other unique bidders
    const otherBiddersRes = await client.query(
      `SELECT DISTINCT bidder_id FROM bids WHERE auction_id = $1 AND bidder_id <> $2`,
      [auctionId, winningBid.bidder_id]
    );
    for (const row of otherBiddersRes.rows) {
      await notificationService.createNotification(client, {
        userId: row.bidder_id,
        type: 'auction_lost',
        title: 'Auction Ended',
        message: `The auction for "${listingTitle}" has ended. Unfortunately, you did not win this time.`,
        data: { auction_id: auctionId }
      });
    }

    // Send transactional emails for settlement
    try {
      const emailService = require('./emailService');
      
      // Fetch winner details
      const winnerRes = await client.query('SELECT email, name FROM users WHERE id = $1', [winningBid.bidder_id]);
      const winnerUser = winnerRes.rows[0];

      // Fetch seller details
      const sellerRes = await client.query('SELECT email, name FROM users WHERE id = $1', [auction.seller_id]);
      const sellerUser = sellerRes.rows[0];

      if (winnerUser && winnerUser.email) {
        await emailService.sendEmail({
          to: winnerUser.email,
          subject: `Congratulations! You won the auction for "${listingTitle}"`,
          text: `Hello ${winnerUser.name || 'Collector'},\n\nGreat news! You won the auction for "${listingTitle}" with a final bid of $${winningBid.bid_amount}.\n\nTo secure your purchase, please visit BidCraft and complete your escrow-protected payment within 12 hours.\n\nBest,\nThe BidCraft Team`,
          ctaLink: `/auction/confirm/${auctionId}`,
          ctaText: `Confirm Your Win`
        });
      }

      if (sellerUser && sellerUser.email) {
        await emailService.sendEmail({
          to: sellerUser.email,
          subject: `Your BidCraft auction for "${listingTitle}" has settled!`,
          text: `Hello ${sellerUser.name || 'Creator'},\n\nYour auction for "${listingTitle}" has successfully ended and settled. The final winning bid is $${winningBid.bid_amount} by ${winnerUser ? winnerUser.name : 'a buyer'}.\n\nOnce the buyer completes their secure payment, we will notify you to ship the item.\n\nBest,\nThe BidCraft Team`,
          ctaLink: `/seller/listings`,
          ctaText: `View Your Listings`
        });
      }
    } catch (emailErr) {
      console.error('Failed to send settlement emails:', emailErr);
    }

    try {
      const io = getIo();
      io.to(`auction_${auctionId}`).emit('auction_ended', {
        auction_id: auctionId,
        winner_id: winningBid.bidder_id,
        winning_bid: winningBid.bid_amount
      });
    } catch (ioErr) {
      console.error('Socket.io error on auction_ended:', ioErr);
    }

    await client.query('COMMIT');
    cacheService.invalidateCache(['/', '/explore', `/product/${auction.listing_id}`]).catch(() => {});
    return { settled: true, order, reason: 'settled' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function processDecline(auctionId, userId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Cancel order
    const orderRes = await client.query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW()
       WHERE auction_id = $1 AND buyer_id = $2 AND status = 'pending'
       RETURNING id, listing_id`,
      [auctionId, userId]
    );

    if (orderRes.rows.length === 0) {
      throw new Error('No pending order found for this user and auction');
    }

    const { listing_id } = orderRes.rows[0];

    // Forfeit deposit
    await client.query(
      `UPDATE bid_deposits SET status = 'forfeited', updated_at = NOW()
       WHERE auction_id = $1 AND user_id = $2`,
      [auctionId, userId]
    );

    // Find the second highest bidder
    const nextBidRes = await client.query(
      `SELECT id, bidder_id, bid_amount
       FROM bids
       WHERE auction_id = $1 AND bidder_id != $2
       ORDER BY bid_amount DESC, created_at ASC
       LIMIT 1`,
      [auctionId, userId]
    );

    const nextBid = nextBidRes.rows[0];
    const auctionRes = await client.query('SELECT seller_id, reserve_price FROM auctions WHERE id = $1', [auctionId]);
    const auction = auctionRes.rows[0];

    if (nextBid && (auction.reserve_price === null || Number(nextBid.bid_amount) >= Number(auction.reserve_price))) {
      // Create order for next bidder
      const newOrderRes = await client.query(
        `INSERT INTO orders
           (buyer_id, seller_id, listing_id, auction_id, winner_bid_id, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
         RETURNING id`,
        [
          nextBid.bidder_id,
          auction.seller_id,
          listing_id,
          auctionId,
          nextBid.id,
          nextBid.bid_amount
        ]
      );
      
      const newOrder = newOrderRes.rows[0];

      // Notify next bidder
      const listingQuery = await client.query('SELECT title FROM listings WHERE id = $1', [listing_id]);
      const listingTitle = listingQuery.rows[0]?.title || 'item';
      
      const notificationService = require('./notificationService');
      await notificationService.createNotification(client, {
        userId: nextBid.bidder_id,
        type: 'auction_won',
        title: 'You are the new winner!',
        message: `The previous winner declined. You won the auction for "${listingTitle}" with a bid of ${nextBid.bid_amount}.`,
        data: { auction_id: auctionId, order_id: newOrder.id, bid_amount: nextBid.bid_amount }
      });

      const emailService = require('./emailService');
      const nextUserRes = await client.query('SELECT email, name FROM users WHERE id = $1', [nextBid.bidder_id]);
      if (nextUserRes.rows[0] && nextUserRes.rows[0].email) {
        await emailService.sendEmail({
          to: nextUserRes.rows[0].email,
          subject: `Good News! You are the new winner for "${listingTitle}"`,
          text: `Hello ${nextUserRes.rows[0].name || 'Collector'},\n\nThe previous winner could not complete the purchase. You are now the winner for "${listingTitle}" with a bid of $${nextBid.bid_amount}.\n\nTo secure your purchase, please visit BidCraft and complete your escrow-protected payment.\n\nBest,\nThe BidCraft Team`
        });
      }
    } else {
      // No other valid bidders, auction failed. Mark listing as active or paused? Let's say paused.
      await client.query(`UPDATE listings SET status = 'paused', updated_at = NOW() WHERE id = $1`, [listing_id]);
    }

    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { closeAuction, processDecline };
