require('dotenv').config();
const db = require('./src/utils/db');

async function runMigrations() {
  const alterQueries = `
    ALTER TABLE escrow ADD COLUMN IF NOT EXISTS tracking_number text;
    ALTER TABLE escrow ADD COLUMN IF NOT EXISTS carrier text;
    ALTER TABLE escrow ADD COLUMN IF NOT EXISTS shipped_at timestamptz;
    ALTER TABLE escrow ADD COLUMN IF NOT EXISTS released_at timestamptz;

    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','expired')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await db.query(alterQueries);
  console.log("MIGRATIONS RAN SUCCESSFULLY.");
  process.exit(0);
}

runMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});
