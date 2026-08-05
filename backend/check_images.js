require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 30000, ssl: { rejectUnauthorized: false } });

async function run() {
  const res = await pool.query("SELECT id, title, image_urls as images FROM listings");
  const listings = res.rows;
  
  const issues = listings.map(l => {
       const imgs = Array.isArray(l.images) ? l.images : [l.images]
       const unique = [...new Set(imgs.filter(Boolean))]
       return {
         id: l.id,
         title: l.title,
         total: imgs.length,
         unique: unique.length,
         hasDupes: unique.length < imgs.length,
         hasOnlyOne: unique.length === 1
       }
     }).filter(l => l.hasDupes || l.hasOnlyOne)
     console.log(JSON.stringify(issues, null, 2))
     console.log('Affected listings:', issues.length)

  pool.end();
}
run();
