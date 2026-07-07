const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createPaymentOrder,
  createSetupOrder,
  verifyPayment,
  handleWebhook,
  getPaymentByOrder,
  saveCard,
  createCheckout,
  verifyCheckout
} = require('../controllers/paymentsController');

// Webhook needs raw body for signature verification
// Mount before express.json() processes it — handled in app.js with rawBody capture
router.post('/webhook', handleWebhook);

router.post('/create-checkout', authMiddleware, createCheckout);
router.post('/verify-checkout', authMiddleware, verifyCheckout);
router.post('/create-order', authMiddleware, createPaymentOrder);
router.post('/create-setup-order', authMiddleware, createSetupOrder);
router.post('/verify',       authMiddleware, verifyPayment);
router.post('/save-card',    authMiddleware, saveCard);
router.get('/order/:orderId', authMiddleware, getPaymentByOrder);

module.exports = router;
