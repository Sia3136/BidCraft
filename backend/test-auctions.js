require('dotenv').config();
const db = require('./src/utils/db');

async function testAuctions() {
  try {
    const res = await db.query(`SELECT id, title, listing_type, buying_method, auction_ends_at FROM listings WHERE buying_method = 'Auction' OR listing_type = 'auction'`);
    console.log('Auctions:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testAuctions();
