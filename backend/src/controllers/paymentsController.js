const db = require('../utils/db');
const Joi = require('joi');
const paymentService = require('../services/paymentService');
const { IS_MOCK } = require('../services/paymentService');

const createOrderSchema = Joi.object({
  order_id: Joi.number().integer().required()
});

const verifySchema = Joi.object({
  razorpay_order_id:  Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  order_id:           Joi.number().integer().required()
});

const createCheckoutSchema = Joi.object({
  listing_id: Joi.number().integer().required(),
  offer_id: Joi.number().integer().optional()
});

const verifyCheckoutSchema = Joi.object({
  razorpay_order_id:  Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  listing_id: Joi.number().integer().required(),
  offer_id: Joi.number().integer().optional(),
  address_id: Joi.number().integer().optional()
});

const verifyCartCheckoutSchema = Joi.object({
  razorpay_order_id:  Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  shipping_address: Joi.object().optional() // from cart checkout wizard
});

async function createCartCheckout(req, res, next) {
  try {
    const userId = req.userId;

    const cartRes = await db.query(
      `SELECT 1 as quantity, l.*
       FROM cart_items c
       JOIN listings l ON c.listing_id = l.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (cartRes.rows.length === 0) {
      return res.status(400).json({ error: 'cart_is_empty' });
    }

    let totalAmount = 0;
    for (const item of cartRes.rows) {
      if (item.seller_id === userId) return res.status(403).json({ error: 'cannot_buy_own_listing' });
      if (item.status !== 'active') return res.status(400).json({ error: `listing_not_active_${item.id}` });
      totalAmount += Number(item.price) * (item.quantity || 1);
    }

    const rpOrder = await paymentService.createOrder({
      amount: totalAmount,
      currency: 'INR',
      receipt: `cart_${userId}_${Date.now()}`,
      notes: { cart_user_id: String(userId) }
    });

    res.status(201).json({
      provider_order_id: rpOrder.id,
      amount: totalAmount,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
      is_mock: IS_MOCK
    });
  } catch (err) {
    next(err);
  }
}

async function verifyCartCheckout(req, res, next) {
  let client;
  try {
    const { error, value } = verifyCartCheckoutSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shipping_address } = value;
    const buyerId = req.userId;

    const valid = paymentService.verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!valid) {
      if (require('../utils/mockHelper').isDevelopmentMockEnabled('payment') && razorpay_signature === 'test_mock_signature') {
        // mock logic strictly bounded to test env
      } else {
        return res.status(400).json({ error: 'invalid_signature' });
      }
    }

    client = await db.pool.connect();
    await client.query('BEGIN');

    // Fetch cart items, locking listings
    const cartRes = await client.query(
      `SELECT 1 as quantity, l.*
       FROM cart_items c
       JOIN listings l ON c.listing_id = l.id
       WHERE c.user_id = $1 FOR UPDATE OF l`,
      [buyerId]
    );

    if (cartRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'cart_is_empty' });
    }
    
    // Check for existing duplicate payment for this exact Razorpay order
    const dupRes = await client.query('SELECT id FROM payments WHERE razorpay_order_id = $1 LIMIT 1', [razorpay_order_id]);
    if (dupRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(200).json({ success: true, message: 'already_processed' }); // idempotent
    }

    const orderIds = [];
    const notificationService = require('../services/notificationService');
    const emailService = require('../services/emailService');

    for (const item of cartRes.rows) {
      if (item.status !== 'active') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `listing_not_active_${item.id}` });
      }

      const itemPrice = Number(item.price) * (item.quantity || 1);

      // 1. Create order
      const orderRes = await client.query(
        `INSERT INTO orders (buyer_id, seller_id, listing_id, total_amount, status, shipping_address, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'paid', $5, NOW(), NOW())
         RETURNING id`,
        [buyerId, item.seller_id, item.id, itemPrice, shipping_address || null]
      );
      const orderId = orderRes.rows[0].id;
      orderIds.push(orderId);

      // 2. Create payment record
      await client.query(
        `INSERT INTO payments (order_id, amount, payment_provider, provider_order_id, razorpay_order_id, razorpay_payment_id, status, created_at, updated_at)
         VALUES ($1, $2, 'razorpay', $3, $3, $4, 'paid', NOW(), NOW())`,
        [orderId, itemPrice, razorpay_order_id, razorpay_payment_id]
      );

      // 3. Create escrow
      await client.query(
        `INSERT INTO escrow (order_id, buyer_id, seller_id, amount_held, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'held', NOW(), NOW())`,
        [orderId, buyerId, item.seller_id, itemPrice]
      );

      // 4. Update listing
      await client.query(`UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = $1`, [item.id]);

      // 5. Notify seller
      await notificationService.createNotification(client, {
        userId: item.seller_id,
        type: 'payment_received',
        title: 'Payment Received!',
        message: `Payment of ₹${itemPrice} received for "${item.title || 'item'}".`,
        data: { order_id: orderId, amount: itemPrice }
      });
      
      const sellerUserRes = await client.query('SELECT email FROM users WHERE id = $1', [item.seller_id]);
      if (sellerUserRes.rows[0]) {
        await emailService.sendEmail({
          to: sellerUserRes.rows[0].email,
          subject: `Payment Received: Order #${orderId}`,
          text: `You have received a payment of ₹${itemPrice} for your item "${item.title || 'item'}".\n\nPlease visit your dashboard to view the order and ship the item.`,
          ctaLink: `/seller/dashboard`,
          ctaText: `View Dashboard`
        });
      }
    }

    // 6. Notify buyer for the entire cart
    await notificationService.createNotification(client, {
      userId: buyerId,
      type: 'order_confirmed',
      title: 'Cart Order Confirmed!',
      message: `Your payment was successful for ${cartRes.rows.length} items.`,
      data: { order_ids: orderIds }
    });
    const buyerRes = await client.query('SELECT email, name FROM users WHERE id = $1', [buyerId]);
    if (buyerRes.rows[0]) {
      await emailService.sendEmail({
        to: buyerRes.rows[0].email,
        subject: `Order Confirmed: ${cartRes.rows.length} items`,
        text: `Hi ${buyerRes.rows[0].name || 'Buyer'},\n\nYour cart payment was successful. The funds are securely held in escrow until you receive your items.\n\nThank you for shopping on BidCraft!`,
        ctaLink: `/orders`,
        ctaText: `View Orders`
      });
    }

    // 7. Clear cart
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [buyerId]);

    await client.query('COMMIT');
    res.json({ success: true, order_ids: orderIds, status: 'paid' });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    next(err);
  } finally {
    if (client) client.release();
  }
}

