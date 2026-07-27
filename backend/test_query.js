require('dotenv').config();
const db = require('./src/utils/db');

async function test() {
  try {
    const res = await db.query(`SELECT 
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
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      LIMIT 1`);
    console.log(res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
test();
