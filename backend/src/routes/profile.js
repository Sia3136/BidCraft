const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// GET /api/profile — own profile (requires auth)
router.get('/', authMiddleware, getMyProfile);

// PUT /api/profile — update own profile (requires auth)
router.put('/', authMiddleware, updateMyProfile);

module.exports = router;
