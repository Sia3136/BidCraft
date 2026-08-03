require('dotenv').config();
const db = require('./src/utils/db');

async function extendAuctions() {
  let client;
  try {
    client = await db.pool.connect();
    console.log('Connected to DB. Extending expired auctions...');

    // We stagger the dates to simulate a living marketplace
    const res = await client.query(`
      WITH numbered_auctions AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
        FROM listings
        WHERE buying_method = 'Auction'
      )
      UPDATE listings
      SET auction_ends_at = NOW() + (interval '1 day' * (10 + (rn % 50)))
      FROM numbered_auctions
      WHERE listings.id = numbered_auctions.id
      RETURNING listings.id, listings.auction_ends_at;
    `);

    console.log(`Successfully extended ${res.rowCount} auctions.`);
  } catch (err) {
    console.error('Error extending auctions:', err);
  } finally {
    if (client) client.release();
    process.exit(0);
  }
}

extendAuctions();
