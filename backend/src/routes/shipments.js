const express = require('express');
const router = express.Router();
const { addTracking, getShipment, getTrackingStatus } = require('../controllers/shipmentsController');
const authMiddleware = require('../middleware/auth');

router.post('/:orderId/tracking', authMiddleware, addTracking);
router.get('/:orderId', authMiddleware, getShipment);
router.get('/:orderId/tracking', authMiddleware, getTrackingStatus);

module.exports = router;
