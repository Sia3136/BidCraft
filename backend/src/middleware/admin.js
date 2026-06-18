const db = require('../utils/db');

/**
 * Middleware to restrict route access to admin users.
 * Must be used AFTER auth middleware.
 */
module.exports = async function (req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'unauthorized_admin' });
  }

  try {
    const result = await db.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    const user = result.rows[0];

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'forbidden_admin_only' });
    }

    next();
  } catch (err) {
    next(err);
  }
};