async function createCheckout(req, res, next) {
  try {
    const { error, value } = createCheckoutSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { listing_id, offer_id } = value;
    const userId = req.userId;

    const listingRes = await db.query('SELECT * FROM listings WHERE id = $1', [listing_id]);
    const listing = listingRes.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id === userId) return res.status(403).json({ error: 'cannot_buy_own_listing' });
    if (listing.status !== 'active') return res.status(400).json({ error: 'listing_not_active' });

    let amount = Number(listing.price);
    
    if (offer_id) {
      const offerRes = await db.query('SELECT * FROM offers WHERE id = $1 AND buyer_id = $2 AND status = $3', [offer_id, userId, 'accepted']);
      const offer = offerRes.rows[0];
      if (!offer) return res.status(400).json({ error: 'valid_accepted_offer_not_found' });
      if (offer.listing_id !== listing_id) return res.status(400).json({ error: 'offer_listing_mismatch' });
      amount = Number(offer.amount);
    } else if (listing.listing_type !== 'fixed' && listing.listing_type !== 'buy_now') {
      return res.status(400).json({ error: 'listing_is_not_fixed_price' });
    }

    const rpOrder = await paymentService.createOrder({
      amount: amount,
      currency: 'INR',
      receipt: `checkout_${listing_id}_${userId}`,
      notes: { listing_id: String(listing_id), buyer_id: String(userId) }
    });

    res.status(201).json({
      provider_order_id: rpOrder.id,
      amount: amount,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
      is_mock: IS_MOCK
    });
  } catch (err) {
    next(err);
  }
}

