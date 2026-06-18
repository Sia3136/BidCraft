const db = require('../utils/db');
const Joi = require('joi');

async function getUsers(req, res, next) {
  try {
    const result = await db.query('SELECT id, email, name, role, created_at FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'buyer'].includes(role)) {
      return res.status(400).json({ error: 'invalid_role' });
    }
    const result = await db.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, role',
      [role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'user_not_found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'user_not_found' });
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function getListings(req, res, next) {
  try {
    const result = await db.query('SELECT id, title, status, seller_id FROM listings ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function deleteListing(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM listings WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'listing_not_found' });
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function getReports(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM reports ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createReport(req, res, next) {
  try {
    const { reported_user_id, reported_listing_id, reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'reason_required' });
    if (!reported_user_id && !reported_listing_id) {
      return res.status(400).json({ error: 'must_report_user_or_listing' });
    }
    const result = await db.query(
      `INSERT INTO reports (reporter_id, reported_user_id, reported_listing_id, reason, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [req.userId, reported_user_id || null, reported_listing_id || null, reason]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateReportStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'reviewed', 'dismissed', 'action_taken'].includes(status)) {
      return res.status(400).json({ error: 'invalid_status' });
    }
    const result = await db.query(
      'UPDATE reports SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'report_not_found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function adminResolveDispute(req, res, next) {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    if (!resolution) return res.status(400).json({ error: 'resolution_required' });
    
    // Admin forces the dispute to be resolved
    const result = await db.query(
      `UPDATE disputes
       SET status = 'resolved', resolution = $1, resolved_by = $2, resolved_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [resolution, req.userId, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'dispute_not_found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getListings,
  deleteListing,
  getReports,
  createReport,
  updateReportStatus,
  adminResolveDispute
};
