require('dotenv').config();
const db = require('./src/utils/db');

async function testExpiredListingAuctions() {
  try {
    const res = await db.query(`
      SELECT id, title, auction_ends_at 
      FROM listings
      WHERE auction_ends_at < NOW()
    `);
    console.log('Expired Listings (auction_ends_at):');
    res.rows.forEach(r => console.log(`${r.id} | ${r.title} | ${r.auction_ends_at}`));
    console.log('Total expired:', res.rows.length);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testExpiredListingAuctions();
