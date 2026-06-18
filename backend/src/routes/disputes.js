const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createDispute, getDispute, getMyDisputes, updateDisputeStatus } = require('../controllers/disputesController');

router.post('/',               authMiddleware, createDispute);
router.get('/',                authMiddleware, getMyDisputes);
router.get('/:id',             authMiddleware, getDispute);
router.patch('/:id/status',    authMiddleware, updateDisputeStatus);

module.exports = router;
