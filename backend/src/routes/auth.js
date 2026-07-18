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
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', authLimiter, refreshToken);
router.post('/send-verification', authMiddleware, otpLimiter, sendVerification);
router.post('/verify-email', authMiddleware, otpLimiter, verifyEmail);
router.post('/send-phone-verification', authMiddleware, otpLimiter, sendPhoneVerification);
router.post('/verify-phone', authMiddleware, otpLimiter, verifyPhone);
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, updateMe);
router.put('/password', authMiddleware, updatePassword);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', otpLimiter, resetPassword);
router.post('/logout', logout);

module.exports = router;
