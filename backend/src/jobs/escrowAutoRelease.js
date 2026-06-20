const cron = require('node-cron');
const escrowService = require('../services/escrowService');

function initEscrowJobs() {
  // Run every hour at the top of the hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[Job: EscrowAutoRelease] Running auto-release check...');
      await escrowService.autoReleaseEscrow();
    } catch (err) {
      console.error('[Job: EscrowAutoRelease] Error:', err.message);
    }
  });

  console.log('Escrow auto-release job initialized.');
}

module.exports = { initEscrowJobs };
