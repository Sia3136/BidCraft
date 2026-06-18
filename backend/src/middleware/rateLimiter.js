const rateLimit = require('express-rate-limit');

// Global Limiter (already in app.js, but keeping it organized here is better. Let's just create specific limiters here)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for auth
  message: { error: 'too_many_auth_attempts' }
});

const bidLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 bids per minute
  message: { error: 'too_many_bids' }
});

module.exports = { authLimiter, bidLimiter };
