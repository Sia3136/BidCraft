const db = require('../utils/db');
const Joi = require('joi');

const askSchema = Joi.object({
  listing_id: Joi.number().integer().required(),
  question: Joi.string().max(1000).required()
});

const answerSchema = Joi.object({
  answer: Joi.string().max(2000).required(),
  is_public: Joi.boolean().default(true)
});

/**
 * POST /api/qa/ask
 * Buyer asks a question.
 */
async function askQuestion(req, res, next) {
  try {
    const userId = req.userId;
    const { error, value } = askSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { listing_id, question } = value;

    // Check listing
    const listingRes = await db.query('SELECT seller_id FROM listings WHERE id = $1', [listing_id]);
    const listing = listingRes.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });

    const result = await db.query(
      `INSERT INTO listing_questions (listing_id, asker_id, question, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [listing_id, userId, question]
    );

    res.status(201).json({ question: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/qa/:id/answer
 * Seller answers a question.
 */
async function answerQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { error, value } = answerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { answer, is_public } = value;

    // Get question to verify seller
    const qRes = await db.query(
      `SELECT q.*, l.seller_id FROM listing_questions q
       JOIN listings l ON l.id = q.listing_id WHERE q.id = $1`,
      [id]
    );
    const questionRecord = qRes.rows[0];
    if (!questionRecord) return res.status(404).json({ error: 'question_not_found' });
    if (questionRecord.seller_id !== userId) return res.status(403).json({ error: 'unauthorized_action' });

    const result = await db.query(
      `UPDATE listing_questions
       SET answer = $1, answered_by = $2, answered_at = NOW(), is_public = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [answer, userId, is_public, id]
    );

    res.json({ question: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/qa/listing/:listingId
 * Get public Q&A for a listing.
 */
async function getQuestionsByListing(req, res, next) {
  try {
    const { listingId } = req.params;
    
    // Anyone can view public answered questions or their own unanswered ones.
    // For simplicity, we just return public questions + any questions asked by the current user (if logged in).
    let userId = null;
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {
        // Ignore invalid tokens for this public endpoint
      }
    }

    const query = `
      SELECT q.*, u.name as asker_name, s.name as answerer_name
      FROM listing_questions q
      JOIN users u ON u.id = q.asker_id
      LEFT JOIN users s ON s.id = q.answered_by
      WHERE q.listing_id = $1 AND (q.is_public = TRUE OR q.asker_id = $2)
      ORDER BY q.created_at DESC
    `;

    const result = await db.query(query, [listingId, userId]);
    res.json({ questions: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { askQuestion, answerQuestion, getQuestionsByListing };
