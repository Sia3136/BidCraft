const db = require('../utils/db');
const Joi = require('joi');
const notificationService = require('../services/notificationService');
const redis = require('../utils/redis');

const createListingSchema = Joi.object({
  title: Joi.string().max(250).required(),
  description: Joi.string().allow('', null),
  category_id: Joi.number().integer().required(),
  condition: Joi.string().max(40).required(),
  photos: Joi.array().items(Joi.string()).length(6).required(), // Enforce exactly 6 photos
  listing_type: Joi.string().valid('fixed', 'auction').required(),
  price: Joi.number().precision(2).positive().allow(null),
  status: Joi.string().valid('active', 'paused', 'sold', 'archived').default('active')
});

const updateListingSchema = Joi.object({
  title: Joi.string().max(250),
  description: Joi.string().allow('', null),
  category_id: Joi.number().integer(),
  condition: Joi.string().max(40),
  photos: Joi.array().items(Joi.string()).min(1),
  price: Joi.number().precision(2).positive().allow(null),
  status: Joi.string().valid('active', 'paused', 'sold', 'archived')
});

async function createListing(req, res, next) {
  try {
    const { error, value } = createListingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const sellerId = req.userId;
    const { title, description, category_id, condition, photos, listing_type, price, status } = value;

    // Check category exists
    const categoryCheck = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'invalid_category_id' });
    }

    const photosJson = JSON.stringify(photos);

    const result = await db.query(
      `INSERT INTO listings (seller_id, title, description, category_id, condition, photos, listing_type, price, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [sellerId, title, description || null, category_id, condition, photosJson, listing_type, price || null, status || 'active']
    );

    const listing = result.rows[0];
    
    // Invalidate listings cache
    if (redis) {
      try {
        const keys = await redis.keys('cache:listings:*');
        for (const key of keys) {
          await redis.del(key);
        }
      } catch (e) {
        console.error('Redis cache invalidation error:', e);
      }
    }

    res.status(201).json({ listing });

    // Async: notify all followers of this seller about the new listing
    setImmediate(async () => {
      try {
        const followersRes = await db.query(
          'SELECT follower_id FROM follows WHERE seller_id = $1',
          [sellerId]
        );
        for (const { follower_id } of followersRes.rows) {
          await notificationService.createNotification(null, {
            userId: follower_id,
            type: 'new_listing',
            title: 'New Listing from a seller you follow',
            message: `A seller you follow just listed "${listing.title}".`,
            data: { listing_id: listing.id, seller_id: sellerId }
          });
        }
      } catch (err) {
        console.error('[createListing] Failed to notify followers:', err.message);
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getListings(req, res, next) {
  try {
    const { category_id, listing_type, status, search, seller_id, min_price, max_price, condition, sort_by, sort_dir, page = 1, limit = 20 } = req.query;

    const cacheKey = `cache:listings:${JSON.stringify(req.query)}`;
    
    if (redis) {
      try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
          return res.json(typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData);
        }
      } catch (e) {
        console.error('Redis cache get error:', e);
      }
    }

    let queryText = 'SELECT * FROM listings WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM listings WHERE 1=1';
    const params = [];
    const countParams = [];

    if (category_id) {
      params.push(category_id);
      countParams.push(category_id);
      queryText += ` AND category_id = $${params.length}`;
      countQuery += ` AND category_id = $${countParams.length}`;
    }

    if (listing_type) {
      params.push(listing_type);
      countParams.push(listing_type);
      queryText += ` AND listing_type = $${params.length}`;
      countQuery += ` AND listing_type = $${countParams.length}`;
    }

    if (seller_id) {
      params.push(seller_id);
      countParams.push(seller_id);
      queryText += ` AND seller_id = $${params.length}`;
      countQuery += ` AND seller_id = $${countParams.length}`;
    }

    if (status) {
      params.push(status);
      countParams.push(status);
      queryText += ` AND status = $${params.length}`;
      countQuery += ` AND status = $${countParams.length}`;
    } else {
      queryText += " AND status != 'archived'";
      countQuery += " AND status != 'archived'";
    }

    if (condition) {
      params.push(condition);
      countParams.push(condition);
      queryText += ` AND condition = $${params.length}`;
      countQuery += ` AND condition = $${countParams.length}`;
    }

    if (min_price) {
      params.push(min_price);
      countParams.push(min_price);
      queryText += ` AND COALESCE(price, 0) >= $${params.length}`;
      countQuery += ` AND COALESCE(price, 0) >= $${countParams.length}`;
    }

    if (max_price) {
      params.push(max_price);
      countParams.push(max_price);
      queryText += ` AND COALESCE(price, 0) <= $${params.length}`;
      countQuery += ` AND COALESCE(price, 0) <= $${countParams.length}`;
    }

    if (search) {
      const searchStr = search.trim().toLowerCase();
      if (searchStr !== '') {
        params.push(searchStr);
        countParams.push(searchStr);
        const searchClause = ` AND (
          LOWER(title) LIKE LOWER('%' || $${params.length} || '%')
          OR LOWER(description) LIKE LOWER('%' || $${params.length} || '%')
          OR LOWER(category) LIKE LOWER('%' || $${params.length} || '%')
          OR LOWER(subcategory) LIKE LOWER('%' || $${params.length} || '%')
          OR LOWER(tags::text) LIKE LOWER('%' || $${params.length} || '%')
        )`;
        
        queryText += searchClause;
        countQuery += ` AND (
          LOWER(title) LIKE LOWER('%' || $${countParams.length} || '%')
          OR LOWER(description) LIKE LOWER('%' || $${countParams.length} || '%')
          OR LOWER(category) LIKE LOWER('%' || $${countParams.length} || '%')
          OR LOWER(subcategory) LIKE LOWER('%' || $${countParams.length} || '%')
          OR LOWER(tags::text) LIKE LOWER('%' || $${countParams.length} || '%')
        )`;
      }
    }

    // Sorting
    const validSortFields = ['created_at', 'price', 'end_time'];
    const validSortDirs = ['asc', 'desc'];
    
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = validSortDirs.includes(sort_dir?.toLowerCase()) ? sort_dir.toUpperCase() : 'DESC';
    
    // Sort by COALESCE(price, start_bid) if sorting by price
    if (sortField === 'price') {
       queryText += ` ORDER BY COALESCE(price, 0) ${sortDirection}`;
    } else {
       queryText += ` ORDER BY ${sortField} ${sortDirection}`;
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    params.push(limitNum);
    queryText += ` LIMIT $${params.length}`;
    
    params.push(offset);
    queryText += ` OFFSET $${params.length}`;

    const [result, countResult] = await Promise.all([
      db.query(queryText, params),
      db.query(countQuery, countParams)
    ]);
    
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limitNum);

    const responseData = { 
      listings: result.rows,
      pagination: {
        total: totalItems,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    };

    if (redis) {
      try {
        // Cache for 5 minutes (300 seconds)
        await redis.set(cacheKey, JSON.stringify(responseData), { ex: 300 });
      } catch (e) {
        console.error('Redis cache set error:', e);
      }
    }

    res.json(responseData);
  } catch (err) {
    next(err);
  }
}

async function getListingById(req, res, next) {
  try {
    const { id } = req.params;
    const cacheKey = `cache:listing:${id}`;

    if (redis) {
      try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
          return res.json({ listing: typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData });
        }
      } catch (e) {
        console.error('Redis cache get error:', e);
      }
    }

    const result = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    const listing = result.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });

    if (redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(listing), { ex: 300 });
      } catch (e) {
        console.error('Redis cache set error:', e);
      }
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

async function updateListing(req, res, next) {
  try {
    const { id } = req.params;
    const { error, value } = updateListingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check listing ownership
    const ownershipCheck = await db.query('SELECT seller_id FROM listings WHERE id = $1', [id]);
    const listing = ownershipCheck.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id !== req.userId) return res.status(403).json({ error: 'unauthorized_action' });

    const updates = [];
    const params = [id];

    Object.keys(value).forEach((key) => {
      let val = value[key];
      if (key === 'photos') {
        val = JSON.stringify(val);
      }
      params.push(val);
      updates.push(`${key} = $${params.length}`);
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'no_updates_provided' });
    }

    const queryText = `
      UPDATE listings 
      SET ${updates.join(', ')}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *`;

    const result = await db.query(queryText, params);
    
    // Invalidate cache
    if (redis) {
      try {
        await redis.del(`cache:listing:${id}`);
        const keys = await redis.keys('cache:listings:*');
        for (const key of keys) {
          await redis.del(key);
        }
      } catch (e) {
        console.error('Redis cache invalidation error:', e);
      }
    }

    res.json({ listing: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteListing(req, res, next) {
  try {
    const { id } = req.params;

    // Check ownership
    const ownershipCheck = await db.query('SELECT seller_id FROM listings WHERE id = $1', [id]);
    const listing = ownershipCheck.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id !== req.userId) return res.status(403).json({ error: 'unauthorized_action' });

    // Mark as archived or physically delete. Let's do delete since cascade exists, but setting status to archived is safer for orders.
    // However, if we do cascade delete, let's just physically delete it as requested by standard CRUD.
    await db.query('DELETE FROM listings WHERE id = $1', [id]);
    
    // Invalidate cache
    if (redis) {
      try {
        await redis.del(`cache:listing:${id}`);
        const keys = await redis.keys('cache:listings:*');
        for (const key of keys) {
          await redis.del(key);
        }
      } catch (e) {
        console.error('Redis cache invalidation error:', e);
      }
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
};
