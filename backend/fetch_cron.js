const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function fix() {
  try {
    const res = await pool.query("SELECT id, status, end_time FROM auctions WHERE status = 'active' AND end_time <= NOW()");
    console.log(res.rows);
  } catch(e) { console.error(e); } finally { pool.end(); }
}
fix();
