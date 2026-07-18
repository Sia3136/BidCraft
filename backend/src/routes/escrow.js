const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => `${req.ip}_${req.params.orderId}`,
  message: { error: 'Too many OTP verification attempts. Please try again later.' }
});

// POST /api/escrow/:orderId/ship — seller marks as shipped
router.post('/:orderId/ship', auth, async (req, res) => {
  try {
    const { trackingNumber, carrier } = req.body
    if (!trackingNumber) return res.status(400).json({ error: 'Tracking number required' })

    // Verify this seller owns the order
    const check = await db.query(`
      SELECT o.id FROM orders o
      JOIN listings l ON l.id = o.listing_id
      WHERE o.id = $1 AND l.seller_id = $2 AND o.status = 'paid'
    `, [req.params.orderId, req.userId])
    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Order not found or not authorised' })
    }

    const crypto = require('crypto');
    const otp = crypto.randomInt(100000, 1000000).toString(); // 6 digit OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    await db.query(`
      UPDATE escrow
      SET state = 'shipped', tracking_number = $1, carrier = $2,
          shipped_at = NOW(), updated_at = NOW()
      WHERE order_id = $3
    `, [trackingNumber, carrier || 'Other', req.params.orderId])

    await db.query(`
      UPDATE orders SET status = 'shipped', delivery_otp = $1, delivery_otp_expires_at = NOW() + INTERVAL '14 days', updated_at = NOW() WHERE id = $2
    `, [hashedOtp, req.params.orderId])

    // Fetch buyer email to send the OTP
    const orderQuery = await db.query(`
      SELECT o.buyer_id, u.email, l.title FROM orders o 
      JOIN users u ON o.buyer_id = u.id 
      JOIN listings l ON o.listing_id = l.id
      WHERE o.id = $1
    `, [req.params.orderId]);
    
    if (orderQuery.rows.length > 0) {
      const { email, title } = orderQuery.rows[0];
      const emailService = require('../services/emailService');
      try {
        await emailService.sendEmail({
          to: email,
          subject: `Your order for "${title}" has shipped!`,
          text: `Good news! Your order has shipped.\n\nYour Delivery OTP is: ${otp}\n\nPlease provide this OTP to the delivery partner when your package arrives.`
        });
      } catch (e) {
        console.error('Failed to send OTP email', e);
      }
    }

    res.json({ success: true, escrowState: 'shipped' })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update shipment' })
  }
})

// POST /api/escrow/:orderId/verify-otp — delivery partner verifies OTP
router.post('/:orderId/verify-otp', auth, otpLimiter, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: 'OTP is required' });

    const orderQuery = await db.query(`
      SELECT o.id, o.delivery_otp, o.delivery_otp_expires_at, o.total_amount, l.seller_id, o.buyer_id
      FROM orders o
      JOIN listings l ON l.id = o.listing_id
      WHERE o.id = $1
    `, [req.params.orderId]);

    if (orderQuery.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    const order = orderQuery.rows[0];

    if (order.buyer_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to verify this order' });
    }

    const crypto = require('crypto');
    let isValid = false;
    
    if (order.delivery_otp && order.delivery_otp.length === 64) {
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
      const providedBuffer = Buffer.from(hashedOtp);
      const storedBuffer = Buffer.from(order.delivery_otp);
      if (providedBuffer.length === storedBuffer.length && crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
        isValid = true;
      }
    } else {
      // Legacy plaintext OTP comparison
      if (order.delivery_otp === otp) {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date(order.delivery_otp_expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Release escrow
      await client.query(`
        UPDATE escrow
        SET state = 'released', released_at = NOW(), updated_at = NOW()
        WHERE order_id = $1
      `, [req.params.orderId]);

      // Update order status to delivered, start 48-72h dispute window (here we can just use delivered status and check timestamp in a cron or just allow disputes within 72h of updated_at)
      await client.query(`
        UPDATE orders SET status = 'delivered', updated_at = NOW() WHERE id = $1
      `, [req.params.orderId]);

      console.log(`[escrow] Payout due: ₹${order.total_amount} to seller ${order.seller_id} for order ${req.params.orderId}`);

      await client.query('COMMIT');
      otpLimiter.resetKey(`${req.ip}_${req.params.orderId}`);
      res.json({ success: true, message: 'Delivery confirmed via OTP. Escrow released to seller.' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// POST /api/escrow/:orderId/confirm-delivery — buyer confirms received
router.post('/:orderId/confirm-delivery', auth, async (req, res) => {
  try {
    // Verify this buyer owns the order
    const check = await db.query(`
      SELECT o.id, o.total_amount AS amount, l.seller_id AS "sellerId"
      FROM orders o
      JOIN listings l ON l.id = o.listing_id
      WHERE o.id = $1 AND o.buyer_id = $2
    `, [req.params.orderId, req.userId])
    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Order not found or not authorised' })
    }

    const { sellerId, amount } = check.rows[0]

    const client = await db.pool.connect()
    try {
      await client.query('BEGIN')

      // Release escrow
      await client.query(`
        UPDATE escrow
        SET state = 'released', released_at = NOW(), updated_at = NOW()
        WHERE order_id = $1
      `, [req.params.orderId])

      // Update order status
      await client.query(`
        UPDATE orders SET status = 'delivered', updated_at = NOW() WHERE id = $1
      `, [req.params.orderId])

      // In a real implementation: trigger Razorpay payout to seller here
      // For MVP: log the payout intent
      console.log(`[escrow] Payout due: ₹${amount} to seller ${sellerId} for order ${req.params.orderId}`)

      await client.query('COMMIT')
      res.json({ success: true, escrowState: 'released', message: 'Delivery confirmed. Payment released to seller.' })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to confirm delivery' })
  }
})

// POST /api/escrow/:orderId/dispute — buyer raises dispute
router.post('/:orderId/dispute', auth, async (req, res) => {
  try {
    const { reason } = req.body
    if (!reason || reason.trim().length < 20) {
      return res.status(400).json({ error: 'Please describe the issue (min 20 characters)' })
    }

    const check = await db.query(`
      SELECT o.id, e.released_at 
      FROM orders o
      LEFT JOIN escrow e ON e.order_id = o.id
      WHERE o.id = $1 AND o.buyer_id = $2
    `, [req.params.orderId, req.userId])
    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Order not found' })
    }

    const { released_at } = check.rows[0];
    if (released_at) {
      const hoursSinceRelease = (new Date() - new Date(released_at)) / (1000 * 60 * 60);
      if (hoursSinceRelease > 72) {
        return res.status(400).json({ error: 'The 72-hour dispute window has expired.' });
      }
    }

    const client = await db.pool.connect()
    try {
      await client.query('BEGIN')
      
      await client.query(`
        UPDATE escrow SET state = 'disputed', updated_at = NOW() WHERE order_id = $1
      `, [req.params.orderId])

      // Fetch escrow_id
      const eRes = await client.query(`SELECT id FROM escrow WHERE order_id = $1`, [req.params.orderId]);
      
      if (eRes.rows.length > 0) {
        await client.query(`
          INSERT INTO disputes (escrow_id, initiator_id, reason, status, created_at)
          VALUES ($1, $2, $3, 'open', NOW())
        `, [eRes.rows[0].id, req.userId, reason.trim()])
      }

      await client.query('COMMIT')
      res.json({ success: true, escrowState: 'disputed' })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to raise dispute' })
  }
})

module.exports = router;
