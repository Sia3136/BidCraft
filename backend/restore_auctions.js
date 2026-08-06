require('dotenv').config();
const db = require('./src/utils/db');

async function restoreAuctions() {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Fetch eligible auctions
    const query = `
      SELECT 
        a.id,
        a.start_time,
        a.end_time,
        a.start_bid
      FROM auctions a
      WHERE a.status = 'closed'
        AND a.end_time <= NOW()
        AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.auction_id = a.id)
    `;
    const res = await client.query(query);
    const auctions = res.rows;
    
    console.log(`Found ${auctions.length} auctions to restore.`);
    
    // 2. Restore each auction
    let restoredCount = 0;
    for (const a of auctions) {
      const durationMs = new Date(a.end_time).getTime() - new Date(a.start_time).getTime();
      const newEndTime = new Date(Date.now() + durationMs);
      
      const updateQuery = `
        UPDATE auctions 
        SET 
          status = 'active',
          current_bid = start_bid,
          total_bids = 0,
          end_time = $1,
          updated_at = NOW()
        WHERE id = $2
      `;
      await client.query(updateQuery, [newEndTime, a.id]);
      restoredCount++;
      console.log(`Restored Auction ID ${a.id}: new end_time = ${newEndTime.toISOString()}`);
    }
    
    await client.query('COMMIT');
    console.log(`Successfully restored ${restoredCount} auctions.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during restoration:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

restoreAuctions();
