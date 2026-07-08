const db = require('./src/utils/db');

async function run() {
  try {
    console.log('Running auction DB fix...');

    const res = await db.query(`
      INSERT INTO auctions (listing_id, seller_id, start_bid, current_bid, min_bid_increment, start_time, end_time, status, created_at, updated_at)
      SELECT id, seller_id, price, price, 10.00, NOW(), NOW() + INTERVAL '5 days', 'active', NOW(), NOW()
      FROM listings
      WHERE buying_method = 'Auction'
        AND id NOT IN (SELECT listing_id FROM auctions)
      RETURNING id;
    `);
    
    console.log('Inserted missing auction rows:', res.rowCount);
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}
run();
