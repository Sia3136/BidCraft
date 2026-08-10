require('dotenv').config();
const db = require('./src/utils/db');

async function testSlugs() {
  try {
    const res = await db.query(`
      SELECT slug, COUNT(*) 
      FROM listings 
      GROUP BY slug 
      HAVING COUNT(*) > 1
    `);
    console.log('Duplicate slugs:');
    res.rows.forEach(r => console.log(`${r.slug} | count: ${r.count}`));
    
    // Also print which listings have these slugs
    for (const r of res.rows) {
        if (r.slug) {
            const listings = await db.query(`SELECT id, title, slug FROM listings WHERE slug = $1`, [r.slug]);
            console.log(`Listings for slug '${r.slug}':`, listings.rows);
        }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testSlugs();
