const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getOrders, getOrderById, updateOrderStatus, createOrder } = require('../controllers/ordersController');

router.get('/',     authMiddleware, getOrders);
router.post('/',    authMiddleware, createOrder);
router.get('/:id',  authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
