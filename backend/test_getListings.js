require('dotenv').config();
const db = require('./src/utils/db');

async function run() {
  try {
    const conditions = ["l.status = 'active'", "(l.buying_method != 'Auction' OR COALESCE(a.end_time, l.auction_ends_at) > NOW())"]
    const values = []
    let idx = 1
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const countQuery = `SELECT COUNT(*) FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id ${where}`
    console.log("Count query:", countQuery)
    const countResult = await db.query(countQuery, values)
    console.log("Count:", countResult.rows[0].count)

    values.push(25, 0)
    
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

    const dataQuery = `
      SELECT
        ${BASE_LISTING_SELECT}
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      ${where}
      ORDER BY l.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `
    console.log("Data query:", dataQuery, "values:", values)
    const result = await db.query(dataQuery, values)
    console.log("Data length:", result.rows.length)
  } catch (err) {
    console.error("DB Error:", err)
  } finally {
    process.exit(0)
  }
}
run();
