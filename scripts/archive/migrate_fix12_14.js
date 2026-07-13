require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Creating notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        link TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Running ALTER TABLE statements for listings...');
    await client.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS offer_floor_percent INTEGER DEFAULT 30;`);
    await client.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';`);
    await client.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;`);

    console.log('Running ALTER TABLE statements for auctions...');
    await client.query(`ALTER TABLE auctions ADD COLUMN IF NOT EXISTS winner_id INTEGER REFERENCES users(id);`);
    await client.query(`ALTER TABLE auctions ADD COLUMN IF NOT EXISTS second_bidder_id INTEGER REFERENCES users(id);`);
    await client.query(`ALTER TABLE auctions ADD COLUMN IF NOT EXISTS confirmation_deadline TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE auctions ADD COLUMN IF NOT EXISTS second_bidder_deadline TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE auctions ADD COLUMN IF NOT EXISTS post_end_action TEXT;`);

    console.log('Running ALTER TABLE statements for users...');
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'not_started';`);

    await client.query('COMMIT');
    console.log('Migration Fix12 & 14 completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
