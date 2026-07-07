const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const auth = require('../middleware/auth');

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

    await db.query(`
      UPDATE escrow
      SET state = 'shipped', tracking_number = $1, carrier = $2,
          shipped_at = NOW(), updated_at = NOW()
      WHERE order_id = $3
    `, [trackingNumber, carrier || 'Other', req.params.orderId])

    await db.query(`
      UPDATE orders SET status = 'shipped', updated_at = NOW() WHERE id = $1
    `, [req.params.orderId])

    res.json({ success: true, escrowState: 'shipped' })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update shipment' })
  }
})

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
      SELECT id FROM orders WHERE id = $1 AND buyer_id = $2
    `, [req.params.orderId, req.userId])
    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Order not found' })
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
