require('dotenv').config();
const db = require('./src/utils/db');

async function syncListings() {
  console.log('Starting sync of listings.auction_ends_at...');
  try {
    const result = await db.query(`
      UPDATE listings l
      SET auction_ends_at = a.end_time, updated_at = NOW()
      FROM auctions a
      WHERE l.id = a.listing_id
      AND a.status = 'active'
      AND l.auction_ends_at != a.end_time
      RETURNING l.id, l.title, a.end_time;
    `);

    console.log(`Updated ${result.rowCount} listings successfully.`);
    if (result.rowCount > 0) {
      console.log(result.rows);
    }
  } catch (error) {
    console.error('Error syncing listings:', error);
  } finally {
    process.exit(0);
  }
}

syncListings();
