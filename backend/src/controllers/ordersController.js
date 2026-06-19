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

    // Notify buyer if order is shipped
    if (newStatus === 'shipped') {
      try {
        const listingRes = await db.query('SELECT title FROM listings WHERE id = $1', [order.listing_id]);
        const listingTitle = listingRes.rows[0]?.title || 'item';
        const notificationService = require('../services/notificationService');
        await notificationService.createNotification(null, {
          userId: order.buyer_id,
          type: 'order_shipped',
          title: 'Order Shipped!',
          message: `Your order for "${listingTitle}" has been shipped.`,
          data: { order_id: id }
        });
      } catch (notifErr) {
        console.error('Failed to send order shipped notification:', notifErr);
      }
    }

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
      
      // Escrow Release Logic
      try {
        const paymentRes = await db.query(
          "SELECT razorpay_payment_id FROM payments WHERE order_id = $1 AND status = 'paid' LIMIT 1",
          [id]
        );
        const sellerRes = await db.query('SELECT razorpay_account_id FROM profiles WHERE user_id = $1', [order.seller_id]);
        
        const paymentId = paymentRes.rows[0]?.razorpay_payment_id;
        const sellerAccountId = sellerRes.rows[0]?.razorpay_account_id;
        
        if (paymentId && sellerAccountId) {
          const paymentService = require('../services/paymentService');
          const sellerAmount = Math.floor(Number(order.total_amount) * 0.90);
          await paymentService.createTransfer(paymentId, {
            account: sellerAccountId,
            amount: sellerAmount,
            currency: 'INR',
            notes: { name: 'Escrow release for order ' + id },
            on_hold: false
          });
        }
        
        // Update escrow record
        await db.query(
          "UPDATE escrow SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE order_id = $1",
          [id]
        );
      } catch (escrowErr) {
        console.error('Escrow release failed:', escrowErr);
        // We might want to alert admins here, but we still mark the order completed for the user's view.
      }

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

const createOrderSchema = Joi.object({
  listing_id: Joi.number().integer().required()
});

async function createOrder(req, res, next) {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { listing_id } = value;
    const buyerId = req.userId;

    // 1. Fetch listing details
    const listingRes = await db.query('SELECT * FROM listings WHERE id = $1', [listing_id]);
    const listing = listingRes.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });

    // 2. Validate listing status and type
    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'listing_not_active' });
    }
    if (listing.listing_type !== 'fixed') {
      return res.status(400).json({ error: 'listing_is_not_fixed_price' });
    }
    if (listing.seller_id === buyerId) {
      return res.status(400).json({ error: 'cannot_buy_own_listing' });
    }

    // 3. Create the order
    const orderRes = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, listing_id, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'awaiting_payment', NOW(), NOW())
       RETURNING *`,
      [buyerId, listing.seller_id, listing_id, listing.price]
    );

    res.status(201).json({ order: orderRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOrders, getOrderById, updateOrderStatus, createOrder };
