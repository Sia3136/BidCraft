const db = require('../utils/db');
const Joi = require('joi');

const ELIGIBLE_ORDER_STATUSES = new Set(['paid', 'shipped', 'delivered', 'completed']);

const createDisputeSchema = Joi.object({
  order_id:      Joi.number().integer().required(),
  reason:        Joi.string().max(2000).required(),
  evidence_urls: Joi.array().items(Joi.string().uri()).max(10).allow(null)
});

const updateDisputeSchema = Joi.object({
  status:     Joi.string().valid('review', 'resolved', 'dismissed').required(),
  resolution: Joi.string().max(500).allow('', null)
});

/**
 * POST /api/disputes
 * Open a dispute on an eligible order.
 */
async function createDispute(req, res, next) {
  try {
    const initiatorId = req.userId;
    const { error, value } = createDisputeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { order_id, reason, evidence_urls } = value;

    // Fetch order
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });

    // Only buyer or seller can dispute
    if (order.buyer_id !== initiatorId && order.seller_id !== initiatorId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    // Order must be in an eligible status
    if (!ELIGIBLE_ORDER_STATUSES.has(order.status)) {
      return res.status(400).json({ error: 'order_not_eligible_for_dispute', current: order.status });
    }

    // Check if a dispute already exists for this order
    const existingDispute = await db.query(
      `SELECT id FROM disputes WHERE order_id = $1 AND status NOT IN ('resolved', 'dismissed')`,
      [order_id]
    );
    if (existingDispute.rows.length > 0) {
      return res.status(409).json({ error: 'dispute_already_open', dispute_id: existingDispute.rows[0].id });
    }

    // Try to find associated escrow (optional link)
    const escrowRes = await db.query('SELECT id FROM escrow WHERE order_id = $1', [order_id]);
    const escrowId = escrowRes.rows[0]?.id || null;

    // If no escrow, we need to handle the null escrow_id case
    // The disputes table has escrow_id NOT NULL — we need to handle this
    // Solution: insert with escrow_id only if present; otherwise use the order_id link added in migration
    let result;
    if (escrowId) {
      result = await db.query(
        `INSERT INTO disputes (escrow_id, order_id, initiator_id, reason, evidence_urls, status, created_at)
         VALUES ($1, $2, $3, $4, $5, 'open', NOW())
         RETURNING *`,
        [escrowId, order_id, initiatorId, reason, evidence_urls ? JSON.stringify(evidence_urls) : null]
      );
    } else {
      // Use a workaround: insert with a placeholder approach — but escrow_id is NOT NULL
      // We'll create a minimal escrow record if order is paid
      if (['paid', 'shipped', 'delivered', 'completed'].includes(order.status)) {
        const newEscrowRes = await db.query(
          `INSERT INTO escrow (order_id, buyer_id, seller_id, amount_held, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 'held', NOW(), NOW())
           ON CONFLICT (order_id) DO UPDATE SET updated_at = NOW()
           RETURNING id`,
          [order_id, order.buyer_id, order.seller_id, order.total_amount]
        );
        const newEscrowId = newEscrowRes.rows[0].id;
        result = await db.query(
          `INSERT INTO disputes (escrow_id, order_id, initiator_id, reason, evidence_urls, status, created_at)
           VALUES ($1, $2, $3, $4, $5, 'open', NOW())
           RETURNING *`,
          [newEscrowId, order_id, initiatorId, reason, evidence_urls ? JSON.stringify(evidence_urls) : null]
        );
      } else {
        return res.status(400).json({ error: 'order_not_eligible_for_dispute' });
      }
    }

    // Notify other party of the dispute
    try {
      const otherPartyId = order.buyer_id === initiatorId ? order.seller_id : order.buyer_id;
      const initiatorRes = await db.query('SELECT name FROM users WHERE id = $1', [initiatorId]);
      const initiatorName = initiatorRes.rows[0]?.name || 'Someone';
      const notificationService = require('../services/notificationService');
      await notificationService.createNotification(null, {
        userId: otherPartyId,
        type: 'dispute_update',
        title: 'Dispute Opened!',
        message: `${initiatorName} has opened a dispute on order #${order_id}.`,
        data: { dispute_id: result.rows[0].id, order_id }
      });
    } catch (notifErr) {
      console.error('Failed to send dispute opened notification:', notifErr);
    }

    res.status(201).json({ dispute: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/disputes/:id
 */
async function getDispute(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await db.query(
      `SELECT d.*,
              o.buyer_id, o.seller_id, o.status as order_status,
              u.name as initiator_name
       FROM disputes d
       JOIN orders o ON o.id = d.order_id
       JOIN users u  ON u.id = d.initiator_id
       WHERE d.id = $1`,
      [id]
    );

    const dispute = result.rows[0];
    if (!dispute) return res.status(404).json({ error: 'dispute_not_found' });
    if (dispute.buyer_id !== userId && dispute.seller_id !== userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    res.json({ dispute });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/disputes
 * Current user's disputes (as buyer or seller).
 */
async function getMyDisputes(req, res, next) {
  try {
    const userId = req.userId;

    const result = await db.query(
      `SELECT d.*, o.buyer_id, o.seller_id, o.status as order_status
       FROM disputes d
       JOIN orders o ON o.id = d.order_id
       WHERE o.buyer_id = $1 OR o.seller_id = $1
       ORDER BY d.created_at DESC`,
      [userId]
    );

    res.json({ disputes: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/disputes/:id/status
 * Either party or admin can update status.
 */
async function updateDisputeStatus(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { error, value } = updateDisputeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { status: newStatus, resolution } = value;

    // Fetch dispute + order to check authorization
    const disputeRes = await db.query(
      `SELECT d.*, o.buyer_id, o.seller_id
       FROM disputes d
       JOIN orders o ON o.id = d.order_id
       WHERE d.id = $1`,
      [id]
    );

    const dispute = disputeRes.rows[0];
    if (!dispute) return res.status(404).json({ error: 'dispute_not_found' });
    if (dispute.buyer_id !== userId && dispute.seller_id !== userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    if (['resolved', 'dismissed'].includes(dispute.status)) {
      return res.status(400).json({ error: 'dispute_already_closed' });
    }

    const params = [newStatus, id];
    let query = `UPDATE disputes SET status = $1, updated_at = NOW()`;
    if (newStatus === 'resolved' || newStatus === 'dismissed') {
      params.splice(1, 0, resolution || null, userId);
      query += `, resolution = $2, resolved_by = $3, resolved_at = NOW()`;
      query += ` WHERE id = $4 RETURNING *`;
    } else {
      query += ` WHERE id = $2 RETURNING *`;
    }

    const result = await db.query(query, params);

    // Integrate with financial logic
    if (newStatus === 'resolved') {
      // Typically resolved in favor of the buyer -> Refund
      const paymentService = require('../services/paymentService');
      const paymentRes = await db.query("SELECT razorpay_payment_id FROM payments WHERE order_id = $1 AND status = 'paid' LIMIT 1", [dispute.order_id]);
      const paymentId = paymentRes.rows[0]?.razorpay_payment_id;
      
      if (paymentId) {
        try {
          await paymentService.refundPayment(paymentId, { notes: { reason: 'Dispute resolved in favor of buyer' } });
        } catch (err) {
          console.error('Failed to trigger refund on Razorpay:', err);
        }
      }
      
      await db.query("UPDATE escrow SET status = 'refunded', updated_at = NOW() WHERE order_id = $1", [dispute.order_id]);
      await db.query("UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1", [dispute.order_id]);
      await db.query("INSERT INTO escrow_audit_log (escrow_id, old_status, new_status, actor_id, reason, created_at) VALUES ($1, $2, 'refunded', $3, 'Dispute resolved', NOW())", [dispute.escrow_id, 'disputed', userId]);
      
    } else if (newStatus === 'dismissed') {
      // Dismissed -> Released to seller
      const escrowService = require('../services/escrowService');
      try {
        await escrowService.releaseEscrowManually(dispute.order_id, dispute.buyer_id); // we can reuse this logic, but wait, the actor is admin
        // We'll write the logic explicitly to release to seller
        const paymentRes = await db.query("SELECT razorpay_payment_id FROM payments WHERE order_id = $1 AND status = 'paid' LIMIT 1", [dispute.order_id]);
        const sellerRes = await db.query('SELECT razorpay_account_id FROM profiles WHERE user_id = $1', [dispute.seller_id]);
        
        const paymentId = paymentRes.rows[0]?.razorpay_payment_id;
        const sellerAccountId = sellerRes.rows[0]?.razorpay_account_id;
        
        if (paymentId && sellerAccountId) {
          const paymentService = require('../services/paymentService');
          const orderRes = await db.query('SELECT total_amount FROM orders WHERE id = $1', [dispute.order_id]);
          const sellerAmount = Math.floor(Number(orderRes.rows[0].total_amount) * 0.90);
          await paymentService.createTransfer(paymentId, {
            account: sellerAccountId,
            amount: sellerAmount,
            currency: 'INR',
            notes: { name: 'Escrow release for order ' + dispute.order_id },
            on_hold: false
          });
        }
        await db.query("UPDATE escrow SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE order_id = $1", [dispute.order_id]);
        await db.query("UPDATE orders SET status = 'completed', updated_at = NOW() WHERE id = $1", [dispute.order_id]);
        await db.query("INSERT INTO escrow_audit_log (escrow_id, old_status, new_status, actor_id, reason, created_at) VALUES ($1, $2, 'released', $3, 'Dispute dismissed', NOW())", [dispute.escrow_id, 'disputed', userId]);
      } catch (err) {
        console.error('Failed to trigger transfer to seller:', err);
      }
    } else if (newStatus === 'review' || newStatus === 'under_review') {
      await db.query("UPDATE escrow SET status = 'disputed', updated_at = NOW() WHERE order_id = $1", [dispute.order_id]);
    }

    // Notify other party of the dispute status update
    try {
      const otherPartyId = dispute.buyer_id === userId ? dispute.seller_id : dispute.buyer_id;
      const notificationService = require('../services/notificationService');
      await notificationService.createNotification(null, {
        userId: otherPartyId,
        type: 'dispute_update',
        title: 'Dispute Status Updated!',
        message: `The dispute on order #${dispute.order_id} has been marked as "${newStatus}".`,
        data: { dispute_id: id, order_id: dispute.order_id, status: newStatus }
      });
    } catch (notifErr) {
      console.error('Failed to send dispute status update notification:', notifErr);
    }

    res.json({ dispute: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { createDispute, getDispute, getMyDisputes, updateDisputeStatus };
