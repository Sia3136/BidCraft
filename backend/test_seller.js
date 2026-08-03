const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({connectionString: process.env.DATABASE_URL});
async function run() {
  const res = await p.query('SELECT l.seller_id AS "sellerId", l.id, l.creator_name FROM listings l LIMIT 5');
  console.log(res.rows);
  p.end();
}
run();