async function verifyCheckout(req, res, next) {
  let client;
  try {
    const { error, value } = verifyCheckoutSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, listing_id, offer_id, address_id } = value;
    const buyerId = req.userId;

    const valid = paymentService.verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!valid) {
      if (require('../utils/mockHelper').isDevelopmentMockEnabled('payment') && razorpay_signature === 'test_mock_signature') {
        // mock logic strictly bounded to test env
      } else {
        return res.status(400).json({ error: 'invalid_signature' });
      }
    }

    client = await db.pool.connect();
    await client.query('BEGIN');

    // Check for existing duplicate payment for this exact Razorpay order
    const dupRes = await client.query('SELECT id, order_id FROM payments WHERE razorpay_order_id = $1 LIMIT 1', [razorpay_order_id]);
    if (dupRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(200).json({ success: true, order_id: dupRes.rows[0].order_id, status: 'paid', message: 'already_processed' });
    }

    const listingRes = await client.query('SELECT * FROM listings WHERE id = $1 FOR UPDATE', [listing_id]);
    const listing = listingRes.rows[0];
    if (!listing || listing.status !== 'active') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Listing no longer available' });
    }

    let orderPrice = Number(listing.price);
    
    if (offer_id) {
      const offerRes = await client.query('SELECT * FROM offers WHERE id = $1 AND buyer_id = $2 AND status = $3', [offer_id, buyerId, 'accepted']);
      const offer = offerRes.rows[0];
      if (!offer) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'valid_accepted_offer_not_found' });
      }
      if (offer.listing_id !== listing_id) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'offer_listing_mismatch' });
      }
      orderPrice = Number(offer.amount);
    } else if (listing.listing_type !== 'fixed' && listing.listing_type !== 'buy_now') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'listing_is_not_fixed_price' });
    }

    // Create the order
    const orderRes = await client.query(
      `INSERT INTO orders (buyer_id, seller_id, listing_id, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'paid', NOW(), NOW())
       RETURNING *`,
      [buyerId, listing.seller_id, listing_id, orderPrice]
    );
    const order = orderRes.rows[0];

    // Create payment record
    await client.query(
      `INSERT INTO payments (order_id, amount, payment_provider, provider_order_id, razorpay_order_id, razorpay_payment_id, status, created_at, updated_at)
       VALUES ($1, $2, 'razorpay', $3, $3, $4, 'paid', NOW(), NOW())`,
      [order.id, order.total_amount, razorpay_order_id, razorpay_payment_id]
    );

    // Create escrow record
    await client.query(
      `INSERT INTO escrow (order_id, buyer_id, seller_id, amount_held, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'held', NOW(), NOW())`,
      [order.id, order.buyer_id, order.seller_id, order.total_amount]
    );

    // Update listing status
    await client.query(`UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = $1`, [listing_id]);

    await client.query('COMMIT');

    // Notify users AFTER commit so queries inside see the new state
    await notifyUsersOfPayment(order.id).catch(err => console.error('Notification error:', err));

    res.json({ success: true, order_id: order.id, status: 'paid' });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    next(err);
  } finally {
    if (client) client.release();
  }
}

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
      key_id: process.env.RAZORPAY_KEY_ID
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
      key_id: process.env.RAZORPAY_KEY_ID
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

    // Notify users
    await notifyUsersOfPayment(order_id);

    // Update listing status to sold
    await db.query(
      `UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = $1`,
      [order.listing_id]
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

    if (!valid) {
      const logger = require('../utils/logger');
      logger.warn('Webhook verification failed', { ip: req.ip });
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

          // Notify users
          await notifyUsersOfPayment(orderId);

          if (order) {
            // Update listing status to sold
            await db.query(
              `UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = $1`,
              [order.listing_id]
            );
          }
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
 * Helper: Notify users of payment received
 */
async function notifyUsersOfPayment(orderId) {
  try {
    const orderRes = await db.query(
      `SELECT o.buyer_id, o.seller_id, o.total_amount, l.title, b.email as buyer_email, b.name as buyer_name, s.email as seller_email
       FROM orders o
       LEFT JOIN listings l ON l.id = o.listing_id
       LEFT JOIN users b ON b.id = o.buyer_id
       LEFT JOIN users s ON s.id = o.seller_id
       WHERE o.id = $1`,
      [orderId]
    );
    const order = orderRes.rows[0];
    if (order) {
      const notificationService = require('../services/notificationService');
      const emailService = require('../services/emailService');

      // Notify seller
      await notificationService.createNotification(null, {
        userId: order.seller_id,
        type: 'payment_received',
        title: 'Payment Received!',
        message: `Payment of ${order.total_amount} has been received for "${order.title || 'item'}".`,
        data: { order_id: orderId, amount: order.total_amount }
      });
      await emailService.sendEmail({
        to: order.seller_email,
        subject: `Payment Received: Order #${orderId}`,
        text: `You have received a payment of ₹${order.total_amount} for your item "${order.title || 'item'}".\n\nPlease visit your dashboard to view the order and ship the item.`,
        ctaLink: `/seller/dashboard`,
        ctaText: `View Dashboard`
      });

      // Notify buyer
      await notificationService.createNotification(null, {
        userId: order.buyer_id,
        type: 'order_confirmed',
        title: 'Order Confirmed!',
        message: `Your payment of ${order.total_amount} for "${order.title || 'item'}" was successful.`,
        data: { order_id: orderId, amount: order.total_amount }
      });
      await emailService.sendEmail({
        to: order.buyer_email,
        subject: `Order Confirmed: #${orderId}`,
        text: `Hi ${order.buyer_name || 'Buyer'},\n\nYour payment of ₹${order.total_amount} for "${order.title || 'item'}" was successful. The funds are securely held in escrow until you receive your item.\n\nThank you for shopping on BidCraft!`,
        ctaLink: `/orders/${orderId}`,
        ctaText: `View Order`
      });
    }
  } catch (err) {
    console.error('Failed to notify users of payment:', err);
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

module.exports = {
  createPaymentOrder,
  createSetupOrder,
  verifyPayment,
  handleWebhook,
  getPaymentByOrder,
  saveCard,
  createCheckout,
  verifyCheckout,
  createCartCheckout,
  verifyCartCheckout
};
