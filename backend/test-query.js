require('dotenv').config();
const db = require('./src/utils/db');
async function run() {
  const client = await db.pool.connect();
  try {
    const res = await client.query(`SELECT l.id, l.title, l.status, a.status as auction_status, a.id as auction_id, a.duration_days, a.end_time FROM listings l LEFT JOIN auctions a ON l.id = a.listing_id WHERE a.status = 'closed' OR l.status != 'active'`);
    console.log(JSON.stringify(res.rows, null, 2));
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
