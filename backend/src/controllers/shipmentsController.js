const db = require('../utils/db');
const Joi = require('joi');
const shippingService = require('../services/shippingService');
const notificationService = require('../services/notificationService');

const updateTrackingSchema = Joi.object({
  tracking_number: Joi.string().max(200).required(),
  carrier: Joi.string().max(100).required()
});

/**
 * POST /api/shipments/:orderId/tracking
 * Seller adds tracking info.
 */
async function addTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.userId;
    const { error, value } = updateTrackingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { tracking_number, carrier } = value;

    // Check order authorization
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.seller_id !== userId) return res.status(403).json({ error: 'only_seller_can_ship' });
    if (order.status !== 'paid' && order.status !== 'shipped') {
      return res.status(400).json({ error: 'invalid_order_status', current: order.status });
    }

    // Upsert shipment
    const existingRes = await db.query('SELECT id FROM shipments WHERE order_id = $1', [orderId]);
    let shipmentRes;
    if (existingRes.rows.length > 0) {
      shipmentRes = await db.query(
        `UPDATE shipments SET tracking_number = $1, carrier = $2, status = 'shipped' WHERE order_id = $3 RETURNING *`,
        [tracking_number, carrier, orderId]
      );
    } else {
      shipmentRes = await db.query(
        `INSERT INTO shipments (order_id, tracking_number, carrier, shipped_at, status, created_at)
         VALUES ($1, $2, $3, NOW(), 'shipped', NOW()) RETURNING *`,
        [orderId, tracking_number, carrier]
      );
    }

    // Update order status to shipped
    if (order.status !== 'shipped') {
      await db.query(`UPDATE orders SET status = 'shipped', updated_at = NOW() WHERE id = $1`, [orderId]);
      await db.query(`UPDATE escrow SET status = 'shipped', updated_at = NOW() WHERE order_id = $1`, [orderId]);

      // Notify buyer
      await notificationService.createNotification(null, {
        userId: order.buyer_id,
        type: 'order_shipped',
        title: 'Order Shipped!',
        message: `Your order has been shipped via ${carrier} (Tracking: ${tracking_number}).`,
        data: { order_id: orderId, tracking_number }
      });
    }

    res.json({ success: true, shipment: shipmentRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/shipments/:orderId
 * Get shipment details
 */
async function getShipment(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.buyer_id !== userId && order.seller_id !== userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    const shipmentRes = await db.query('SELECT * FROM shipments WHERE order_id = $1', [orderId]);
    res.json({ shipment: shipmentRes.rows[0] || null });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/shipments/:orderId/tracking
 * Get real-time tracking from carrier
 */
async function getTrackingStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    if (order.buyer_id !== userId && order.seller_id !== userId) {
      return res.status(403).json({ error: 'unauthorized_action' });
    }

    const shipmentRes = await db.query('SELECT * FROM shipments WHERE order_id = $1', [orderId]);
    const shipment = shipmentRes.rows[0];
    if (!shipment) return res.status(404).json({ error: 'shipment_not_found' });

    if (!shipment.tracking_number || !shipment.carrier) {
       return res.status(400).json({ error: 'missing_tracking_info' });
    }

    try {
      const trackingData = await shippingService.getTrackingStatus(shipment.tracking_number, shipment.carrier);
      res.json({ tracking: trackingData });
    } catch (err) {
      // Graceful error handling for API failures
      if (err.message === 'api_timeout') {
         return res.status(504).json({ error: 'Carrier tracking API timeout. Please try again later.' });
      }
      if (err.message === 'shipment_not_found') {
         return res.status(404).json({ error: 'Shipment not found on carrier side yet.' });
      }
      console.error('[Delhivery] Tracking Error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch tracking data from carrier.' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { addTracking, getShipment, getTrackingStatus };
