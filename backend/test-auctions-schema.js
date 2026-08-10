require('dotenv').config();
const db = require('./src/utils/db');

async function testAuctionsSchema() {
  try {
    const res = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'auctions'`);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testAuctionsSchema();
