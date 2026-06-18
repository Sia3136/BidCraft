const db = require('../utils/db');

/**
 * POST /api/wishlist/:listingId
 * Add a listing to the user's wishlist.
 */
async function addToWishlist(req, res, next) {
  try {
    const userId = req.userId;
    const { listingId } = req.params;

    // Check if listing exists
    const listingRes = await db.query('SELECT id FROM listings WHERE id = $1', [listingId]);
    if (listingRes.rows.length === 0) {
      return res.status(404).json({ error: 'listing_not_found' });
    }

    // Check if already in wishlist
    const wishRes = await db.query(
      'SELECT id FROM wishlist WHERE user_id = $1 AND listing_id = $2',
      [userId, listingId]
    );
    if (wishRes.rows.length > 0) {
      return res.status(400).json({ error: 'already_wishlisted' });
    }

    // Insert into wishlist
    await db.query(
      'INSERT INTO wishlist (user_id, listing_id, created_at) VALUES ($1, $2, NOW())',
      [userId, listingId]
    );

    res.status(201).json({ success: true, message: 'listing_added_to_wishlist' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/wishlist/:listingId
 * Remove a listing from the user's wishlist.
 */
async function removeFromWishlist(req, res, next) {
  try {
    const userId = req.userId;
    const { listingId } = req.params;

    const result = await db.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND listing_id = $2 RETURNING id',
      [userId, listingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'wishlist_item_not_found' });
    }

    res.json({ success: true, message: 'listing_removed_from_wishlist' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/wishlist
 * Get current user's wishlist.
 */
async function getWishlist(req, res, next) {
  try {
    const userId = req.userId;

    const result = await db.query(
      `SELECT w.id as wishlist_id, w.created_at as wishlisted_at,
              l.id, l.seller_id, l.title, l.description, l.category, l.category_id,
              l.condition, l.photos, l.listing_type, l.price, l.status,
              u.name as seller_name
       FROM wishlist w
       JOIN listings l ON l.id = w.listing_id
       JOIN users u ON u.id = l.seller_id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json({ wishlist: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
