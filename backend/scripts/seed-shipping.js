/**
 * seed-shipping.js — populates shipping metadata for all 106 listings.
 *
 * Run from c:\Bidcraft\backend:
 *   node -r dotenv/config scripts/seed-shipping.js
 *
 * Idempotent: uses ON CONFLICT DO UPDATE (upsert by id).
 * No Prisma — raw pg via existing db utility.
 */

const db = require('../src/utils/db');


const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Jaipur',
  'Kolkata', 'Chennai', 'Pune', 'Ahmedabad'
];

const RETURNS_POLICIES = [
  'Returns accepted within 7 days',
  'No returns — contact seller for issues',
  'Exchange only within 5 days'
];

const PACKAGING_NOTES = [
  'Bubble-wrapped and boxed',
  'Cloth-wrapped with care',
  'Rigid mailer with padding',
  'Eco-friendly kraft packaging'
];

function getShippingForListing(id) {
  const city          = CITIES[id % CITIES.length];
  const dispatch_days = 1 + (id % 5); // 1–5
  const estimated_min = 4 + (id % 4); // 4–7
  const estimated_max = 8 + (id % 7); // 8–14
  const returns_policy = RETURNS_POLICIES[id % RETURNS_POLICIES.length];
  const packaging_note = PACKAGING_NOTES[id % PACKAGING_NOTES.length];

  return { city, dispatch_days, estimated_min, estimated_max, returns_policy, packaging_note };
}

async function main() {
  console.log('🔍 Fetching all listing IDs...');

  const result = await db.query(`
    SELECT id FROM listings WHERE status IN ('active', 'paused', 'sold') ORDER BY id
  `);
  const listings = result.rows;
  console.log(`Found ${listings.length} listings.`);

  if (listings.length === 0) {
    console.error('No listings found. Run the listing seed first.');
    process.exit(1);
  }

  let updated = 0;
  for (const { id } of listings) {
    const s = getShippingForListing(id);

    // Check if seller has a city in their profile, use that if available
    const profileRes = await db.query(`
      SELECT p.city FROM profiles p
      JOIN listings l ON l.seller_id = p.user_id
      WHERE l.id = $1 AND p.city IS NOT NULL AND p.city != ''
      LIMIT 1
    `, [id]);

    const ships_from = profileRes.rows[0]?.city || s.city;

    await db.query(`
      UPDATE listings SET
        ships_from     = $1,
        dispatch_days  = $2,
        estimated_min  = $3,
        estimated_max  = $4,
        returns_policy = $5,
        packaging_note = $6
      WHERE id = $7
    `, [
      ships_from, s.dispatch_days, s.estimated_min,
      s.estimated_max, s.returns_policy, s.packaging_note, id
    ]);

    updated++;
  }

  console.log(`\n✅ Done. Shipping metadata updated for ${updated} listings.`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
