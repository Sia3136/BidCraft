const express = require('express');
const router = express.Router();
const { askQuestion, answerQuestion, getQuestionsByListing } = require('../controllers/qaController');
const authMiddleware = require('../middleware/auth');

router.post('/ask', authMiddleware, askQuestion);
router.post('/:id/answer', authMiddleware, answerQuestion);
router.get('/listing/:listingId', getQuestionsByListing); // Open to public, internally checks auth if provided

module.exports = router;
