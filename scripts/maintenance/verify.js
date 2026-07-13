require('dotenv').config({ path: 'C:/Bidcraft/backend/.env' });
const db = require('C:/Bidcraft/backend/src/utils/db');

async function run() {
  const count = await db.query('SELECT COUNT(*) FROM listings;');
  const category = await db.query('SELECT category, COUNT(*) FROM listings GROUP BY category;');
  const buyingMethod = await db.query('SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method;');
  const auctionCount = await db.query("SELECT COUNT(*) FROM listings WHERE buying_method = 'Auction' AND auction_ends_at IS NOT NULL;");
  const emptyImages = await db.query('SELECT COUNT(*) FROM listings WHERE image_urls IS NULL OR array_length(image_urls, 1) = 0;');

  console.log('Count:', count.rows);
  console.log('Category:', category.rows);
  console.log('Buying method:', buyingMethod.rows);
  console.log('Auction count:', auctionCount.rows);
  console.log('Empty images:', emptyImages.rows);
  process.exit(0);
}
run();
