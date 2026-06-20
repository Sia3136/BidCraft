const db = require('../utils/db');
const Joi = require('joi');
const kycProvider = require('../services/kycProvider');

const updateProfileSchema = Joi.object({
  name: Joi.string().max(200).allow('', null),
  avatar_url: Joi.string().uri().max(500).allow('', null),
  bio: Joi.string().max(1000).allow('', null),
  phone: Joi.string().max(30).allow('', null),
  social_links: Joi.object().allow(null)
});

/**
 * Ensure a profiles row exists for a given user_id.
 * Creates a default row if missing (lazy creation).
 */
async function ensureProfileExists(userId) {
  await db.query(
    `INSERT INTO profiles (user_id, created_at, updated_at)
     VALUES ($1, NOW(), NOW())
     ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );
}

/**
 * GET /api/profile
 * Returns the authenticated user's full profile.
 */
async function getMyProfile(req, res, next) {
  try {
    const userId = req.userId;
    await ensureProfileExists(userId);

    const result = await db.query(
      `SELECT
         u.id, u.email, u.name, u.avatar_url, u.role, u.created_at,
         p.bio, p.phone, p.social_links, p.is_verified, p.trust_score,
         p.total_sales, p.total_revenue, p.razorpay_customer_id, p.razorpay_card_token
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    const profile = result.rows[0];
    if (!profile) return res.status(404).json({ error: 'user_not_found' });

    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile
 * Updates the authenticated user's profile.
 */
async function updateMyProfile(req, res, next) {
  try {
    const userId = req.userId;
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (Object.keys(value).length === 0) {
      return res.status(400).json({ error: 'no_updates_provided' });
    }

    await ensureProfileExists(userId);

    // Separate fields between users and profiles tables
    const userFields = {};
    const profileFields = {};

    if (value.name !== undefined) userFields.name = value.name;
    if (value.avatar_url !== undefined) userFields.avatar_url = value.avatar_url;
    if (value.bio !== undefined) profileFields.bio = value.bio;
    if (value.phone !== undefined) profileFields.phone = value.phone;
    if (value.social_links !== undefined) profileFields.social_links = value.social_links;

    // Update users table
    if (Object.keys(userFields).length > 0) {
      const setClauses = [];
      const params = [userId];
      Object.entries(userFields).forEach(([key, val]) => {
        params.push(val);
        setClauses.push(`${key} = $${params.length}`);
      });
      await db.query(
        `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $1`,
        params
      );
    }

    // Update profiles table
    if (Object.keys(profileFields).length > 0) {
      const setClauses = [];
      const params = [userId];
      Object.entries(profileFields).forEach(([key, val]) => {
        params.push(key === 'social_links' ? JSON.stringify(val) : val);
        setClauses.push(`${key} = $${params.length}`);
      });
      await db.query(
        `UPDATE profiles SET ${setClauses.join(', ')}, updated_at = NOW() WHERE user_id = $1`,
        params
      );
    }

    // Return updated profile
    const result = await db.query(
      `SELECT
         u.id, u.email, u.name, u.avatar_url, u.role, u.created_at,
         p.bio, p.phone, p.social_links, p.is_verified, p.trust_score,
         p.total_sales, p.total_revenue, p.razorpay_customer_id, p.razorpay_card_token
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    res.json({ profile: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Public seller profile — sanitized, no private fields.
 */
async function getPublicProfile(req, res, next) {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT
         u.id, u.name, u.avatar_url, u.role, u.created_at,
         p.bio, p.social_links, p.is_verified, p.trust_score,
         p.total_sales
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [id]
    );

    const profile = result.rows[0];
    if (!profile) return res.status(404).json({ error: 'user_not_found' });

    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

const submitKycSchema = Joi.object({
  document_type: Joi.string().max(50).required(),
  document_url: Joi.string().uri().max(500).required(),
  pan_number: Joi.string().max(50).required(),
  bank_account_number: Joi.string().max(100).required(),
  bank_ifsc: Joi.string().max(50).required()
});

async function submitKyc(req, res, next) {
  try {
    const userId = req.userId;
    const { error, value } = submitKycSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { document_type, document_url, pan_number, bank_account_number, bank_ifsc } = value;

    await ensureProfileExists(userId);

    // Verify PAN and Bank using KYC Provider
    const panResult = await kycProvider.verifyPAN(pan_number);
    if (!panResult.isValid) {
      return res.status(400).json({ error: 'invalid_pan' });
    }

    const bankResult = await kycProvider.verifyBank(bank_account_number, bank_ifsc);
    if (!bankResult.isValid) {
      return res.status(400).json({ error: 'invalid_bank_account' });
    }

    // Update profiles table with KYC details
    await db.query(
      `UPDATE profiles
       SET kyc_status = 'pending',
           kyc_document_type = $1,
           kyc_document_url = $2,
           kyc_rejection_reason = NULL,
           pan_number = $3,
           bank_account_number = $4,
           bank_ifsc = $5,
           updated_at = NOW()
       WHERE user_id = $6`,
      [document_type, document_url, pan_number, bank_account_number, bank_ifsc, userId]
    );

    res.json({
      success: true,
      kyc_status: 'pending',
      kyc_document_type: document_type,
      kyc_document_url: document_url
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyProfile, updateMyProfile, getPublicProfile, submitKyc };
