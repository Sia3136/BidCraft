require('dotenv').config();
const db = require('./src/utils/db');

async function run() {
  try {
    const res = await db.query("SELECT l.id, l.title, a.id as auction_id, l.auction_ends_at FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id WHERE l.buying_method = 'Auction'");
    const noAuctionRows = res.rows.filter(x => !x.auction_id);
    console.log(`Auctions without auction rows: ${noAuctionRows.length}`);
    noAuctionRows.forEach(x => console.log(x.title));
  } catch (e) { console.error(e); } finally { process.exit(0); }
}
run();
