const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getPaymentByOrder,
  saveCard
} = require('../controllers/paymentsController');

// Webhook needs raw body for signature verification
// Mount before express.json() processes it — handled in app.js with rawBody capture
router.post('/webhook', handleWebhook);

router.post('/create-order', authMiddleware, createPaymentOrder);
router.post('/verify',       authMiddleware, verifyPayment);
router.post('/save-card',    authMiddleware, saveCard);
router.get('/order/:orderId', authMiddleware, getPaymentByOrder);

module.exports = router;
