const db = require('../utils/db');
const Joi = require('joi');
const notificationService = require('../services/notificationService');
const redis = require('../utils/redis');
const { validateImageFile } = require('../utils/fileValidator');

const EDITABLE_AUCTION_FIELDS = ['specifications', 'collections', 'occasions', 'photos', 'imageUrls'];

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

const UPDATE_FIELD_MAP = {
  title: 'title',
  description: 'description',
  price: 'price',
  category: 'category',
  subcategory: 'subcategory',
  buyingMethod: 'buying_method',
  offersAllowed: 'offers_allowed',
  minimumOfferPercent: 'minimum_offer_percent',
  specifications: 'specifications',
  imageUrls: 'image_urls',
  auctionEndsAt: 'auction_ends_at',
  collections: 'collections',
  occasions: 'occasions'
};

const BASE_LISTING_SELECT = `
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
  l.new_arrival AS "newArrival",
  l.collections, l.occasions,
  COALESCE(a.end_time, l.auction_ends_at) AS "auctionEndsAt",
  COALESCE(a.current_bid, l.current_bid) AS "currentBid",
  l.bid_count AS "bidCount",
  l.specifications, l.reviews,
  l.status, l.created_at AS "createdAt"
`;

const categoriesData = require('../utils/categories.js');
const VALID_CATEGORIES = categoriesData.categories.map(c => c.name);
const VALID_SUBCATEGORIES = categoriesData.categories.flatMap(c => c.subcategories);

const createListingSchema = Joi.object({
  title: Joi.string().min(5).max(250).required(),
  description: Joi.string().min(200).required(),
  price: Joi.number().min(50).max(50000).required(),
  category: Joi.string().valid(...VALID_CATEGORIES).required(),
  subcategory: Joi.string().valid(...VALID_SUBCATEGORIES).required(),
  buyingMethod: Joi.string().valid('Buy Now', 'Auction', 'Negotiable').required(),
  offersAllowed: Joi.boolean().optional(),
  minimumOfferPercent: Joi.number().min(50).max(100).optional(),
  specifications: Joi.object().optional(),
  imageUrls: Joi.array().items(Joi.string()).min(1).max(6).required(),
  auctionEndsAt: Joi.date().optional(),
  collections: Joi.array().items(Joi.string()).optional(),
  occasions: Joi.array().items(Joi.string()).optional()
});

