const fs = require('fs');
const path = require('path');

exports.up = (pgm) => {
  const sqlPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  pgm.sql(sql);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS follows CASCADE;
    DROP TABLE IF EXISTS wishlist CASCADE;
    DROP TABLE IF EXISTS disputes CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS shipments CASCADE;
    DROP TABLE IF EXISTS escrow_audit_log CASCADE;
    DROP TABLE IF EXISTS escrow CASCADE;
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS bids CASCADE;
    DROP TABLE IF EXISTS auctions CASCADE;
    DROP TABLE IF EXISTS listings CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP FUNCTION IF EXISTS update_updated_at CASCADE;
    DROP TYPE IF EXISTS dispute_status CASCADE;
    DROP TYPE IF EXISTS escrow_status CASCADE;
    DROP TYPE IF EXISTS payment_status CASCADE;
    DROP TYPE IF EXISTS order_status CASCADE;
    DROP TYPE IF EXISTS auction_status CASCADE;
    DROP TYPE IF EXISTS listing_status CASCADE;
  `);
};

