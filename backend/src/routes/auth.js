const express = require('express');
const router = express.Router();
const { register, login, googleLogin, me,
  logout,
  refreshToken,
  sendVerification,
  verifyEmail,
  sendPhoneVerification,
  verifyPhone,
  updateMe,
  updatePassword
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', authLimiter, refreshToken);
router.post('/send-verification', authMiddleware, sendVerification);
router.post('/verify-email', authMiddleware, verifyEmail);
router.post('/send-phone-verification', authMiddleware, sendPhoneVerification);
router.post('/verify-phone', authMiddleware, verifyPhone);
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, updateMe);
router.put('/password', authMiddleware, updatePassword);
router.post('/logout', logout);

module.exports = router;
