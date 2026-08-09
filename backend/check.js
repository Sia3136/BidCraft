const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function checkListings() {
  try {
    const totalCount = await pool.query("SELECT count(*) FROM listings");
    console.log('Total listings:', totalCount.rows[0].count);
    const activeCount = await pool.query("SELECT count(*) FROM listings WHERE status = 'active'");
    console.log('Active listings:', activeCount.rows[0].count);
    const nonActive = await pool.query("SELECT id, title, status FROM listings WHERE status != 'active'");
    console.log('Non-active:', nonActive.rows);
  } catch (err) { console.error(err); } finally { pool.end(); }
}
checkListings();
