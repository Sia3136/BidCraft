const fs = require('fs');

const productsCode = fs.readFileSync('C:/Bidcraft/frontend/lib/exploreProducts.ts', 'utf8');

const startIndex = productsCode.indexOf('[');
const endIndex = productsCode.indexOf('];') + 1;
const arrayStr = productsCode.substring(startIndex, endIndex);

const jsCode = `const products = ${arrayStr};`;

const seedCode = `
require('dotenv').config({ path: '../.env' });
const db = require('../src/utils/db');

${jsCode}

const prefixMap = {
  'exp': 10000,
  'art': 20000,
  'hc': 30000,
  'ls': 40000,
  'gh': 50000,
  'col': 60000
};

function getNumericId(stringId) {
  if (!stringId) return Math.floor(Math.random() * 10000);
  const parts = stringId.split('-');
  if (parts.length < 2) return Math.floor(Math.random() * 10000);
  const prefix = parts[0];
  const num = parts[1];
  return (prefixMap[prefix] || 90000) + parseInt(num, 10);
}

async function seedListings() {
  let count = 0;
  for (const product of products) {
    try {
      const numericId = getNumericId(product.id);
      await db.query(\`
        INSERT INTO listings (
          id, title, description, price, category, subcategory,
          buying_method, image_urls, seller_id, creator_name,
          creator_rating, creator_review_count, creator_badges,
          is_verified, offers_allowed, minimum_offer_percent,
          new_arrival, collections, occasions,
          auction_ends_at, current_bid, bid_count,
          specifications, reviews, status, created_at, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,
          $20,$21,$22,$23,$24,'active',NOW(),NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          buying_method = EXCLUDED.buying_method,
          image_urls = EXCLUDED.image_urls,
          creator_name = EXCLUDED.creator_name,
          creator_rating = EXCLUDED.creator_rating,
          creator_review_count = EXCLUDED.creator_review_count,
          creator_badges = EXCLUDED.creator_badges,
          is_verified = EXCLUDED.is_verified,
          offers_allowed = EXCLUDED.offers_allowed,
          auction_ends_at = EXCLUDED.auction_ends_at,
          current_bid = EXCLUDED.current_bid,
          bid_count = EXCLUDED.bid_count,
          specifications = EXCLUDED.specifications,
          reviews = EXCLUDED.reviews,
          updated_at = NOW()
      \`, [
        numericId,
        product.title,
        product.description || '',
        product.price || 0,
        product.category || 'Other',
        product.subcategory || '',
        product.buyingMethod || 'Buy Now',
        product.images || (product.image ? [product.image] : []),
        999999,
        product.creator || 'Unknown',
        product.creatorRating || 4.5,
        product.creatorReviewCount || 50,
        product.creatorBadges || [],
        product.verified || false,
        product.offersAllowed || false,
        product.minimumOfferPercent || 70,
        product.newArrival || false,
        product.collections || [],
        product.occasions || [],
        product.auctionEndsAt ? new Date(product.auctionEndsAt) : null,
        product.currentBid || null,
        product.bidCount || 0,
        JSON.stringify(product.specifications || {}),
        JSON.stringify(product.reviews || [])
      ]);
      console.log(\`Seeded: \${product.id} (mapped to \${numericId}) — \${product.title}\`);
      count++;
    } catch (e) {
      console.error(\`Failed to seed \${product.id}:\`);
      console.error(e);
    }
  }
  console.log(\`Seed complete. \${count} listings inserted/updated.\`);
  process.exit(0);
}

seedListings();
`;

fs.writeFileSync('C:/Bidcraft/backend/scripts/seedListings.js', seedCode);
console.log("Created seedListings.js");
