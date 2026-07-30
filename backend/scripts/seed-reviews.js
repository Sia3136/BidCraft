/**
 * seed-reviews.js — seeds seller_reputation_reviews for all listings.
 *
 * Run from c:\Bidcraft\backend:
 *   node -r dotenv/config scripts/seed-reviews.js
 *
 * Idempotent: truncates then re-inserts (deterministic via listing_id seeding).
 * Reviews are attached to the seller_id of each listing.
 * No Prisma — uses raw pg via the existing db utility.
 */

const db = require('../src/utils/db');


// --- Name pools ---
const FIRST_NAMES = [
  'Priya', 'Arjun', 'Kavya', 'Rohit', 'Meera', 'Vikram', 'Sneha', 'Aditya',
  'Pooja', 'Rahul', 'Ananya', 'Karan', 'Deepika', 'Suresh', 'Nandita',
  'Sanjay', 'Kritika', 'Amit', 'Shruti', 'Varun', 'Ishaan', 'Divya',
  'Manish', 'Riya', 'Nikhil', 'Simran', 'Gaurav', 'Tanvi', 'Kunal', 'Puja'
];
const LAST_INITIALS = 'ABCDFGHKMNPRSTV'.split('');

// Deterministic pseudo-random using a simple LCG seeded by integer.
function seededRand(seed) {
  let s = (seed >>> 0) + 1;
  return function () {
    s = ((s * 1664525 + 1013904223) >>> 0);
    return s / 0xFFFFFFFF;
  };
}

function pickName(rand) {
  const fi = Math.floor(rand() * FIRST_NAMES.length);
  const li = Math.floor(rand() * LAST_INITIALS.length);
  return `${FIRST_NAMES[fi]} ${LAST_INITIALS[li]}.`;
}

function pickRating(rand, listingId) {
  // Each listing gets a slightly different star distribution to avoid uniformity.
  // Base distribution (roughly Etsy-like):
  //   5★: 38-52%  4★: 22-30%  3★: 10-16%  2★: 5-10%  1★: 3-8%
  // We apply per-listing noise using listing_id % 5 to shift the distribution.

  const variant = listingId % 5;
  // Cumulative probability thresholds (for 5,4,3,2,1 stars)
  const distributions = [
    [0.48, 0.75, 0.88, 0.95, 1.00], // variant 0 — high quality
    [0.52, 0.78, 0.90, 0.96, 1.00], // variant 1 — very high quality
    [0.38, 0.65, 0.81, 0.91, 1.00], // variant 2 — moderate, more 1★ and 2★
    [0.42, 0.68, 0.84, 0.93, 1.00], // variant 3 — balanced
    [0.45, 0.72, 0.86, 0.94, 1.00], // variant 4 — slightly high
  ];

  const thresholds = distributions[variant];
  const r = rand();
  if (r < thresholds[0]) return 5;
  if (r < thresholds[1]) return 4;
  if (r < thresholds[2]) return 3;
  if (r < thresholds[3]) return 2;
  return 1;
}

function daysAgoDate(rand, maxDaysAgo = 540) {
  const days = Math.floor(rand() * maxDaysAgo);
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function reviewCountForListing(listingId) {
  // Vary 8–340, deterministic by listing_id.
  // Use golden ratio spread to avoid clustering.
  const base = (listingId * 2654435761) >>> 0; // Knuth multiplicative hash
  return 8 + (base % 333);
}

async function main() {
  console.log('🔍 Fetching all listing IDs and their seller_ids...');

  const result = await db.query(`
    SELECT id AS listing_id, seller_id
    FROM listings
    WHERE status IN ('active', 'paused', 'sold')
    ORDER BY id
  `);

  const listings = result.rows;
  console.log(`Found ${listings.length} listings.`);

  if (listings.length === 0) {
    console.error('No listings found. Run the listing seed first.');
    process.exit(1);
  }

  // Clear existing generated reviews (idempotent)
  await db.query(`TRUNCATE TABLE seller_reputation_reviews RESTART IDENTITY CASCADE`);
  console.log('Cleared existing seller_reputation_reviews.');

  // Group by seller_id — we don't want to double-seed the same seller from multiple listings.
  // Instead, we choose a "primary listing" per seller (lowest listing id) for the count,
  // then scale other listings proportionally so totals vary realistically.
  const sellerSeeds = new Map(); // seller_id -> primary seed

  for (const { listing_id, seller_id } of listings) {
    if (!sellerSeeds.has(seller_id)) {
      sellerSeeds.set(seller_id, listing_id); // first listing_id seen for this seller
    }
  }

  let totalInserted = 0;

  for (const [sellerId, primaryListingId] of sellerSeeds.entries()) {
    const count = reviewCountForListing(primaryListingId);
    const rand = seededRand(primaryListingId * 31337);

    const batch = [];
    for (let i = 0; i < count; i++) {
      const name = pickName(rand);
      const rating = pickRating(rand, primaryListingId);
      const createdAt = daysAgoDate(rand, 540);
      batch.push({ sellerId, name, rating, createdAt });
    }

    // Insert in batches of 50
    const BATCH_SIZE = 50;
    for (let b = 0; b < batch.length; b += BATCH_SIZE) {
      const chunk = batch.slice(b, b + BATCH_SIZE);
      const values = [];
      const placeholders = chunk.map((row, i) => {
        const base = i * 4;
        values.push(row.sellerId, row.name, row.rating, row.createdAt);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
      });

      await db.query(
        `INSERT INTO seller_reputation_reviews (seller_id, reviewer_name, rating, created_at)
         VALUES ${placeholders.join(', ')}`,
        values
      );
    }

    totalInserted += count;
    console.log(`  seller_id=${sellerId} → ${count} reviews seeded.`);
  }

  console.log(`\n✅ Done. ${totalInserted} reviews inserted for ${sellerSeeds.size} sellers.`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
