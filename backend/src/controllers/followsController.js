const db = require('../utils/db');
const notificationService = require('../services/notificationService');

/**
 * POST /api/users/:sellerId/follow
 * Follow a seller.
 */
async function followSeller(req, res, next) {
  try {
    const followerId = req.userId;
    const sellerId = Number(req.params.sellerId);

    // Prevent self-follow
    if (followerId === sellerId) {
      return res.status(400).json({ error: 'cannot_follow_self' });
    }

    // Check if seller exists
    const sellerRes = await db.query('SELECT name FROM users WHERE id = $1', [sellerId]);
    if (sellerRes.rows.length === 0) {
      return res.status(404).json({ error: 'seller_not_found' });
    }
    const sellerName = sellerRes.rows[0].name;

    // Check if already following
    const followCheck = await db.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND seller_id = $2',
      [followerId, sellerId]
    );
    if (followCheck.rows.length > 0) {
      return res.status(400).json({ error: 'already_following' });
    }

    // Insert follow relation
    await db.query(
      'INSERT INTO follows (follower_id, seller_id, created_at) VALUES ($1, $2, NOW())',
      [followerId, sellerId]
    );

    // Fetch follower name for notification
    const followerRes = await db.query('SELECT name FROM users WHERE id = $1', [followerId]);
    const followerName = followerRes.rows[0]?.name || 'Someone';

    // Trigger notification
    try {
      await notificationService.createNotification(null, {
        userId: sellerId,
        type: 'new_follower',
        title: 'New Follower!',
        message: `${followerName} started following you.`,
        data: { follower_id: followerId }
      });
    } catch (notifErr) {
      // Don't fail the request if notification fails to insert
      console.error('Failed to create follow notification:', notifErr);
    }

    res.status(201).json({ success: true, message: `You are now following ${sellerName}` });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/users/:sellerId/follow
 * Unfollow a seller.
 */
async function unfollowSeller(req, res, next) {
  try {
    const followerId = req.userId;
    const sellerId = Number(req.params.sellerId);

    const result = await db.query(
      'DELETE FROM follows WHERE follower_id = $1 AND seller_id = $2 RETURNING id',
      [followerId, sellerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'not_following' });
    }

    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:sellerId/followers
 * Get followers list for a seller.
 */
async function getFollowers(req, res, next) {
  try {
    const sellerId = Number(req.params.sellerId);

    // Check if user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [sellerId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    const result = await db.query(
      `SELECT f.id as follow_id, f.created_at as followed_at,
              u.id as user_id, u.name, u.avatar_url, p.trust_score
       FROM follows f
       JOIN users u ON u.id = f.follower_id
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE f.seller_id = $1
       ORDER BY f.created_at DESC`,
      [sellerId]
    );

    res.json({ followers: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/me/following
 * Get sellers followed by the current user.
 */
async function getFollowing(req, res, next) {
  try {
    const followerId = req.userId;

    const result = await db.query(
      `SELECT f.id as follow_id, f.created_at as followed_at,
              u.id as user_id, u.name, u.avatar_url, p.trust_score, p.bio
       FROM follows f
       JOIN users u ON u.id = f.seller_id
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [followerId]
    );

    res.json({ following: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { followSeller, unfollowSeller, getFollowers, getFollowing };