const updateListingSchema = Joi.object({
  title: Joi.string().min(5).max(250).optional(),
  description: Joi.string().min(200).optional(),
  price: Joi.number().min(50).max(50000).optional(),
  category: Joi.string().valid(...VALID_CATEGORIES).optional(),
  subcategory: Joi.string().valid(...VALID_SUBCATEGORIES).optional(),
  buyingMethod: Joi.string().valid('Buy Now', 'Auction', 'Negotiable').optional(),
  offersAllowed: Joi.boolean().optional(),
  minimumOfferPercent: Joi.number().min(50).max(100).optional(),
  specifications: Joi.object().optional(),
  imageUrls: Joi.array().items(Joi.string()).min(1).max(6).optional(),
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
        // Architecture Note (see docs/ADR-001-Auction-Creation-Flow.md):
        // Auctions are provisioned automatically here alongside the listing to streamline 
        // the production workflow and avoid orphaned listings. 
        // The standalone POST /api/auctions endpoint is retained for future structural flexibility.
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

      res.status(201).json({ 
        success: true, 
        listing: { id: listingId, title } 
      });
      
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

    const validation = validateImageFile(req.file.buffer);
    if (!validation.valid) {
      return res.status(400).json({ error: 'invalid_file_content', message: validation.reason });
    }

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
      sort = 'newest', limit = DEFAULT_PAGE_SIZE, offset = 0
    } = req.query

    const parsedLimit = parseInt(limit);
    const finalLimit = isNaN(parsedLimit) ? DEFAULT_PAGE_SIZE : Math.max(1, Math.min(parsedLimit, MAX_PAGE_SIZE));

    const conditions = ["l.status = 'active'", "(l.buying_method != 'Auction' OR COALESCE(a.end_time, l.auction_ends_at) > NOW())"]
    const values = []
    let idx = 1

    const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    if (category) {
      const cats = category.split(',').map(c => c.trim());
      const mappedCats = cats.map(cat => VALID_CATEGORIES.find(c => slugify(c) === cat) || cat);
      conditions.push(`l.category = ANY($${idx++}::text[])`)
      values.push(mappedCats)
    }
    if (subcategory) {
      const subcats = subcategory.split(',').map(s => s.trim());
      const mappedSubcats = subcats.map(subcat => VALID_SUBCATEGORIES.find(s => slugify(s) === subcat) || subcat);
      conditions.push(`l.subcategory = ANY($${idx++}::text[])`)
      values.push(mappedSubcats)
    }
    if (method) {
      const methods = method.split(',').map(m => m.trim());
      const methodMap = { 'buy-now': 'Buy Now', 'auction': 'Auction', 'negotiable': 'Negotiable' }
      const mappedMethods = methods.map(m => methodMap[m] || m);
      conditions.push(`l.buying_method = ANY($${idx++}::text[])`)
      values.push(mappedMethods)
    }
    const search = req.query.search;
    if (search) {
      conditions.push(`(LOWER(l.title) LIKE LOWER($${idx}) OR LOWER(l.description) LIKE LOWER($${idx}) OR LOWER(l.collections::text) LIKE LOWER($${idx}) OR LOWER(l.occasions::text) LIKE LOWER($${idx}))`)
      values.push(`%${search}%`)
      idx++
    }
    if (collection === 'vintage-retro') {
      conditions.push(`(l.collections::text ILIKE '%vintage%' OR l.collections::text ILIKE '%retro%')`)
    } else if (collection === 'modern-minimalist') {
      conditions.push(`(l.collections::text ILIKE '%minimalist%' OR l.collections::text ILIKE '%modern%')`)
    } else if (collection === 'traditional-arts') {
      conditions.push(`(l.collections::text ILIKE '%traditional%' OR l.collections::text ILIKE '%folk%')`)
    } else if (collection) {
      conditions.push(`$${idx++} = ANY(l.collections)`)
      values.push(collection)
    }
    
    const gift = req.query.gift;
    if (gift === 'birthdays') {
      conditions.push(`l.occasions::text ILIKE '%birthday%'`)
    } else if (gift === 'anniversaries') {
      conditions.push(`l.occasions::text ILIKE '%anniversary%'`)
    } else if (gift === 'housewarming') {
      conditions.push(`l.occasions::text ILIKE '%housewarming%'`)
    } else if (gift === 'just-because') {
      conditions.push(`l.occasions::text ILIKE '%gift%'`)
    } else if (occasion) {
      conditions.push(`$${idx++} = ANY(l.occasions)`)
      values.push(occasion)
    }

    if (type === 'new-arrivals') {
      conditions.push(`l.new_arrival = true`)
    } else if (type) {
      conditions.push(`l.listing_type = $${idx++}`)
      values.push(type)
    }
    
    if (minPrice) {
      conditions.push(`l.price >= $${idx++}`)
      values.push(parseInt(minPrice))
    }
    if (maxPrice) {
      conditions.push(`l.price <= $${idx++}`)
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
      `SELECT COUNT(*) FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id ${where}`, values
    )
    const total = parseInt(countResult.rows[0].count)

    // Data query
    values.push(finalLimit, parseInt(offset))
    const result = await db.query(`
      SELECT
        ${BASE_LISTING_SELECT}
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      ${where}
      ORDER BY ${orderBy.includes('price') ? 'l.' + orderBy : 'l.' + orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `, values)

    res.json({
      listings: result.rows,
      total,
      limit: finalLimit,
      offset: parseInt(offset),
      hasMore: parseInt(offset) + result.rows.length < total
    })
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getListingById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await db.query(`
      SELECT
        ${BASE_LISTING_SELECT},
        a.id AS "auctionId",
        a.status AS auction_status,
        a.start_bid AS starting_bid,
        (SELECT MAX(bid_amount) FROM bids WHERE auction_id = a.id) as highest_bid
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
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getLiveAuctions = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const result = await db.query(`
      SELECT
        ${BASE_LISTING_SELECT}
      FROM listings l
      JOIN auctions a ON a.listing_id = l.id
      WHERE l.listing_type = 'auction'
        AND l.status = 'active'
        AND a.end_time > NOW()
      ORDER BY a.end_time ASC
      LIMIT $1
    `, [parseInt(limit)])
    res.json({ auctions: result.rows })
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getNewArrivals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        ${BASE_LISTING_SELECT}
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      WHERE l.status = 'active'
        AND l.is_published = true
        AND l.listing_type != 'auction'
      ORDER BY l.created_at DESC
      LIMIT 15
    `)
    res.json({ listings: result.rows })
  } catch (err) {
    console.error('[listings] Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}


async function updateListing(req, res, next) {
  try {
    const { id } = req.params;
    const { error, value } = updateListingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check listing ownership
    const ownershipCheck = await db.query('SELECT seller_id, buying_method, status FROM listings WHERE id = $1', [id]);
    const listing = ownershipCheck.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id !== req.userId) return res.status(403).json({ error: 'unauthorized_action' });

    if (listing.buying_method === 'Auction' && listing.status === 'active') {
      const bidCheck = await db.query(`
        SELECT COUNT(*) FROM bids b 
        JOIN auctions a ON a.id = b.auction_id 
        WHERE a.listing_id = $1
      `, [id]);
      if (parseInt(bidCheck.rows[0].count) > 0) {
        const prohibitedFields = Object.keys(value).filter(key => !EDITABLE_AUCTION_FIELDS.includes(key));
        if (prohibitedFields.length > 0) {
          return res.status(400).json({ 
            error: 'Cannot modify these fields once an auction has bids.', 
            prohibitedFields 
          });
        }
      }
    }

    const updates = [];
    const params = [id];

    Object.keys(value).forEach((key) => {
      const dbColumn = UPDATE_FIELD_MAP[key];
      if (!dbColumn) return;

      let val = value[key];
      params.push(val);
      updates.push(`${dbColumn} = $${params.length}`);

      if (key === 'imageUrls') {
        params.push(JSON.stringify(val));
        updates.push(`photos = $${params.length}`);
      }
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
