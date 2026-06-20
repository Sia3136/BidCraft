const express = require('express');
const router = express.Router();
const { addTracking, getShipment } = require('../controllers/shipmentsController');
const authMiddleware = require('../middleware/auth');

router.post('/:orderId/tracking', authMiddleware, addTracking);
router.get('/:orderId', authMiddleware, getShipment);

module.exports = router;
