require('dotenv').config();
const db = require('./src/utils/db');

async function testDupes() {
  try {
    const res = await db.query(`SELECT id, COUNT(*) FROM listings GROUP BY id HAVING COUNT(*) > 1`);
    console.log('Duplicate IDs:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testDupes();
