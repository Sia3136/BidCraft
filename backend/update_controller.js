const fs = require('fs');
const path = 'C:/Bidcraft/backend/src/controllers/listingsController.js';
let content = fs.readFileSync(path, 'utf8');

// The new functions
const newFunctions = `
const getListings = async (req, res) => {
  try {
    const {
      category, subcategory, method, collection,
      occasion, type, minPrice, maxPrice,
      sort = 'newest', limit = 50, offset = 0
    } = req.query;

    const conditions = ["status = 'active'"];
    const values = [];
    let idx = 1;

    const slugifySQL = (col) =>
      \`regexp_replace(regexp_replace(lower(\${col}), '[&]', '', 'g'), '\\\\s+', '-', 'g')\`;

    if (category) {
      conditions.push(\`\${slugifySQL('category')} = $\${idx++}\`);
      values.push(category);
    }
    if (subcategory) {
      conditions.push(\`\${slugifySQL('subcategory')} = $\${idx++}\`);
      values.push(subcategory);
    }
    if (method) {
      const methodMap = { 'buy-now': 'Buy Now', 'auction': 'Auction', 'negotiable': 'Negotiable' };
      conditions.push(\`buying_method = $\${idx++}\`);
      values.push(methodMap[method] || method);
    }
    if (collection) {
      conditions.push(\`$\${idx++} = ANY(collections)\`);
      values.push(collection);
    }
    if (occasion) {
      conditions.push(\`$\${idx++} = ANY(occasions)\`);
      values.push(occasion);
    }
    if (type === 'new-arrivals') {
      conditions.push(\`new_arrival = true\`);
    }
    if (type === 'auction') {
      conditions.push(\`buying_method = 'Auction'\`);
    }
    if (minPrice) {
      conditions.push(\`price >= $\${idx++}\`);
      values.push(parseInt(minPrice));
    }
    if (maxPrice) {
      conditions.push(\`price <= $\${idx++}\`);
      values.push(parseInt(maxPrice));
    }

    const sortMap = {
      'newest': 'created_at DESC',
      'price-asc': 'price ASC',
      'price-desc': 'price DESC'
    };
    const orderBy = sortMap[sort] || 'created_at DESC';

    const where = conditions.length ? \`WHERE \${conditions.join(' AND ')}\` : '';

    const countResult = await db.query(
      \`SELECT COUNT(*) FROM listings \${where}\`, values
    );
    const total = parseInt(countResult.rows[0].count);

    values.push(parseInt(limit), parseInt(offset));
    const result = await db.query(\`
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
      \${where}
      ORDER BY \${orderBy}
      LIMIT $\${idx++} OFFSET $\${idx++}
    \`, values);

    res.json({
      listings: result.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + result.rows.length < total
    });
  } catch (err) {
    console.error('[listings] Error:', err.message);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(\`
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
      WHERE (slug = $1 OR id::text = $1) AND status != 'deleted'
    \`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[listings] Error:', err.message);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};

const getLiveAuctions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await db.query(\`
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
    \`, [parseInt(limit)]);
    res.json({ auctions: result.rows });
  } catch (err) {
    console.error('[listings] Error:', err.message);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const result = await db.query(\`
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
    \`);
    res.json({ listings: result.rows });
  } catch (err) {
    console.error('[listings] Error:', err.message);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
`;

// Extract before getListings
const getListingsStart = content.indexOf('async function getListings');
const beforeGetListings = content.substring(0, getListingsStart);

// Extract after getListingById
const updateListingStart = content.indexOf('async function updateListing');
const afterGetListingById = content.substring(updateListingStart);

// Update module.exports
let finalAfter = afterGetListingById.replace(
  /module\.exports\s*=\s*\{[\s\S]*?\};/,
  \`module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getLiveAuctions,
  getNewArrivals
};\`);

fs.writeFileSync(path, beforeGetListings + newFunctions + finalAfter);
console.log('Successfully updated listingsController.js');
