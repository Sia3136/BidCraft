const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_deposit_status') THEN
          CREATE TYPE bid_deposit_status AS ENUM ('held','refunded','forfeited');
        END IF;
      END$$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bid_deposits (
        id SERIAL PRIMARY KEY,
        auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
        razorpay_payment_id VARCHAR(200),
        status bid_deposit_status DEFAULT 'held',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(auction_id, user_id)
      );
    `);

    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS delivery_otp VARCHAR(10),
      ADD COLUMN IF NOT EXISTS delivery_otp_expires_at TIMESTAMP;
    `);

    await pool.query(`
      ALTER TABLE escrow
      ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(200),
      ADD COLUMN IF NOT EXISTS release_trigger VARCHAR(50);
    `);

    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

run();
