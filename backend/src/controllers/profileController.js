const db = require('../utils/db');
const Joi = require('joi');
const kycProvider = require('../services/kycProvider');

const updateProfileSchema = Joi.object({
  name: Joi.string().max(200).allow('', null),
  username: Joi.string().regex(/^[a-zA-Z0-9_]{3,20}$/).allow('', null),
  onboarding_completed: Joi.boolean(),
  bio: Joi.string().max(160).allow('', null),
  city: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100).allow('', null),
  interests: Joi.array().items(Joi.string()).allow(null),
  marketplace_role: Joi.string().valid('buyer', 'seller', 'both').allow('', null),
  phone: Joi.string().max(30).allow('', null),
  social_links: Joi.object().allow(null),
  avatar_url: Joi.string().uri().max(500).allow('', null) // retained for backwards compat
});

async function ensureProfileExists(userId) {
  await db.query(
    `INSERT INTO profiles (user_id, created_at, updated_at)
     VALUES ($1, NOW(), NOW())
     ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );
}

// Check username availability
async function checkUsername(req, res, next) {
  try {
    const { username } = req.query;
    if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'invalid_username', available: false });
    }
    const result = await db.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    // Also ensure we aren't returning false for the current user's own username if logged in
    const isOwn = req.userId && result.rows[0] && result.rows[0].id === req.userId;
    res.json({ available: isOwn || result.rows.length === 0 });
  } catch (err) {
    next(err);
  }
}

// Suggest username
async function suggestUsername(req, res, next) {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'name_required' });
    let base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (base.length < 3) base = base + 'user';
    if (base.length > 15) base = base.substring(0, 15);
    
    let suggested = base;
    let count = 0;
    while (true) {
      const result = await db.query('SELECT id FROM users WHERE username = $1', [suggested]);
      if (result.rows.length === 0) break;
      count++;
      suggested = `${base}${count}`;
    }
    res.json({ username: suggested });
  } catch (err) {
    next(err);
  }
}

async function getMyProfile(req, res, next) {
  try {
    const userId = req.userId;
    await ensureProfileExists(userId);

    const result = await db.query(
      `SELECT
         u.id, u.email, u.name, u.username, u.onboarding_completed, u.avatar_url, u.role, u.created_at,
         p.bio, p.city, p.country, p.interests, p.marketplace_role, p.phone, p.social_links, p.is_verified, p.trust_score,
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

async function updateMyProfile(req, res, next) {
  try {
    const userId = req.userId;
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (Object.keys(value).length === 0) {
      return res.status(400).json({ error: 'no_updates_provided' });
    }

    await ensureProfileExists(userId);

    // Validate username uniqueness if provided
    if (value.username) {
      const checkRes = await db.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1) AND id != $2', [value.username, userId]);
      if (checkRes.rows.length > 0) return res.status(409).json({ error: 'username_taken' });
    }

    const userFields = {};
    const profileFields = {};

    if (value.name !== undefined) userFields.name = value.name;
    if (value.username !== undefined) userFields.username = value.username;
    if (value.onboarding_completed !== undefined) userFields.onboarding_completed = value.onboarding_completed;
    if (value.avatar_url !== undefined) userFields.avatar_url = value.avatar_url;

    if (value.bio !== undefined) profileFields.bio = value.bio;
    if (value.city !== undefined) profileFields.city = value.city;
    if (value.country !== undefined) profileFields.country = value.country;
    if (value.interests !== undefined) profileFields.interests = value.interests;
    if (value.marketplace_role !== undefined) profileFields.marketplace_role = value.marketplace_role;
    if (value.phone !== undefined) profileFields.phone = value.phone;
    if (value.social_links !== undefined) profileFields.social_links = value.social_links;

    if (Object.keys(userFields).length > 0) {
      const setClauses = [];
      const params = [userId];
      Object.entries(userFields).forEach(([key, val]) => {
        params.push(val);
        setClauses.push(`${key} = $${params.length}`);
      });
      await db.query(`UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $1`, params);
    }

    if (Object.keys(profileFields).length > 0) {
      const setClauses = [];
      const params = [userId];
      Object.entries(profileFields).forEach(([key, val]) => {
        params.push((key === 'social_links' || key === 'interests') ? JSON.stringify(val) : val);
        setClauses.push(`${key} = $${params.length}`);
      });
      await db.query(`UPDATE profiles SET ${setClauses.join(', ')}, updated_at = NOW() WHERE user_id = $1`, params);
    }

    const result = await db.query(
      `SELECT
         u.id, u.email, u.name, u.username, u.onboarding_completed, u.avatar_url, u.role, u.created_at,
         p.bio, p.city, p.country, p.interests, p.marketplace_role, p.phone, p.social_links, p.is_verified, p.trust_score,
         p.total_sales, p.total_revenue
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

// ----------------------------------------------------
// ADDRESS CRUD
// ----------------------------------------------------

async function getMyAddresses(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [req.userId]);
    res.json({ addresses: result.rows });
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const { type, full_name, phone, street_address, city, state, postal_code, country, is_default } = req.body;
    
    // If setting default, unset others
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.userId]);
    }
    
    const result = await db.query(
      `INSERT INTO addresses (user_id, type, full_name, phone, street_address, city, state, postal_code, country, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [req.userId, type || 'shipping', full_name, phone, street_address, city, state, postal_code, country, is_default || false]
    );
    res.json({ address: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateAddress(req, res, next) {
  try {
    const { id } = req.params;
    const { type, full_name, phone, street_address, city, state, postal_code, country, is_default } = req.body;
    
    const check = await db.query('SELECT id FROM addresses WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'address_not_found' });
    
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.userId]);
    }

    const result = await db.query(
      `UPDATE addresses SET 
         type = COALESCE($1, type),
         full_name = COALESCE($2, full_name),
         phone = COALESCE($3, phone),
         street_address = COALESCE($4, street_address),
         city = COALESCE($5, city),
         state = COALESCE($6, state),
         postal_code = COALESCE($7, postal_code),
         country = COALESCE($8, country),
         is_default = COALESCE($9, is_default),
         updated_at = NOW()
       WHERE id = $10 AND user_id = $11 RETURNING *`,
      [type, full_name, phone, street_address, city, state, postal_code, country, is_default, id, req.userId]
    );
    res.json({ address: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'address_not_found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------
// RECENTLY VIEWED
// ----------------------------------------------------

async function getRecentlyViewed(req, res, next) {
  try {
    // Return listings joined with recently_viewed
    const result = await db.query(
      `SELECT l.*, rv.viewed_at 
       FROM recently_viewed rv 
       JOIN listings l ON rv.listing_id = l.id 
       WHERE rv.user_id = $1 
       ORDER BY rv.viewed_at DESC 
       LIMIT 20`,
      [req.userId]
    );
    res.json({ recentlyViewed: result.rows });
  } catch (err) {
    next(err);
  }
}

async function addRecentlyViewed(req, res, next) {
  try {
    const { listing_id } = req.body;
    if (!listing_id) return res.status(400).json({ error: 'listing_id_required' });
    
    // Insert or update viewed_at
    await db.query(
      `INSERT INTO recently_viewed (user_id, listing_id, viewed_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (user_id, listing_id) 
       DO UPDATE SET viewed_at = NOW()`,
      [req.userId, listing_id]
    );

    // Keep only last 20
    const countRes = await db.query('SELECT COUNT(*) FROM recently_viewed WHERE user_id = $1', [req.userId]);
    if (parseInt(countRes.rows[0].count) > 20) {
      // delete oldest
      await db.query(
        `DELETE FROM recently_viewed 
         WHERE id IN (
           SELECT id FROM recently_viewed WHERE user_id = $1 ORDER BY viewed_at ASC LIMIT $2
         )`,
        [req.userId, parseInt(countRes.rows[0].count) - 20]
      );
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------
// PUBLIC PROFILES & KYC (Existing)
// ----------------------------------------------------

async function getPublicProfile(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT
         u.id, u.name, u.username, u.avatar_url, u.role, u.created_at,
         p.bio, p.city, p.country, p.social_links, p.is_verified, p.trust_score,
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
    const panResult = await kycProvider.verifyPAN(pan_number);
    if (!panResult.isValid) return res.status(400).json({ error: 'invalid_pan' });
    const bankResult = await kycProvider.verifyBank(bank_account_number, bank_ifsc);
    if (!bankResult.isValid) return res.status(400).json({ error: 'invalid_bank_account' });
    await db.query(
      `UPDATE profiles
       SET kyc_status = 'pending', kyc_document_type = $1, kyc_document_url = $2, kyc_rejection_reason = NULL,
           pan_number = $3, bank_account_number = $4, bank_ifsc = $5, updated_at = NOW()
       WHERE user_id = $6`,
      [document_type, document_url, pan_number, bank_account_number, bank_ifsc, userId]
    );
    res.json({ success: true, kyc_status: 'pending', kyc_document_type: document_type, kyc_document_url: document_url });
  } catch (err) {
    next(err);
  }
}

async function getMyAnalytics(req, res, next) {
  try {
    const userId = req.userId;
    const salesRes = await db.query(
      `SELECT COUNT(*)::int AS total_orders, COALESCE(SUM(total_amount), 0)::numeric AS total_revenue,
              COUNT(CASE WHEN status = 'completed' THEN 1 END)::int AS completed_orders,
              COUNT(CASE WHEN status = 'refunded'  THEN 1 END)::int AS refunded_orders
       FROM orders WHERE seller_id = $1`, [userId]
    );
    const listingsRes = await db.query(
      `SELECT COUNT(*)::int AS total_listings, COUNT(CASE WHEN status = 'active' THEN 1 END)::int AS active_listings,
              COUNT(CASE WHEN status = 'sold' THEN 1 END)::int AS sold_listings,
              COUNT(CASE WHEN listing_type = 'auction' THEN 1 END)::int AS auction_listings,
              COUNT(CASE WHEN listing_type = 'fixed' THEN 1 END)::int AS fixed_listings
       FROM listings WHERE seller_id = $1 AND status != 'archived'`, [userId]
    );
    const followersRes = await db.query(`SELECT COUNT(*)::int AS follower_count FROM follows WHERE seller_id = $1`, [userId]);
    const ratingRes = await db.query(
      `SELECT COUNT(*)::int AS total_reviews, COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS average_rating
       FROM reviews WHERE reviewee_id = $1`, [userId]
    );
    const recentRes = await db.query(
      `SELECT COALESCE(SUM(total_amount), 0)::numeric AS revenue_30d, COUNT(*)::int AS orders_30d
       FROM orders WHERE seller_id = $1 AND status = 'completed' AND created_at >= NOW() - INTERVAL '30 days'`, [userId]
    );
    res.json({ sales: salesRes.rows[0], listings: listingsRes.rows[0], followers: followersRes.rows[0], reviews: ratingRes.rows[0], recent: recentRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function getCreators(req, res, next) {
  try {
    const { sort = 'followers', limit = 20, offset = 0 } = req.query;
    const safeLimit  = Math.min(Number(limit)  || 20, 100);
    const safeOffset = Math.max(Number(offset) || 0,  0);
    let orderBy;
    if (sort === 'rating') orderBy = 'p.trust_score DESC NULLS LAST';
    else if (sort === 'newest') orderBy = 'u.created_at DESC';
    else orderBy = 'follower_count DESC NULLS LAST';
    
    const result = await db.query(
      `SELECT u.id, u.name, u.username, u.avatar_url, u.created_at, p.bio, p.is_verified, p.trust_score, p.total_sales,
         COUNT(DISTINCT f.follower_id)::int AS follower_count, COUNT(DISTINCT l.id)::int AS active_listing_count,
         COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS average_rating, COUNT(DISTINCT r.id)::int AS total_reviews
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       LEFT JOIN follows f ON f.seller_id = u.id
       LEFT JOIN listings l ON l.seller_id = u.id AND l.status = 'active'
       LEFT JOIN reviews r ON r.reviewee_id = u.id
       WHERE u.role != 'admin'
       GROUP BY u.id, u.name, u.username, u.avatar_url, u.created_at, p.bio, p.is_verified, p.trust_score, p.total_sales
       HAVING COUNT(DISTINCT l.id) > 0
       ORDER BY ${orderBy} LIMIT $1 OFFSET $2`,
      [safeLimit, safeOffset]
    );
    res.json({ creators: result.rows, limit: safeLimit, offset: safeOffset });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  getMyProfile, updateMyProfile, getPublicProfile, submitKyc, getMyAnalytics, getCreators,
  checkUsername, suggestUsername, 
  getMyAddresses, addAddress, updateAddress, deleteAddress,
  getRecentlyViewed, addRecentlyViewed
};
