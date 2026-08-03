require('dotenv').config();
const db = require('./src/utils/db');

async function fixAuctions() {
  let client;
  try {
    client = await db.pool.connect();
    console.log('Connected to DB. Running auction fixes...');

    // 1. Insert the 3 missing auctions into the auctions table
    const missingAuctions = await client.query(`
      SELECT l.id, l.price, l.created_at, l.seller_id
      FROM listings l
      LEFT JOIN auctions a ON a.listing_id = l.id
      WHERE l.buying_method = 'Auction' AND a.id IS NULL
    `);
    
    if (missingAuctions.rows.length > 0) {
      console.log(`Found ${missingAuctions.rows.length} missing auctions. Inserting...`);
      for (const row of missingAuctions.rows) {
        await client.query(`
          INSERT INTO auctions (listing_id, seller_id, status, start_time, end_time, start_bid, created_at, updated_at)
          VALUES ($1, $2, 'active', NOW(), NOW() + interval '7 days', $3, $4, NOW())
        `, [row.id, row.seller_id, row.price, row.created_at]);
        console.log(`Inserted auction for listing ${row.id}`);
      }
    } else {
      console.log('No missing auctions found.');
    }

    // 2. Distribute all 28 auctions organically across hours, days, weeks
    console.log('Scattering auction countdowns...');
    
    // We want highly varied times: e.g. 5 hours, 18 hours, 1 day 7 hours, 2 days, 5 days, 9 days, 15 days, 22 days, 31 days.
    // Let's create an array of specific hour offsets and assign them randomly.
    const hourOffsets = [
      5, 12, 18, 
      31, 40, 48, 55, 
      82, 105, 120, 140, 
      180, 216, 250, 300, 360,
      400, 450, 500, 528, 600,
      700, 744, 800, 900,
      1000, 1200, 1500
    ];

    // Shuffle the offsets
    for (let i = hourOffsets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hourOffsets[i], hourOffsets[j]] = [hourOffsets[j], hourOffsets[i]];
    }

    const allAuctions = await client.query(`SELECT id FROM listings WHERE buying_method = 'Auction'`);
    
    let index = 0;
    for (const row of allAuctions.rows) {
      const baseHours = hourOffsets[index % hourOffsets.length];
      const randomMinutes = Math.floor(Math.random() * 60);
      const randomSeconds = Math.floor(Math.random() * 60);
      
      const intervalStr = `${baseHours} hours ${randomMinutes} minutes ${randomSeconds} seconds`;
      
      await client.query(`
        UPDATE listings
        SET auction_ends_at = NOW() + interval '${intervalStr}'
        WHERE id = $1
      `, [row.id]);
      
      await client.query(`
        UPDATE auctions
        SET end_time = NOW() + interval '${intervalStr}'
        WHERE listing_id = $1
      `, [row.id]);
      
      index++;
    }

    console.log(`Successfully scattered ${allAuctions.rows.length} auctions.`);
  } catch (err) {
    console.error('Error fixing auctions:', err);
  } finally {
    if (client) client.release();
    process.exit(0);
  }
}

fixAuctions();
