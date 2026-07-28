const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  googleLogin, 
  me,
  logout,
  refreshToken,
  sendVerification,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh', refreshToken);
router.post('/send-verification', sendVerification);
router.post('/verify-email', verifyEmail);
router.get('/me', authMiddleware, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

module.exports = router;
