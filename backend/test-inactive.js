require('dotenv').config();
const db = require('./src/utils/db');

async function testInactive() {
  try {
    const res = await db.query(`SELECT id, title, status FROM listings WHERE status != 'active'`);
    console.log('Inactive listings:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testInactive();
