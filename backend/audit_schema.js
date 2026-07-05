require('dotenv').config();
const db = require('./src/utils/db');

async function auditSchema() {
  const result = await db.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'listings';
  `);
  console.log("CURRENT COLUMNS:");
  console.log(result.rows);

  const alterQueries = `
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS subcategory text;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS buying_method text CHECK (buying_method IN ('Buy Now', 'Auction', 'Negotiable'));
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS creator_name text;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS creator_rating numeric(3,2);
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS creator_review_count integer DEFAULT 0;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS creator_badges text[] DEFAULT '{}';
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS offers_allowed boolean DEFAULT false;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS minimum_offer_percent integer DEFAULT 70;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS new_arrival boolean DEFAULT false;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS collections text[] DEFAULT '{}';
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS occasions text[] DEFAULT '{}';
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS auction_ends_at timestamptz;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS current_bid integer;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS bid_count integer DEFAULT 0;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}';
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '[]';
  `;

  await db.query(alterQueries);
  console.log("ALTER QUERIES RAN SUCCESSFULLY.");

  const newResult = await db.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'listings';
  `);
  console.log("NEW COLUMNS:");
  console.log(newResult.rows);
  
  process.exit(0);
}

auditSchema().catch(err => {
  console.error(err);
  process.exit(1);
});
