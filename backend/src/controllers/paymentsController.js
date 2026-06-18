const db = require('../utils/db');
const Joi = require('joi');
const paymentService = require('../services/paymentService');

const createOrderSchema = Joi.object({
  order_id: Joi.number().integer().required()
});

const verifySchema = Joi.object({
  razorpay_order_id:  Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  order_id:           Joi.number().integer().required()
});

/**
 * POST /api/payments/create-order
 * Creates a Razorpay payment order for a BidCraft order.
 */
async function createPaymentOrder(req, res, next) {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { order_id } = value;
    const userId = req.userId;

    // Fetch the BidCraft order
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.buyer_id !== userId) {
      return res.status(403).json({ error: 'only_buyer_can_pay' });
    }
    if (!['awaiting_payment', 'pending'].includes(order.status)) {
      return res.status(400).json({ error: 'order_not_payable', status: order.status });
    }

    // Check if a pending payment already exists
    const existingPayment = await db.query(
      `SELECT * FROM payments WHERE order_id = $1 AND status = 'pending' ORDER BY created_at DESC LIMIT 1`,
      [order_id]
    );

    let rpOrder;
    let payment;

    if (existingPayment.rows.length > 0) {
      payment = existingPayment.rows[0];
      rpOrder = { id: payment.provider_order_id || payment.razorpay_order_id };
    } else {
      // Create Razorpay order
      rpOrder = await paymentService.createOrder({
        amount: Number(order.total_amount),
        currency: 'INR',
        receipt: `order_${order_id}`,
        notes: { bidcraft_order_id: String(order_id) }
      });

      // Store payment record
      const paymentRes = await db.query(
        `INSERT INTO payments
           (order_id, amount, payment_provider, provider_order_id, razorpay_order_id, status, created_at, updated_at)
         VALUES ($1, $2, 'razorpay', $3, $3, 'pending', NOW(), NOW())
         RETURNING *`,
        [order_id, order.total_amount, rpOrder.id]
      );
      payment = paymentRes.rows[0];
    }

    res.status(201).json({
      payment_id: payment.id,
      provider_order_id: rpOrder.id,
      amount: order.total_amount,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID || 'mock_key'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature and marks the order as paid.
 */
async function verifyPayment(req, res, next) {
  try {
    const { error, value } = verifySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = value;

    // Verify signature
    const valid = paymentService.verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!valid) {
      return res.status(400).json({ error: 'invalid_payment_signature' });
    }

    // Fetch the order
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.buyer_id !== req.userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    // Update payment record
    await db.query(
      `UPDATE payments
       SET status = 'paid',
           provider_transaction_id = $1,
           razorpay_payment_id = $1,
           updated_at = NOW()
       WHERE order_id = $2 AND (provider_order_id = $3 OR razorpay_order_id = $3)`,
      [razorpay_payment_id, order_id, razorpay_order_id]
    );

    // Update order status to paid
    await db.query(
      `UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = $1`,
      [order_id]
    );

    res.json({ success: true, order_id, status: 'paid' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payments/webhook
 * Handles Razorpay webhook events (raw body required).
 */
async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const valid = paymentService.verifyWebhookSignature(
      rawBody,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!valid && !paymentService.MOCK_MODE) {
      return res.status(400).json({ error: 'invalid_webhook_signature' });
    }

    const event = req.body;
    const eventType = event.event;

    if (eventType === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment) {
        const orderId = payment.notes?.bidcraft_order_id;
        if (orderId) {
          await db.query(
            `UPDATE payments SET status='paid', razorpay_payment_id=$1, updated_at=NOW()
             WHERE razorpay_order_id=$2`,
            [payment.id, payment.order_id]
          );
          await db.query(
            `UPDATE orders SET status='paid', updated_at=NOW() WHERE id=$1 AND status IN ('awaiting_payment','pending')`,
            [orderId]
          );
        }
      }
    } else if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity;
      if (payment) {
        await db.query(
          `UPDATE payments SET status='failed', updated_at=NOW() WHERE razorpay_order_id=$1`,
          [payment.order_id]
        );
      }
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/payments/order/:orderId
 * Get payment details for an order.
 */
async function getPaymentByOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.buyer_id !== userId && order.seller_id !== userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    const paymentRes = await db.query(
      `SELECT id, order_id, amount, payment_provider, provider_order_id,
              provider_transaction_id, status, method, created_at, updated_at
       FROM payments WHERE order_id = $1 ORDER BY created_at DESC`,
      [orderId]
    );

    res.json({ payments: paymentRes.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPaymentOrder, verifyPayment, handleWebhook, getPaymentByOrder };
