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

async function getAnalytics(req, res, next) {
  try {
    const usersResult = await db.query('SELECT COUNT(*) FROM users');
    const listingsResult = await db.query("SELECT COUNT(*) FROM listings WHERE status = 'active'");
    const ordersResult = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'completed'");
    const revenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status = 'completed'");
    const disputesResult = await db.query("SELECT COUNT(*) FROM disputes WHERE status = 'open'");

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      activeListings: parseInt(listingsResult.rows[0].count),
      completedOrders: parseInt(ordersResult.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].total_revenue),
      pendingDisputes: parseInt(disputesResult.rows[0].count)
    });
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

async function getDisputes(req, res, next) {
  try {
    const result = await db.query(
      `SELECT d.*, 
              o.buyer_id, o.seller_id, o.total_amount, o.status as order_status,
              u.email as initiator_email, u.name as initiator_name
       FROM disputes d
       JOIN orders o ON o.id = d.order_id
       JOIN users u ON u.id = d.initiator_id
       ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function adminResolveDispute(req, res, next) {
  try {
    const { id } = req.params;
    const { resolution, action } = req.body; // action: 'refund' or 'release'
    if (!resolution) return res.status(400).json({ error: 'resolution_required' });
    if (!['refund', 'release', 'dismiss'].includes(action)) return res.status(400).json({ error: 'action_required (refund, release, dismiss)' });
    
    // Fetch dispute + order
    const disputeRes = await db.query(
      `SELECT d.*, o.buyer_id, o.seller_id
       FROM disputes d
       JOIN orders o ON o.id = d.order_id
       WHERE d.id = $1`,
      [id]
    );

    const dispute = disputeRes.rows[0];
    if (!dispute) return res.status(404).json({ error: 'dispute_not_found' });

    if (['resolved', 'dismissed'].includes(dispute.status)) {
      return res.status(400).json({ error: 'dispute_already_closed' });
    }

    const newStatus = action === 'refund' ? 'resolved' : 'dismissed';

    const result = await db.query(
      `UPDATE disputes
       SET status = $1, resolution = $2, resolved_by = $3, resolved_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [newStatus, resolution, req.userId, id]
    );

    // Apply financial logic
    const paymentService = require('../services/paymentService');
    const paymentRes = await db.query("SELECT razorpay_payment_id FROM payments WHERE order_id = $1 AND status = 'paid' LIMIT 1", [dispute.order_id]);
    const paymentId = paymentRes.rows[0]?.razorpay_payment_id;

    if (action === 'refund') {
      if (paymentId) {
        try {
          await paymentService.refundPayment(paymentId, { notes: { reason: 'Admin resolved dispute in favor of buyer' } });
        } catch (err) {
          console.error('Failed to trigger refund on Razorpay:', err);
        }
      }
      await db.query("UPDATE escrow SET status = 'refunded', updated_at = NOW() WHERE order_id = $1", [dispute.order_id]);
      await db.query("UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1", [dispute.order_id]);
      await db.query("INSERT INTO escrow_audit_log (escrow_id, old_status, new_status, actor_id, reason, created_at) VALUES ($1, $2, 'refunded', $3, 'Admin resolved dispute', NOW())", [dispute.escrow_id, 'disputed', req.userId]);
    } else if (action === 'release' || action === 'dismiss') {
      const sellerRes = await db.query('SELECT razorpay_account_id FROM profiles WHERE user_id = $1', [dispute.seller_id]);
      const sellerAccountId = sellerRes.rows[0]?.razorpay_account_id;
      
      if (paymentId && sellerAccountId) {
        const orderRes = await db.query('SELECT total_amount FROM orders WHERE id = $1', [dispute.order_id]);
        const sellerAmount = Math.floor(Number(orderRes.rows[0].total_amount) * 0.90); // 10% fee
        try {
          await paymentService.createTransfer(paymentId, {
            account: sellerAccountId,
            amount: sellerAmount,
            currency: 'INR',
            notes: { name: 'Escrow release by Admin for order ' + dispute.order_id },
            on_hold: false
          });
        } catch (err) {
          console.error('Failed to trigger transfer to seller:', err);
        }
      }
      await db.query("UPDATE escrow SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE order_id = $1", [dispute.order_id]);
      await db.query("UPDATE orders SET status = 'completed', updated_at = NOW() WHERE id = $1", [dispute.order_id]);
      await db.query("INSERT INTO escrow_audit_log (escrow_id, old_status, new_status, actor_id, reason, created_at) VALUES ($1, $2, 'released', $3, 'Admin dismissed dispute', NOW())", [dispute.escrow_id, 'disputed', req.userId]);
    }

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
  getAnalytics,
  updateUserRole,
  deleteUser,
  getListings,
  deleteListing,
  getReports,
  createReport,
  updateReportStatus,
  adminResolveDispute,
  reviewKyc,
  getPendingKyc,
  getDisputes
};
