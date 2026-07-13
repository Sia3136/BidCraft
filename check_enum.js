const { Pool } = require('pg');
require('dotenv').config({ path: 'frontend/.env.local' });
require('dotenv').config({ path: 'frontend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function check() {
  try {
    const res = await pool.query('SELECT status, COUNT(*) FROM disputes GROUP BY status;');
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

check();
