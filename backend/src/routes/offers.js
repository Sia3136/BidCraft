const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const auth = require('../middleware/auth');

// GET /api/offers — buyer fetches their own offers
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        o.id, o.amount, o.status, o.created_at AS "createdAt",
        l.id AS "listingId", l.title AS "listingTitle",
        l.price AS "listingPrice", l.image_urls[1] AS "listingImage"
      FROM offers o
      JOIN listings l ON l.id = o.listing_id
      WHERE o.buyer_id = $1
      ORDER BY o.created_at DESC
    `, [req.userId])
    res.json({ offers: result.rows })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your offers' })
  }
})

// GET /api/offers/:offerId — get specific offer details (seller or buyer)
router.get('/:offerId', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        o.id, o.amount, o.status, o.created_at AS "createdAt", o.buyer_id AS "buyerId",
        l.id AS "listingId", l.title AS "listingTitle", l.seller_id AS "sellerId",
        l.price AS "listingPrice", l.image_urls[1] AS "listingImage",
        u.name AS "buyerName"
      FROM offers o
      JOIN listings l ON l.id = o.listing_id
      JOIN users u ON u.id = o.buyer_id
      WHERE o.id = $1
    `, [req.params.offerId])

    if (result.rows.length === 0) return res.status(404).json({ error: 'Offer not found' })

    const offer = result.rows[0]
    if (offer.sellerId !== req.userId && offer.buyerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to view this offer' })
    }

    res.json({ offer })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch offer' })
  }
})

// POST /api/offers — buyer submits an offer
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, offerAmount } = req.body
    const buyerId = req.userId

    const listingResult = await db.query(
      `SELECT id, title, price, offers_allowed, minimum_offer_percent, status, buying_method, seller_id
       FROM listings WHERE id = $1`,
      [listingId]
    )
    if (listingResult.rows.length === 0) return res.status(404).json({ error: 'Listing not found' })
    const listing = listingResult.rows[0]

    if (!listing.offers_allowed) return res.status(400).json({ error: 'This listing does not accept offers' })
    if (listing.buying_method === 'Auction') return res.status(400).json({ error: 'Cannot make offers on auction listings' })
    if (listing.status !== 'active') return res.status(400).json({ error: 'Listing is no longer available' })
    if (listing.seller_id === buyerId) return res.status(400).json({ error: 'Cannot make offer on your own listing' })

    const floorPercent = listing.minimum_offer_percent && listing.minimum_offer_percent > 0 ? listing.minimum_offer_percent : 60;
    const minimumOffer = Math.ceil(listing.price * (floorPercent / 100));
    if (offerAmount < minimumOffer) {
      return res.status(400).json({
        error: `Minimum offer is ₹${minimumOffer}`
      })
    }

    // Check no pending offer from this buyer already
    const existing = await db.query(
      `SELECT id FROM offers WHERE listing_id=$1 AND buyer_id=$2 AND status='pending'`,
      [listingId, buyerId]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You already have a pending offer on this listing' })
    }

    const result = await db.query(`
      INSERT INTO offers (listing_id, buyer_id, amount, status, created_at)
      VALUES ($1, $2, $3, 'pending', NOW())
      RETURNING id
    `, [listingId, buyerId, offerAmount])
    const offerId = result.rows[0].id;

    // Notify seller
    await db.query(`
      INSERT INTO notifications (user_id, type, message, link)
      VALUES ($1, 'new_offer', $2, $3)
    `, [listing.seller_id, `You received an offer of ₹${offerAmount} on ${listing.title}`, `/seller/offers/${offerId}`]);

    try {
      const sellerRes = await db.query('SELECT email FROM users WHERE id = $1', [listing.seller_id]);
      if (sellerRes.rows.length > 0) {
        const emailService = require('../services/emailService');
        await emailService.sendEmail({
          to: sellerRes.rows[0].email,
          subject: `New Offer Received: ${listing.title}`,
          text: `You have received a new offer of ₹${offerAmount} on your listing "${listing.title}".\n\nPlease visit your dashboard to review and accept or decline the offer.`,
          ctaLink: `/seller/offers/${offerId}`,
          ctaText: `Review Offer`
        });
      }
    } catch (emailErr) {
      console.error('Failed to send offer email:', emailErr);
    }

    res.status(201).json({ offerId, success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit offer' })
  }
})

// PUT /api/offers/:offerId/accept — seller accepts offer
router.put('/:offerId/accept', auth, async (req, res) => {
  try {
    // Verify seller owns the listing this offer is for
    const result = await db.query(`
      SELECT o.id, o.amount, o.buyer_id, o.listing_id
      FROM offers o
      JOIN listings l ON l.id = o.listing_id
      WHERE o.id = $1 AND l.seller_id = $2 AND o.status = 'pending'
    `, [req.params.offerId, req.userId])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Offer not found' })

    const client = await db.pool.connect()
    try {
      await client.query('BEGIN')
      
      await client.query(
        `UPDATE offers SET status='accepted', updated_at=NOW() WHERE id=$1`,
        [req.params.offerId]
      )
      // Reject all other pending offers for same listing
      await client.query(
        `UPDATE offers SET status='rejected', updated_at=NOW()
         WHERE listing_id=$1 AND id!=$2 AND status='pending'`,
        [result.rows[0].listing_id, req.params.offerId]
      )

      await client.query('COMMIT')

      // Notify Buyer via Notification & Email
      try {
        const buyerRes = await db.query('SELECT u.email, u.id FROM users u WHERE u.id = $1', [result.rows[0].buyer_id]);
        const listingRes = await db.query('SELECT title FROM listings WHERE id = $1', [result.rows[0].listing_id]);
        
        if (buyerRes.rows.length > 0 && listingRes.rows.length > 0) {
          const buyerEmail = buyerRes.rows[0].email;
          const listingTitle = listingRes.rows[0].title;
          const amount = result.rows[0].amount;

          // In-app notification
          await db.query(`
            INSERT INTO notifications (user_id, type, message, link)
            VALUES ($1, 'offer_accepted', $2, $3)
          `, [buyerRes.rows[0].id, `Your offer of ₹${amount} on ${listingTitle} was accepted!`, `/profile/offers`]);

          // Email
          const emailService = require('../services/emailService');
          await emailService.sendEmail({
            to: buyerEmail,
            subject: `Offer Accepted: ${listingTitle}`,
            text: `Good news! Your offer of ₹${amount} for "${listingTitle}" has been accepted.\n\nPlease complete your checkout to secure the item.`,
            ctaLink: `/product/${result.rows[0].listing_id}?offerId=${req.params.offerId}`,
            ctaText: `Complete Checkout`
          });
        }
      } catch (notifyErr) {
        console.error('Failed to send buyer acceptance notification:', notifyErr);
      }

      res.json({ success: true, message: 'Offer accepted. Buyer has been notified to complete payment.' })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept offer' })
  }
})

router.put('/:offerId/reject', auth, async (req, res) => {
  try {
    const check = await db.query(`
      SELECT o.id
      FROM offers o
      JOIN listings l ON l.id = o.listing_id
      WHERE o.id = $1 AND l.seller_id = $2 AND o.status = 'pending'
    `, [req.params.offerId, req.userId]);

    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found or not authorised' });
    }

    const result = await db.query(
      `UPDATE offers SET status='rejected', updated_at=NOW()
       WHERE id=$1 AND status='pending'`,
      [req.params.offerId]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reject offer' })
  }
})

module.exports = router;
