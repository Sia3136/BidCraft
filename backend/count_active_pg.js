require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 30000, ssl: { rejectUnauthorized: false } });

async function run() {
  const res = await pool.query("SELECT COUNT(*) FROM listings WHERE status = 'active'");
  console.log('ACTIVE LISTINGS:', res.rows[0].count);
  pool.end();
}
run();
