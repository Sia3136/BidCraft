const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(async () => {
  try {
    const conditions = ["l.status = 'active'", "(l.buying_method != 'Auction' OR COALESCE(a.end_time, l.auction_ends_at) > NOW())"];
    const values = [];
    let idx = 1;
    const where = `WHERE ${conditions.join(' AND ')}`;
    
    values.push(24, 0);
    const dataQuery = `
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
        l.new_arrival AS "newArrival",
        l.collections, l.occasions,
        COALESCE(a.end_time, l.auction_ends_at) AS "auctionEndsAt",
        COALESCE(a.current_bid, l.current_bid) AS "currentBid",
        l.bid_count AS "bidCount",
        l.specifications, l.reviews,
        l.status, l.created_at AS "createdAt"
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      ${where}
      ORDER BY l.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    const resData = await client.query(dataQuery, values);
    
    // Test serialization
    const serialized = JSON.stringify(resData.rows);
    console.log('SUCCESS, length:', serialized.length);
  } catch(e) {
    console.error('ERROR:', e);
  } finally {
    client.end();
  }
});
