const express = require('express');
const router = express.Router();
const { 
  getMyProfile, updateMyProfile, submitKyc, getMyAnalytics, getCreators,
  checkUsername, suggestUsername,
  getMyAddresses, addAddress, updateAddress, deleteAddress,
  getRecentlyViewed, addRecentlyViewed
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// Username routes (no auth needed for check/suggest, but useful to pass token if logged in)
// Using optional auth middleware for checkUsername to allow self-check
router.get('/check-username', (req, res, next) => {
  // optionally extract userId if token is present, but don't fail if not
  authMiddleware(req, res, (err) => {
    // ignore error from authMiddleware to allow public check
    next();
  });
}, checkUsername);

router.get('/suggest-username', suggestUsername);

// Profile
router.get('/', authMiddleware, getMyProfile);
router.put('/', authMiddleware, updateMyProfile);

// Addresses
router.get('/addresses', authMiddleware, getMyAddresses);
router.post('/addresses', authMiddleware, addAddress);
router.put('/addresses/:id', authMiddleware, updateAddress);
router.delete('/addresses/:id', authMiddleware, deleteAddress);

// Recently Viewed
router.get('/recently-viewed', authMiddleware, getRecentlyViewed);
router.post('/recently-viewed', authMiddleware, addRecentlyViewed);

// KYC & Analytics
router.post('/kyc', authMiddleware, submitKyc);
router.get('/analytics', authMiddleware, getMyAnalytics);

module.exports = router;
