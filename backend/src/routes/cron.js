const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const settlementService = require('../services/settlementService');

router.post('/end-auctions', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const result = await db.query(`
      SELECT id
      FROM auctions
      WHERE status = 'active' AND end_time <= NOW()
    `);

    if (result.rows.length === 0) {
      return res.json({ success: true, processed: 0 });
    }

    const settledAuctions = [];
    for (const row of result.rows) {
      try {
        const settlementResult = await settlementService.closeAuction(row.id);
        settledAuctions.push({ id: row.id, status: settlementResult.reason });
      } catch (err) {
        console.error(`Error processing auction ${row.id}:`, err.message);
        settledAuctions.push({ id: row.id, status: 'error', error: err.message });
      }
    }

    res.json({ success: true, processed: result.rows.length, results: settledAuctions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
