require('dotenv').config();
const db = require('./src/utils/db');

async function testNullEndTimes() {
  try {
    const res = await db.query(`
      SELECT l.id, l.title, l.buying_method, l.auction_ends_at, a.end_time
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      WHERE l.buying_method = 'Auction'
        AND l.auction_ends_at IS NULL
        AND a.end_time IS NULL
    `);
    console.log('Null end times:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testNullEndTimes();
