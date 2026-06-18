const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getOrders, getOrderById, updateOrderStatus } = require('../controllers/ordersController');

router.get('/',     authMiddleware, getOrders);
router.get('/:id',  authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
