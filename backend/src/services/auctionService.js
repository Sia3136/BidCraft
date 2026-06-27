const db = require('../utils/db');
const { resolveStatus } = require('../utils/auctionLifecycle');
const { getIo } = require('../socket');

async function placeBid({ auctionId, bidderId, bidAmount }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Verify bidder has a pre-authorized payment method
    const profileRes = await client.query(
      `SELECT razorpay_card_token FROM profiles WHERE user_id = $1`,
      [bidderId]
    );
    const profile = profileRes.rows[0];
    if (!profile || !profile.razorpay_card_token) {
      throw new Error('pre_authorization_required');
    }

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

    // Get previous highest bidder
    const prevBidRes = await client.query(
      `SELECT bidder_id, bid_amount FROM bids WHERE auction_id = $1 ORDER BY bid_amount DESC, created_at ASC LIMIT 1`,
      [auctionId]
    );
    const prevBid = prevBidRes.rows[0];

    // Fetch listing title for notification
    const listingRes = await client.query(
      `SELECT l.title FROM auctions a JOIN listings l ON l.id = a.listing_id WHERE a.id = $1`,
      [auctionId]
    );
    const listingTitle = listingRes.rows[0]?.title || 'item';

    // Insert bid and update auction atomically
    await client.query(
      'INSERT INTO bids (auction_id, bidder_id, bid_amount, created_at) VALUES ($1,$2,$3,NOW())',
      [auctionId, bidderId, bidAmount]
    );

    await client.query(
      'UPDATE auctions SET current_bid = $1, total_bids = total_bids + 1, updated_at = NOW() WHERE id = $2',
      [bidAmount, auctionId]
    );

    // Emit real-time bid_placed event
    try {
      const io = getIo();
      io.to(`auction_${auctionId}`).emit('bid_placed', {
        auction_id: auctionId,
        bidder_id: bidderId,
        bid_amount: bidAmount,
        created_at: new Date().toISOString()
      });
    } catch (ioErr) {
      console.error('Socket.io error on bid_placed:', ioErr);
    }

    // If there is a previous highest bidder and they are not the current bidder, notify them
    if (prevBid && prevBid.bidder_id !== bidderId) {
      const notificationService = require('./notificationService');
      await notificationService.createNotification(client, {
        userId: prevBid.bidder_id,
        type: 'outbid',
        title: 'You have been outbid!',
        message: `You have been outbid on "${listingTitle}". The new highest bid is ${bidAmount}.`,
        data: { auction_id: auctionId, new_bid_amount: bidAmount }
      });

      // Emit outbid event to specific user (requires them to join a room with their user ID)
      try {
        const io = getIo();
        io.to(`user_${prevBid.bidder_id}`).emit('outbid', {
          auction_id: auctionId,
          listing_title: listingTitle,
          new_bid_amount: bidAmount
        });
      } catch (ioErr) {
        console.error('Socket.io error on outbid:', ioErr);
      }

      // Send transactional email
      try {
        const bidderUserRes = await client.query('SELECT email, name FROM users WHERE id = $1', [prevBid.bidder_id]);
        const bidderUser = bidderUserRes.rows[0];
        if (bidderUser && bidderUser.email) {
          const emailService = require('./emailService');
          await emailService.sendEmail({
            to: bidderUser.email,
            subject: `You've been outbid on ${listingTitle}!`,
            text: `Hello ${bidderUser.name || 'Bidder'},\n\nYou have been outbid on "${listingTitle}". The new highest bid is $${bidAmount}.\n\nVisit BidCraft to place another bid and stay in the running!\n\nBest,\nThe BidCraft Team`
          });
        }
      } catch (emailErr) {
        console.error('Failed to send outbid email:', emailErr);
      }
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

module.exports = { placeBid };
