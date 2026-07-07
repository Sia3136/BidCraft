const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const auth = require('../middleware/auth');

// POST /api/offers — buyer submits an offer
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, offerAmount } = req.body
    const buyerId = req.userId

    const listingResult = await db.query(
      `SELECT id, price, offers_allowed, minimum_offer_percent, status, buying_method, seller_id
       FROM listings WHERE id = $1`,
      [listingId]
    )
    if (listingResult.rows.length === 0) return res.status(404).json({ error: 'Listing not found' })
    const listing = listingResult.rows[0]

    if (!listing.offers_allowed) return res.status(400).json({ error: 'This listing does not accept offers' })
    if (listing.buying_method === 'Auction') return res.status(400).json({ error: 'Cannot make offers on auction listings' })
    if (listing.status !== 'active') return res.status(400).json({ error: 'Listing is no longer available' })
    if (listing.seller_id === buyerId) return res.status(400).json({ error: 'Cannot make offer on your own listing' })

    const floorPercent = listing.minimum_offer_percent ?? 30;
    const minimumOffer = Math.ceil(listing.price * (1 - floorPercent / 100));
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
      res.json({ success: true, message: 'Offer accepted. Buyer will be notified to complete payment.' })
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

// PUT /api/offers/:offerId/reject
router.put('/:offerId/reject', auth, async (req, res) => {
  try {
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
