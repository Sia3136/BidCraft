require('dotenv').config();
const db = require('./src/utils/db');

async function checkListings() {
  try {
    const res = await db.query(`SELECT status, buying_method, COUNT(*) FROM listings GROUP BY status, buying_method;`);
    console.table(res.rows);
    const res2 = await db.query(`SELECT COUNT(*) FROM listings;`);
    console.log('Total listings:', res2.rows[0].count);
    
    // Check if any auctions are expired
    const expiredAuctions = await db.query(`SELECT COUNT(*) FROM listings WHERE buying_method = 'Auction' AND auction_ends_at < NOW();`);
    console.log('Expired Auctions:', expiredAuctions.rows[0].count);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkListings();
