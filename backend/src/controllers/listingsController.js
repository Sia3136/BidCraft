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

const getListings = async (req, res) => {
  try {
    const {
      category, subcategory, method, collection,
      occasion, type, minPrice, maxPrice,
      sort = 'newest', limit = 50, offset = 0
    } = req.query

    const conditions = ["status = 'active'"]
    const values = []
    let idx = 1

    const slugifySQL = (col) =>
      `regexp_replace(regexp_replace(lower(${col}), '[&]', '', 'g'), '\\s+', '-', 'g')`

    if (category) {
      conditions.push(`${slugifySQL('category')} = $${idx++}`)
      values.push(category)
    }
    if (subcategory) {
      conditions.push(`${slugifySQL('subcategory')} = $${idx++}`)
      values.push(subcategory)
    }
    if (method) {
      const methodMap = { 'buy-now': 'Buy Now', 'auction': 'Auction', 'negotiable': 'Negotiable' }
      conditions.push(`buying_method = $${idx++}`)
      values.push(methodMap[method] || method)
    }
    if (collection) {
      conditions.push(`$${idx++} = ANY(collections)`)
      values.push(collection)
    }
    if (occasion) {
      conditions.push(`$${idx++} = ANY(occasions)`)
      values.push(occasion)
    }
    if (type === 'new-arrivals') {
      conditions.push(`new_arrival = true`)
    }
    if (type === 'auction') {
      conditions.push(`buying_method = 'Auction'`)
    }
    if (minPrice) {
      conditions.push(`price >= $${idx++}`)
      values.push(parseInt(minPrice))
    }
    if (maxPrice) {
      conditions.push(`price <= $${idx++}`)
      values.push(parseInt(maxPrice))
    }

    const sortMap = {
      'newest': 'created_at DESC',
      'price-asc': 'price ASC',
      'price-desc': 'price DESC'
    }
    const orderBy = sortMap[sort] || 'created_at DESC'

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    // Count query (for pagination UI)
    const countResult = await db.query(
      `SELECT COUNT(*) FROM listings ${where}`, values
    )
    const total = parseInt(countResult.rows[0].count)

    // Data query
    values.push(parseInt(limit), parseInt(offset))
    const result = await db.query(`
      SELECT
        slug AS id, id AS "numericId", title, description, price, category, subcategory,
        buying_method AS "buyingMethod",
        image_urls AS "images",
        image_urls[1] AS image,
        creator_name AS creator,
        creator_rating AS "creatorRating",
        creator_review_count AS "creatorReviewCount",
        creator_badges AS "creatorBadges",
        is_verified AS verified,
        offers_allowed AS "offersAllowed",
        minimum_offer_percent AS "minimumOfferPercent",
        new_arrival AS "newArrival",
        collections, occasions,
        auction_ends_at AS "auctionEndsAt",
        current_bid AS "currentBid",
        bid_count AS "bidCount",
        specifications, reviews,
        status, created_at AS "createdAt"
      FROM listings
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `, values)

    res.json({
      listings: result.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + result.rows.length < total
    })
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

const getListingById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await db.query(`
      SELECT
        slug AS id, id AS "numericId", title, description, price, category, subcategory,
        buying_method AS "buyingMethod",
        image_urls AS "images",
        image_urls[1] AS image,
        creator_name AS creator,
        creator_rating AS "creatorRating",
        creator_review_count AS "creatorReviewCount",
        creator_badges AS "creatorBadges",
        is_verified AS verified,
        offers_allowed AS "offersAllowed",
        minimum_offer_percent AS "minimumOfferPercent",
        auction_ends_at AS "auctionEndsAt",
        current_bid AS "currentBid",
        bid_count AS "bidCount",
        specifications, reviews,
        status, created_at AS "createdAt"
      FROM listings
      WHERE (slug = $1 OR id::text = $1) AND status::text != 'deleted'
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

const getLiveAuctions = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const result = await db.query(`
      SELECT
        slug AS id, id AS "numericId", title, image_urls[1] AS image,
        creator_name AS creator,
        price, current_bid AS "currentBid",
        bid_count AS "bidCount",
        auction_ends_at AS "auctionEndsAt",
        is_verified AS verified
      FROM listings
      WHERE buying_method = 'Auction'
        AND status = 'active'
        AND auction_ends_at > NOW()
      ORDER BY auction_ends_at ASC
      LIMIT $1
    `, [parseInt(limit)])
    res.json({ auctions: result.rows })
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

const getNewArrivals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        slug AS id, id AS "numericId", title, image_urls[1] AS image,
        creator_name AS creator,
        price, buying_method AS "buyingMethod",
        is_verified AS verified,
        offers_allowed AS "offersAllowed",
        auction_ends_at AS "auctionEndsAt",
        current_bid AS "currentBid",
        bid_count AS "bidCount"
      FROM listings
      WHERE new_arrival = true AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 15
    `)
    res.json({ listings: result.rows })
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
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
  deleteListing,
  getLiveAuctions,
  getNewArrivals
};
