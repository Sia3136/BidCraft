require('dotenv').config();
const db = require('./src/utils/db');

async function testUsers() {
  try {
    const res = await db.query('SELECT id, email, created_at FROM users WHERE id IN (1042, 1043, 1044, 1045)');
    console.log('Sellers:');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testUsers();
