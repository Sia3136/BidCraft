require('dotenv').config();
const db = require('./src/utils/db');

async function testPrices() {
  try {
    const res = await db.query(`SELECT id, title, price FROM listings WHERE price < 50 OR price > 5000`);
    console.log('Listings out of price bounds (50 - 5000):');
    res.rows.forEach(r => console.log(`${r.id} | ${r.title} | ${r.price}`));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testPrices();
