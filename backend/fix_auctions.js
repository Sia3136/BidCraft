const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function fix() {
  try {
    await pool.query("UPDATE auctions SET status = 'active' WHERE listing_id IN (690005093, 690279242, 734216181)");
    const res = await pool.query("SELECT id, status, start_time, end_time FROM auctions WHERE listing_id IN (690005093, 690279242, 734216181)");
    console.log(res.rows);
  } catch(e) { console.error(e); } finally { pool.end(); }
}
fix();
