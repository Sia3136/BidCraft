require('dotenv').config();
const db = require('./src/utils/db');

async function testTables() {
  try {
    const res = await db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    console.log(res.rows.map(r => r.table_name));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testTables();
