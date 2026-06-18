const express = require('express');
const router = express.Router();
const { getPublicProfile } = require('../controllers/profileController');

// GET /api/users/:id — public seller profile (no auth required)
router.get('/:id', getPublicProfile);

module.exports = router;
