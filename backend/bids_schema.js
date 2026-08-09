const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'bids'");
    console.log('Bids:', res.rows.map(r => r.column_name).join(', '));
  } catch(e) { console.error(e); } finally { pool.end(); }
}
check();
