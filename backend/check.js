require('dotenv').config();
const db = require('./src/utils/db');
async function run() {
  try {
    const { rows } = await db.pool.query("SELECT count(*) FROM listings WHERE seller_id NOT IN (SELECT id FROM users)");
    console.log("Listings with invalid seller_id:", rows[0].count);
    
    const { rows: r2 } = await db.pool.query("SELECT id, seller_id FROM listings WHERE NOT (image_urls::text LIKE '%cloudinary.com%')");
    console.log("Non-cloudinary listings count:", r2.length);
    if (r2.length > 0) {
      console.log("Sample non-cloudinary seller_id:", r2[0].seller_id);
      const { rows: r3 } = await db.pool.query("SELECT id FROM users WHERE id = $1", [r2[0].seller_id]);
      console.log("Does sample seller exist in users?", r3.length > 0);
    }
  } finally {
    process.exit(0);
  }
}
run();
