require('dotenv').config();
const db = require('./src/utils/db');

async function testDates() {
  try {
    const res = await db.query('SELECT id, title, created_at, seller_id FROM listings ORDER BY created_at DESC');
    console.log('Listings sorted by created_at:');
    res.rows.forEach(r => console.log(`${r.id} | ${r.title} | ${r.created_at} | Seller: ${r.seller_id}`));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testDates();
