const db = require('../utils/db');
const Joi = require('joi');

// Valid status transitions
const SELLER_TRANSITIONS = { awaiting_payment: null, paid: 'shipped', shipped: 'delivered', delivered: null };
const BUYER_TRANSITIONS  = { shipped: 'delivered' };
const CANCEL_ALLOWED_FOR_BUYER  = new Set(['awaiting_payment', 'pending']);
const CANCEL_ALLOWED_FOR_SELLER = new Set(['awaiting_payment', 'pending', 'paid']);

const patchStatusSchema = Joi.object({
  status: Joi.string()
    .valid('shipped', 'delivered', 'cancelled')
    .required()
});

/**
 * GET /api/orders
 * Returns orders for the current user (as buyer or seller).
 * ?role=buyer|seller   (defaults to showing both)
 */
async function getOrders(req, res, next) {
  try {
    const userId = req.userId;
    const { role, status } = req.query;

    let where = [];
    const params = [];

    if (role === 'buyer') {
      params.push(userId);
      where.push(`o.buyer_id = $${params.length}`);
    } else if (role === 'seller') {
      params.push(userId);
      where.push(`o.seller_id = $${params.length}`);
    } else {
      params.push(userId);
      where.push(`(o.buyer_id = $${params.length} OR o.seller_id = $${params.length})`);
    }

    if (status) {
      params.push(status);
      where.push(`o.status = $${params.length}`);
    }

    const query = `
      SELECT o.*,
             l.title as listing_title, l.photos as listing_photos,
             buyer.name as buyer_name, seller.name as seller_name
      FROM orders o
      LEFT JOIN listings l ON l.id = o.listing_id
      JOIN users buyer  ON buyer.id  = o.buyer_id
      JOIN users seller ON seller.id = o.seller_id
      WHERE ${where.join(' AND ')}
      ORDER BY o.created_at DESC
    `;

    const result = await db.query(query, params);
    res.json({ orders: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 */
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await db.query(
      `SELECT o.*,
              l.title as listing_title, l.photos as listing_photos,
              buyer.name as buyer_name, seller.name as seller_name
       FROM orders o
       LEFT JOIN listings l ON l.id = o.listing_id
       JOIN users buyer  ON buyer.id  = o.buyer_id
       JOIN users seller ON seller.id = o.seller_id
       WHERE o.id = $1`,
      [id]
    );

    const order = result.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.buyer_id !== userId && order.seller_id !== userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/orders/:id/status
 * Allowed transitions:
 *   seller: paid → shipped
 *   buyer:  shipped → delivered
 *   either: awaiting_payment/pending → cancelled (within rules)
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { error, value } = patchStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { status: newStatus } = value;

    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    const order = result.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });

    const isBuyer  = order.buyer_id  === userId;
    const isSeller = order.seller_id === userId;
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    const current = order.status;

    if (newStatus === 'cancelled') {
      if (isBuyer  && !CANCEL_ALLOWED_FOR_BUYER.has(current))  return res.status(400).json({ error: 'cannot_cancel_order', current });
      if (isSeller && !CANCEL_ALLOWED_FOR_SELLER.has(current)) return res.status(400).json({ error: 'cannot_cancel_order', current });
      if (!isBuyer && !isSeller) return res.status(403).json({ error: 'unauthorized_action' });
    } else if (newStatus === 'shipped') {
      if (!isSeller) return res.status(403).json({ error: 'only_seller_can_ship' });
      if (current !== 'paid') return res.status(400).json({ error: 'order_must_be_paid_to_ship', current });
    } else if (newStatus === 'delivered') {
      if (!isBuyer) return res.status(403).json({ error: 'only_buyer_can_confirm_delivery' });
      if (current !== 'shipped') return res.status(400).json({ error: 'order_must_be_shipped_to_deliver', current });
    }

    const updated = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    // When buyer confirms delivery, update listing status and profile stats
    if (newStatus === 'delivered') {
      await db.query(
        `UPDATE profiles
         SET total_sales = total_sales + 1,
             total_revenue = total_revenue + $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [order.total_amount, order.seller_id]
      );
      // Mark order as completed
      await db.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        ['completed', id]
      );
      updated.rows[0].status = 'completed';
    }

    res.json({ order: updated.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOrders, getOrderById, updateOrderStatus };
