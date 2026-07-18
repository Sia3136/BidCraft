const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(auth);

// Any authenticated user can create a report
router.post('/', adminController.createReport);

module.exports = router;
