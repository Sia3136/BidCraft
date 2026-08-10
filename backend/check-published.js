require('dotenv').config();
const db = require('./src/utils/db');

async function testPublished() {
  try {
    const res = await db.query(`SELECT id, title, is_published FROM listings WHERE is_published = false OR is_published IS NULL`);
    console.log('Listings unpublished or null:');
    res.rows.forEach(r => console.log(`${r.id} | ${r.title} | ${r.is_published}`));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testPublished();
