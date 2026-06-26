const express = require('express');
const router = express.Router();
const { getCreators } = require('../controllers/profileController');

// GET /api/creators — public creator discover page
// Query: ?sort=followers|rating|newest&limit=20&offset=0
router.get('/', getCreators);

module.exports = router;
