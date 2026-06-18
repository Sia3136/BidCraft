const express = require('express');
const router = express.Router();
const { register, login, googleLogin, me, logout, refreshToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', authLimiter, refreshToken);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

module.exports = router;
