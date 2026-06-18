const db = require('../utils/db');

/**
 * Create a new notification for a user.
 * @param {object|null} clientOrDb - pg client (if running in transaction) or null/undefined (runs on db pool)
 * @param {object} opts
 * @param {number} opts.userId - target user ID
 * @param {string} opts.type - notification type (e.g. 'outbid', 'auction_won', 'auction_lost', 'payment_received', 'order_shipped', 'dispute_update', 'new_follower')
 * @param {string} opts.title - short title
 * @param {string} opts.message - description text
 * @param {object} [opts.data] - optional metadata object (stored as JSONB)
 * @returns {Promise<object>} inserted notification row
 */
async function createNotification(clientOrDb, { userId, type, title, message, data = {} }) {
  const executor = clientOrDb || db;
  const res = await executor.query(
    `INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, FALSE, NOW())
     RETURNING *`,
    [userId, type, title, message, JSON.stringify(data)]
  );
  return res.rows[0];
}

module.exports = { createNotification };
