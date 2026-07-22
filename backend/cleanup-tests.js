const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  await pool.query(`DELETE FROM bids WHERE bidder_id IN (SELECT id FROM users WHERE email LIKE 'bidtest%')`);
  await pool.query(`DELETE FROM bid_deposits WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'bidtest%')`);
  await pool.query(`DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'bidtest%')`);
  await pool.query(`DELETE FROM users WHERE email LIKE 'bidtest%'`);
  pool.end();
}
run();
