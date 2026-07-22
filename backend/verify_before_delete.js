require('dotenv').config();
const db = require('./src/utils/db');

async function verify() {
  try {
    const { rows: candidates } = await db.pool.query("SELECT id, seller_id, title FROM listings WHERE NOT (image_urls::text LIKE '%cloudinary.com%')");
    
    let failedChecks = 0;
    
    for (const listing of candidates) {
      const { rows: users } = await db.pool.query("SELECT id FROM users WHERE id = $1", [listing.seller_id]);
      
      if (users.length > 0) {
        console.log(`STOP! Listing ${listing.id} ("${listing.title.substring(0, 20)}...") has a valid matching user (seller_id: ${listing.seller_id}).`);
        failedChecks++;
      }
      
      // Also check if any orders exist for this listing
      const { rows: orders } = await db.pool.query("SELECT count(*) FROM orders WHERE listing_id = $1", [listing.id]);
      if (parseInt(orders[0].count) > 0) {
        console.log(`STOP! Listing ${listing.id} has orders.`);
        failedChecks++;
      }
    }
    
    console.log(`Total listings failing the "orphan" check: ${failedChecks}`);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
verify();
