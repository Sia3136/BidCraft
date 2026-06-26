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
 * POST /api/payments/create-setup-order
 * Creates a low-value Razorpay order to securely pre-authorize and save a card.
 */
async function createSetupOrder(req, res, next) {
  try {
    const rpOrder = await paymentService.createOrder({
      amount: 100, // 1 INR (100 paise)
      currency: 'INR',
      receipt: `setup_${req.userId}_${Date.now()}`
    });
    res.status(201).json({
      provider_order_id: rpOrder.id,
      amount: 100,
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

    // Create escrow record marking funds as held
    await db.query(
      `INSERT INTO escrow (order_id, buyer_id, seller_id, amount_held, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'held', NOW(), NOW())
       ON CONFLICT (order_id) DO NOTHING`,
      [order.id, order.buyer_id, order.seller_id, order.total_amount]
    );

    // Notify seller
    await notifySellerOfPayment(order_id);

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

          // Fetch order to get buyer/seller details
          const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
          const order = orderRes.rows[0];

          if (order) {
            // Create escrow record marking funds as held
            await db.query(
              `INSERT INTO escrow (order_id, buyer_id, seller_id, amount_held, status, created_at, updated_at)
               VALUES ($1, $2, $3, $4, 'held', NOW(), NOW())
               ON CONFLICT (order_id) DO NOTHING`,
              [order.id, order.buyer_id, order.seller_id, order.total_amount]
            );
          }

          // Notify seller
          await notifySellerOfPayment(orderId);
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

/**
 * Helper: Notify seller of payment received
 */
async function notifySellerOfPayment(orderId) {
  try {
    const orderRes = await db.query(
      `SELECT o.seller_id, o.total_amount, l.title
       FROM orders o
       LEFT JOIN listings l ON l.id = o.listing_id
       WHERE o.id = $1`,
      [orderId]
    );
    const order = orderRes.rows[0];
    if (order) {
      const notificationService = require('../services/notificationService');
      await notificationService.createNotification(null, {
        userId: order.seller_id,
        type: 'payment_received',
        title: 'Payment Received!',
        message: `Payment of ${order.total_amount} has been received for "${order.title || 'item'}".`,
        data: { order_id: orderId, amount: order.total_amount }
      });
    }
  } catch (err) {
    console.error('Failed to notify seller of payment:', err);
  }
}

const saveCardSchema = Joi.object({
  razorpay_payment_id: Joi.string().required()
});

/**
 * POST /api/payments/save-card
 * Links a Razorpay customer ID and registers a pre-authorized card/payment token.
 */
async function saveCard(req, res, next) {
  try {
    const { error, value } = saveCardSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { razorpay_payment_id } = value;
    const userId = req.userId;

    // 1. Fetch user profile
    const profileRes = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    let profile = profileRes.rows[0];
    if (!profile) {
      await db.query('INSERT INTO profiles (user_id) VALUES ($1)', [userId]);
      const newProfileRes = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
      profile = newProfileRes.rows[0];
    }

    let customerId = profile.razorpay_customer_id;

    // 2. If no customer ID exists, create one in Razorpay
    if (!customerId) {
      const userRes = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = userRes.rows[0];
      const customer = await paymentService.createCustomer({
        name: user.name || 'BidCraft User',
        email: user.email,
        phone: profile.phone || undefined
      });
      customerId = customer.id;
      await db.query('UPDATE profiles SET razorpay_customer_id = $1, updated_at = NOW() WHERE user_id = $2', [customerId, userId]);
    }

    // 3. Fetch payment details from Razorpay to get the tokenized card details
    const paymentDetails = await paymentService.fetchPayment(razorpay_payment_id);
    const tokenId = paymentDetails.token_id || `mock_tok_${Date.now()}`;

    // 4. Save token to profiles table
    await db.query(
      `UPDATE profiles
       SET razorpay_card_token = $1,
           updated_at = NOW()
       WHERE user_id = $2`,
      [tokenId, userId]
    );

    res.json({
      success: true,
      razorpay_customer_id: customerId,
      razorpay_card_token: tokenId
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPaymentOrder, createSetupOrder, verifyPayment, handleWebhook, getPaymentByOrder, saveCard };
