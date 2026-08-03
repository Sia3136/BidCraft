require('dotenv').config();
const db = require('./src/utils/db');

async function extendAuctions() {
  let client;
  try {
    client = await db.pool.connect();
    console.log('Connected to DB. Distributing auction end times naturally...');

    // We scatter the dates organically spanning up to 3 weeks (21 days = 30240 minutes)
    // No two will end on the same minute.
    const res = await client.query(`
      WITH numbered_auctions AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
        FROM listings
        WHERE buying_method = 'Auction'
      )
      UPDATE listings
      SET auction_ends_at = NOW() + (interval '1 minute' * floor(random() * 30000 + 60))
      FROM numbered_auctions
      WHERE listings.id = numbered_auctions.id
      RETURNING listings.id, listings.auction_ends_at;
    `);

    console.log(`Successfully scattered ${res.rowCount} auctions across hours, days, and weeks.`);
  } catch (err) {
    console.error('Error extending auctions:', err);
  } finally {
    if (client) client.release();
    process.exit(0);
  }
}

extendAuctions();
