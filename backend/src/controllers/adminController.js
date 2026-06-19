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

const reviewKycSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  rejection_reason: Joi.string().max(1000).allow('', null)
});

async function reviewKyc(req, res, next) {
  try {
    const { userId } = req.params;
    const { error, value } = reviewKycSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { status, rejection_reason } = value;

    // Check if user exists
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    const isVerified = status === 'approved';
    const reason = isVerified ? null : (rejection_reason || null);

    const result = await db.query(
      `UPDATE profiles
       SET kyc_status = $1,
           is_verified = $2,
           kyc_rejection_reason = $3,
           updated_at = NOW()
       WHERE user_id = $4
       RETURNING *`,
      [status, isVerified, reason, userId]
    );

    if (result.rows.length === 0) {
      await db.query(
        `INSERT INTO profiles (user_id, kyc_status, is_verified, kyc_rejection_reason, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [userId, status, isVerified, reason]
      );
    }

    // Notify the user of KYC outcome
    const notificationService = require('../services/notificationService');
    const msg = isVerified 
      ? 'Congratulations! Your seller verification (KYC) has been approved.'
      : `Your seller verification (KYC) was rejected. Reason: ${rejection_reason || 'Incomplete details'}`;
    
    await notificationService.createNotification(null, {
      userId,
      type: 'kyc_update',
      title: isVerified ? 'KYC Approved!' : 'KYC Rejected',
      message: msg,
      data: { status, rejection_reason: reason }
    });

    res.json({
      success: true,
      userId,
      kyc_status: status,
      is_verified: isVerified,
      kyc_rejection_reason: reason
    });
  } catch (err) {
    next(err);
  }
}

async function getPendingKyc(req, res, next) {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.name, p.kyc_status, p.kyc_document_type, p.kyc_document_url, p.created_at
       FROM users u
       JOIN profiles p ON p.user_id = u.id
       WHERE p.kyc_status = 'pending'
       ORDER BY p.updated_at ASC`
    );
    res.json(result.rows);
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
  adminResolveDispute,
  reviewKyc,
  getPendingKyc
};
