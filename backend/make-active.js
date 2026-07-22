const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const res2 = await pool.query(`UPDATE auctions SET status = 'active', end_time = NOW() + INTERVAL '1 day' WHERE id = (SELECT id FROM auctions LIMIT 1) RETURNING id`);
  console.log('Made active:', res2.rows[0].id);
  pool.end();
}
run();
