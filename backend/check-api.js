require('dotenv').config();
const db = require('./src/utils/db');

async function testQuery() {
  try {
    const where = "WHERE l.status = 'active'";
    const BASE_LISTING_SELECT = `
      COALESCE(l.slug, l.id::text) AS id, l.id AS "numericId", l.title, l.description, l.price, l.category, l.subcategory,
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
      COALESCE(a.end_time::timestamptz, l.auction_ends_at) AS "auctionEndsAt",
      COALESCE(a.current_bid, l.current_bid) AS "currentBid",
      l.bid_count AS "bidCount",
      l.specifications, l.reviews,
      l.status, l.created_at AS "createdAt",
      l.ships_from AS "shipsFrom",
      l.dispatch_days AS "dispatchDays",
      l.estimated_min AS "estimatedMin",
      l.estimated_max AS "estimatedMax",
      l.returns_policy AS "returnsPolicy",
      l.packaging_note AS "packagingNote",
      l.seller_id AS "sellerId",
      l.condition
    `;

    const countRes = await db.query(`SELECT COUNT(*) FROM listings l ${where}`);
    console.log('Count (*) from listings WHERE status = active:', countRes.rows[0].count);

    const res = await db.query(`
      SELECT
        ${BASE_LISTING_SELECT}
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      ${where}
    `);
    console.log('Count from LEFT JOIN query:', res.rows.length);

    if (res.rows.length !== parseInt(countRes.rows[0].count)) {
      console.log('Mismatch in counts!');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testQuery();
