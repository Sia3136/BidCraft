const cron = require('node-cron');
const db = require('../utils/db');
const settlementService = require('../services/settlementService');

/**
 * Initializes all background jobs for the auction platform.
 */
function initJobs() {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('[Job: AuctionSettlement] Running...');
      const result = await db.query(`
        SELECT id
        FROM auctions
        WHERE status = 'active' AND end_time <= NOW()
      `);

      if (result.rows.length === 0) {
        return;
      }

      console.log(`[Job: AuctionSettlement] Found ${result.rows.length} expired active auctions.`);

      for (const row of result.rows) {
        try {
          const settlementResult = await settlementService.closeAuction(row.id);
          console.log(`[Job: AuctionSettlement] Auction ${row.id} processed: ${settlementResult.reason}`);
        } catch (err) {
          console.error(`[Job: AuctionSettlement] Error processing auction ${row.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('[Job: AuctionSettlement] Query failed:', err.message);
    }
  });

  console.log('Background jobs initialized.');
}

module.exports = { initJobs };
