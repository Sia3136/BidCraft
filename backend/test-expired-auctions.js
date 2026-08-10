require('dotenv').config();
const db = require('./src/utils/db');

async function testExpiredAuctions() {
  try {
    const res = await db.query(`
      SELECT l.id, l.title, a.end_time 
      FROM listings l
      JOIN auctions a ON l.id = a.listing_id
      WHERE a.end_time < NOW()
    `);
    console.log('Expired Auctions:');
    res.rows.forEach(r => console.log(`${r.id} | ${r.title} | ${r.end_time}`));
    console.log('Total expired:', res.rows.length);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testExpiredAuctions();
