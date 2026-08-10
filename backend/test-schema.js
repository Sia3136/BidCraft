const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_kwi2pm0tZdJX@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
async function run() {
  const c = await pool.connect();
  const res = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'escrow';");
  console.log('Escrow Schema:'); console.table(res.rows);
  const res2 = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';");
  console.log('Orders Schema:'); console.table(res2.rows);
  c.release(); pool.end();
}
run();
