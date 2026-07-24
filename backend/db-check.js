const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 30000 });

async function run() {
  try {
    const schemaRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'listings'
    `);
    console.log('--- Schema ---');
    schemaRes.rows.forEach(r => console.log(r.column_name, r.data_type));
    
    const dataRes = await pool.query(`
      SELECT id, title, collections, occasions 
      FROM listings 
      LIMIT 10
    `);
    console.log('\n--- Sample Data ---');
    console.log(JSON.stringify(dataRes.rows, null, 2));

    const nullCheck = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN collections IS NULL OR collections = '{}' THEN 1 ELSE 0 END) as empty_collections,
        SUM(CASE WHEN occasions IS NULL OR occasions = '{}' THEN 1 ELSE 0 END) as empty_occasions,
        SUM(CASE WHEN collections IS NOT NULL AND collections != '{}' THEN 1 ELSE 0 END) as valid_collections,
        SUM(CASE WHEN occasions IS NOT NULL AND occasions != '{}' THEN 1 ELSE 0 END) as valid_occasions
      FROM listings
    `);
    console.log('\n--- Collections / Occasions Stats ---');
    console.log(nullCheck.rows[0]);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
