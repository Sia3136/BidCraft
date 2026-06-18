const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { followSeller, unfollowSeller, getFollowers, getFollowing } = require('../controllers/followsController');

router.post('/users/:sellerId/follow', authMiddleware, followSeller);
router.delete('/users/:sellerId/follow', authMiddleware, unfollowSeller);
router.get('/users/:sellerId/followers', getFollowers);
router.get('/me/following', authMiddleware, getFollowing);

module.exports = router;
