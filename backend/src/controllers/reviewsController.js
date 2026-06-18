const db = require('../utils/db');
const Joi = require('joi');

const createReviewSchema = Joi.object({
  order_id: Joi.number().integer().required(),
  rating:   Joi.number().integer().min(1).max(5).required(),
  comment:  Joi.string().max(2000).allow('', null)
});

/**
 * POST /api/reviews
 * Buyer submits a review for a completed order.
 */
async function createReview(req, res, next) {
  try {
    const reviewerId = req.userId;
    const { error, value } = createReviewSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { order_id, rating, comment } = value;

    // Fetch the order
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    const order = orderRes.rows[0];
    if (!order) return res.status(404).json({ error: 'order_not_found' });

    // Only buyer can review
    if (order.buyer_id !== reviewerId) {
      return res.status(403).json({ error: 'only_buyer_can_review' });
    }

    // Order must be completed
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'order_must_be_completed', current: order.status });
    }

    // Insert review (unique constraint prevents duplicates at DB level)
    let review;
    try {
      const result = await db.query(
        `INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [order_id, reviewerId, order.seller_id, rating, comment || null]
      );
      review = result.rows[0];
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'review_already_submitted' });
      }
      throw err;
    }

    // Recalculate seller trust_score (avg of all ratings, rounded to 2dp, capped 0-5)
    await db.query(
      `INSERT INTO profiles (user_id, trust_score, created_at, updated_at)
       VALUES ($1,
         (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE reviewee_id = $1),
         NOW(), NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET trust_score = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE reviewee_id = $1),
             updated_at = NOW()`,
      [order.seller_id]
    );

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reviews/seller/:userId
 * Public — all reviews for a seller with aggregated stats.
 */
async function getSellerReviews(req, res, next) {
  try {
    const { userId } = req.params;

    const reviewsRes = await db.query(
      `SELECT r.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.reviewee_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    const statsRes = await db.query(
      `SELECT
         COUNT(*)::int as total_reviews,
         ROUND(AVG(rating)::numeric, 2) as average_rating,
         COUNT(CASE WHEN rating = 5 THEN 1 END)::int as five_star,
         COUNT(CASE WHEN rating = 4 THEN 1 END)::int as four_star,
         COUNT(CASE WHEN rating = 3 THEN 1 END)::int as three_star,
         COUNT(CASE WHEN rating = 2 THEN 1 END)::int as two_star,
         COUNT(CASE WHEN rating = 1 THEN 1 END)::int as one_star
       FROM reviews
       WHERE reviewee_id = $1`,
      [userId]
    );

    res.json({
      reviews: reviewsRes.rows,
      stats: statsRes.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reviews/order/:orderId
 * Get review for a specific order (if any).
 */
async function getOrderReview(req, res, next) {
  try {
    const { orderId } = req.params;
    const result = await db.query(
      `SELECT r.*, u.name as reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.order_id = $1`,
      [orderId]
    );
    res.json({ review: result.rows[0] || null });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReview, getSellerReviews, getOrderReview };
