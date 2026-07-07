const db = require('../utils/db');
const Joi = require('joi');
const notificationService = require('../services/notificationService');
const redis = require('../utils/redis');

const createListingSchema = Joi.object({
  title: Joi.string().min(5).max(250).required(),
  description: Joi.string().min(200).required(),
  price: Joi.number().min(50).max(50000).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  buyingMethod: Joi.string().valid('Buy Now', 'Auction', 'Negotiable').required(),
  offersAllowed: Joi.boolean().optional(),
  minimumOfferPercent: Joi.number().min(50).max(100).optional(),
  specifications: Joi.object().optional(),
  imageUrls: Joi.array().items(Joi.string()).min(1).max(6).required(),
  auctionEndsAt: Joi.date().optional(),
  collections: Joi.array().items(Joi.string()).optional(),
  occasions: Joi.array().items(Joi.string()).optional()
});

async function createListing(req, res, next) {
  try {
    const sellerId = req.userId;

    // Verify user is email or mobile verified (or profile verified)
    const userResult = await db.query(
      `SELECT email_verified, mobile_verified, name FROM users WHERE id = $1`,
      [sellerId]
    )
    const user = userResult.rows[0];
    const profileRes = await db.query(`SELECT is_verified FROM profiles WHERE user_id = $1`, [sellerId]);
    const isVerified = profileRes.rows[0]?.is_verified || (user && (user.email_verified || user.mobile_verified));

    if (!isVerified) {
      return res.status(403).json({
        error: 'Verify your email or mobile before creating listings.',
        code: 'VERIFICATION_REQUIRED'
      });
    }

    const { error, value } = createListingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      title, description, price, category, subcategory,
      buyingMethod, offersAllowed, minimumOfferPercent,
      specifications, imageUrls,
      auctionEndsAt, collections, occasions
    } = value;

    if (buyingMethod === 'Auction' && !auctionEndsAt) {
      return res.status(400).json({ error: 'Auction end date is required for auction listings' });
    }
    if (buyingMethod === 'Auction' && new Date(auctionEndsAt) <= new Date()) {
      return res.status(400).json({ error: 'Auction end date must be in the future' });
    }

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(`
        INSERT INTO listings (
          title, description, price, category, subcategory,
          buying_method, offers_allowed, minimum_offer_percent,
          image_urls, seller_id, creator_name,
          specifications, collections, occasions,
          auction_ends_at, status, listing_type, photos, created_at, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'active', $16, $17, NOW(),NOW()
        )
        RETURNING id
      `, [
        title.trim(), description?.trim(), parseInt(price),
        category, subcategory, buyingMethod,
        offersAllowed || false,
        minimumOfferPercent || 70,
        imageUrls,
        sellerId, user ? user.name : 'Unknown',
        specifications || {},
        collections || [],
        occasions || [],
        auctionEndsAt || null,
        buyingMethod === 'Auction' ? 'auction' : 'fixed',
        JSON.stringify(imageUrls)
      ]);
      
      const listingId = result.rows[0].id;
      
      if (buyingMethod === 'Auction') {
        await client.query(`
          INSERT INTO auctions (
            listing_id, seller_id, start_bid, current_bid, min_bid_increment, start_time, end_time, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, 10.00, NOW(), $5, 'active', NOW(), NOW())
        `, [listingId, sellerId, price, price, auctionEndsAt]);
      }

      await client.query('COMMIT');
      
      if (redis) {
        try {
          const keys = await redis.keys('cache:listings:*');
          for (const key of keys) { await redis.del(key); }
        } catch (e) {}
      }

      res.status(201).json({ listingId, success: true });
      
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
              message: `A seller you follow just listed "${title}".`,
              data: { listing_id: listingId, seller_id: sellerId }
            });
          }
        } catch (err) {
          console.error('[createListing] Failed to notify followers:', err.message);
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[listings] createListing error:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
}

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'bidcraft/listings',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('[listings] uploadImage error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

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
        l.slug AS id, l.id AS "numericId", l.title, l.description, l.price, l.category, l.subcategory,
        l.buying_method AS "buyingMethod",
        l.image_urls AS "images",
        l.image_urls[1] AS image,
        l.creator_name AS creator,
        l.creator_rating AS "creatorRating",
        l.creator_review_count AS "creatorReviewCount",
        l.creator_badges AS "creatorBadges",
        l.is_verified AS verified,
        l.offers_allowed AS "offersAllowed",
        l.minimum_offer_percent AS "minimumOfferPercent",
        l.auction_ends_at AS "auctionEndsAt",
        l.current_bid AS "currentBid",
        l.bid_count AS "bidCount",
        l.specifications, l.reviews,
        l.status, l.created_at AS "createdAt",
        a.id AS "auctionId"
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      WHERE (l.slug = $1 OR l.id::text = $1) AND l.status::text != 'deleted'
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
  getNewArrivals,
  uploadImage
};
