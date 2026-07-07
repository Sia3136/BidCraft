const db = require('../utils/db');
const Joi = require('joi');

/**
 * GET /api/cart
 */
async function getCart(req, res, next) {
  try {
    const userId = parseInt(req.userId, 10);
    const result = await db.query(
      `SELECT c.id as cart_item_id, c.quantity, l.*, seller.name as seller_name
       FROM cart_items c
       JOIN listings l ON l.id = c.listing_id
       JOIN users seller ON seller.id = l.seller_id
       WHERE c.user_id = $1 AND l.status = 'active'
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json({ cart: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cart/:listingId
 */
async function addToCart(req, res, next) {
  try {
    const userId = parseInt(req.userId, 10);
    const listingId = parseInt(req.params.listingId, 10);
    if (isNaN(listingId)) return res.status(400).json({ error: 'invalid_listing_id' });

    // Validate listing exists and is active
    const listingRes = await db.query('SELECT * FROM listings WHERE id = $1', [listingId]);
    const listing = listingRes.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.status !== 'active') return res.status(400).json({ error: 'listing_not_active' });
    if (listing.seller_id === userId) return res.status(400).json({ error: 'cannot_add_own_listing_to_cart' });
    if (listing.listing_type !== 'fixed' && listing.listing_type !== 'buy_now') return res.status(400).json({ error: 'only_fixed_price_items_can_be_added_to_cart' });

    // Add to cart
    await db.query(
      `INSERT INTO cart_items (user_id, listing_id, created_at, updated_at) 
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (user_id, listing_id) DO NOTHING`,
      [userId, listingId]
    );

    res.json({ success: true, message: 'Added to cart' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart/:listingId
 */
async function removeFromCart(req, res, next) {
  try {
    const userId = parseInt(req.userId, 10);
    const listingId = parseInt(req.params.listingId, 10);
    if (isNaN(listingId)) return res.status(400).json({ error: 'invalid_listing_id' });

    await db.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND listing_id = $2`,
      [userId, listingId]
    );

    res.json({ success: true, message: 'Removed from cart' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, removeFromCart };
