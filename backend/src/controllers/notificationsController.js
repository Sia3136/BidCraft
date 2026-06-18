const db = require('../utils/db');

/**
 * GET /api/notifications
 * Retrieve notifications for the current user.
 */
async function getNotifications(req, res, next) {
  try {
    const userId = req.userId;

    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({ notifications: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
async function markAsRead(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'notification_not_found' });
    }

    res.json({ success: true, notification: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for the current user as read.
 */
async function markAllAsRead(req, res, next) {
  try {
    const userId = req.userId;

    const result = await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
      [userId]
    );

    res.json({ success: true, count: result.rowCount });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead };
