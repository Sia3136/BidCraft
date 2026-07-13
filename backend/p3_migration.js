const { Pool } = require('pg');
require('dotenv').config({ path: '../frontend/.env.local' });
require('dotenv').config({ path: '../frontend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  try {
    await pool.query('BEGIN');

    console.log('1. Adding pg_trgm extension and GIN indexes for search...');
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_listings_title_trgm ON listings USING GIN (title gin_trgm_ops);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_listings_description_trgm ON listings USING GIN (description gin_trgm_ops);`);

    console.log('2. Updating dispute_status enum to remove "review"...');
    // Drop old enum and replace (safe since disputes is empty, but we'll do it safely anyway)
    await pool.query(`
      ALTER TYPE dispute_status RENAME TO dispute_status_old;
      CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'resolved', 'dismissed');
      ALTER TABLE disputes ALTER COLUMN status DROP DEFAULT;
      ALTER TABLE disputes ALTER COLUMN status TYPE dispute_status USING status::text::dispute_status;
      ALTER TABLE disputes ALTER COLUMN status SET DEFAULT 'open'::dispute_status;
      DROP TYPE dispute_status_old;
    `);

    console.log('3. Updating wishlist FK to CASCADE...');
    // Find the foreign key constraint name for listing_id
    const fkRes = await pool.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'wishlist'::regclass
        AND confrelid = 'listings'::regclass
    `);
    
    for (const row of fkRes.rows) {
      await pool.query(`ALTER TABLE wishlist DROP CONSTRAINT "${row.conname}";`);
    }
    
    await pool.query(`
      ALTER TABLE wishlist
      ADD CONSTRAINT wishlist_listing_id_fkey
      FOREIGN KEY (listing_id) REFERENCES listings(id)
      ON DELETE CASCADE;
    `);

    await pool.query('COMMIT');
    console.log('Migration successful.');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

runMigration();
