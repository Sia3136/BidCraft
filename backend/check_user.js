const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  try {
    const res = await pool.query("SELECT id, email, role FROM users WHERE email = 'siyarozani31@gmail.com'");
    console.log('User:', res.rows);
    if (res.rows.length > 0) {
      const sellerId = res.rows[0].id;
      const listingsRes = await pool.query("SELECT id, title, buying_method, status FROM listings WHERE seller_id = $1", [sellerId]);
      console.log('Listings:', listingsRes.rows);
    }
  } catch(e) { console.error(e); } finally { pool.end(); }
}
check();
