const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const auth = require('../middleware/auth');

// GET /api/seller/listings — seller's own listings
router.get('/listings', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id, title, price, buying_method AS "buyingMethod",
        status, image_urls[1] AS image,
        current_bid AS "currentBid", bid_count AS "bidCount",
        auction_ends_at AS "auctionEndsAt",
        created_at AS "createdAt", updated_at AS "updatedAt"
      FROM listings
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `, [req.userId])
    res.json({ listings: result.rows })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch seller listings' })
  }
})

// GET /api/seller/orders — orders for the seller's listings
router.get('/orders', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        o.id, o.total_amount AS amount, o.status AS "orderStatus",
        o.created_at AS "createdAt",
        e.state AS "escrowState",
        l.id AS "listingId", l.title AS "listingTitle",
        l.image_urls[1] AS "listingImage",
        u.name AS "buyerName", u.email AS "buyerEmail"
      FROM orders o
      JOIN listings l ON l.id = o.listing_id
      JOIN users u ON u.id = o.buyer_id
      LEFT JOIN escrow e ON e.order_id = o.id
      WHERE l.seller_id = $1
      ORDER BY o.created_at DESC
    `, [req.userId])
    res.json({ orders: result.rows })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch seller orders' })
  }
})

// PUT /api/seller/listings/:id — edit a listing (only if status = active and seller_id matches)
router.put('/listings/:id', auth, async (req, res) => {
  try {
    const { title, description, price, specifications } = req.body
    const result = await db.query(`
      UPDATE listings
      SET title=$1, description=$2, price=$3, specifications=$4, updated_at=NOW()
      WHERE id=$5 AND seller_id=$6 AND status='active'
      RETURNING id
    `, [title, description, price, JSON.stringify(specifications), req.params.id, req.userId])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or not editable' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update listing' })
  }
})

// DELETE /api/seller/listings/:id — soft delete (set status = deleted)
router.delete('/listings/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      UPDATE listings SET status='deleted', updated_at=NOW()
      WHERE id=$1 AND seller_id=$2 AND status='active'
      RETURNING id
    `, [req.params.id, req.userId])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or already removed' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete listing' })
  }
})

module.exports = router;
