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
      console.error("FULL ERROR");
      console.error(err);
      console.error(err?.stack);
      console.error(err?.cause);
      console.error(require("util").inspect(err, { depth: 10 }));
      if (err && err.errors && Array.isArray(err.errors)) {
        console.error("AggregateError nested errors:");
        err.errors.forEach((e, i) => console.error(`[${i}]`, e, e?.stack));
      }
      if (err && err.code) {
        console.error("PG/Prisma Code:", err.code);
        console.error("PG Severity:", err.severity);
        console.error("PG Detail:", err.detail);
        console.error("PG Hint:", err.hint);
        console.error("PG Position:", err.position);
        console.error("PG Schema:", err.schema);
        console.error("PG Table:", err.table);
        console.error("PG Constraint:", err.constraint);
        console.error("PG Routine:", err.routine);
      }
      if (err && err.clientVersion) {
        console.error("Prisma Meta:", err.meta);
        console.error("Prisma clientVersion:", err.clientVersion);
      }
    }
  });

  console.log('Background jobs initialized.');
}

module.exports = { initJobs };
