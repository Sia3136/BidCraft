const express = require('express');
const router = express.Router();
const { register, login, googleLogin, me, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

module.exports = router;
