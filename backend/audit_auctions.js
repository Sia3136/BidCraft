require('dotenv').config();
const db = require('./src/utils/db');
const fs = require('fs');
const path = require('path');

async function runAudit() {
  const client = await db.pool.connect();
  try {
    // 1. Fetch all auctions that are NOT active
    // We are looking for auctions that are ended, closed, etc.
    const query = `
      SELECT 
        a.id as auction_id,
        l.id as listing_id,
        l.title,
        a.status as auction_status,
        l.status as listing_status,
        a.start_time,
        a.end_time,
        a.reserve_price,
        a.seller_id,
        (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as bid_count,
        (SELECT MAX(bid_amount) FROM bids b WHERE b.auction_id = a.id) as highest_bid,
        (SELECT id FROM orders o WHERE o.auction_id = a.id LIMIT 1) as order_id,
        a.created_at
      FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      WHERE a.status != 'active'
    `;
    const res = await client.query(query);
    const auctions = res.rows;

    // 2. Generate backup
    const backupPath = path.join(__dirname, 'auction_backup_2026-08-06.json');
    fs.writeFileSync(backupPath, JSON.stringify(auctions, null, 2));
    console.log(`[Backup] Wrote ${auctions.length} records to ${backupPath}`);

    // 3. Generate Audit Report
    let report = `# AUCTION_AUDIT\n\n`;
    report += `Generated on: ${new Date().toISOString()}\n\n`;
    report += `## Affected Auctions Found: ${auctions.length}\n\n`;

    let restoreCount = 0;
    
    auctions.forEach(a => {
      const highestBidNum = a.highest_bid ? Number(a.highest_bid) : 0;
      const reserveNum = a.reserve_price ? Number(a.reserve_price) : 0;
      
      const hasWinner = a.order_id !== null;
      const bidCount = parseInt(a.bid_count, 10);
      const isExpired = new Date(a.end_time) <= new Date();

      let decision = 'SKIP';
      let reason = '';

      if (hasWinner) {
        reason = 'Order exists (winner or escrow active). Do NOT restart.';
      } else if (!isExpired) {
        reason = 'Auction has not expired yet.';
      } else if (bidCount > 0 && highestBidNum >= reserveNum) {
        reason = 'Auction has valid winning bids but no order yet (needs settlement).';
      } else if (a.auction_status === 'cancelled') {
        reason = 'Auction was cancelled manually.';
      } else {
        decision = 'RESTORE';
        reason = 'Auction expired without winning bids. Needs restart.';
        restoreCount++;
      }

      report += `### Auction ID: ${a.auction_id}\n`;
      report += `- **Listing Title**: ${a.title} (Listing ID: ${a.listing_id})\n`;
      report += `- **Current Status**: Auction = ${a.auction_status}, Listing = ${a.listing_status}\n`;
      report += `- **End Time**: ${a.end_time}\n`;
      report += `- **Bid Count**: ${bidCount}\n`;
      report += `- **Winner/Order ID**: ${a.order_id || 'None'}\n`;
      report += `- **Reserve Status**: Highest Bid = ${highestBidNum}, Reserve = ${reserveNum}\n`;
      report += `- **Created At**: ${a.created_at}\n`;
      report += `- **AUDIT DECISION**: **${decision}** - ${reason}\n\n`;
    });

    report += `## Summary\n`;
    report += `- Total Affected Auctions: ${auctions.length}\n`;
    report += `- Eligible for Restoration: ${restoreCount}\n`;

    // Path for artifact
    const artifactPath = "C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\60a377b6-7509-4834-81e9-bc18ffba4063\\AUCTION_AUDIT.md";
    fs.writeFileSync(artifactPath, report);
    console.log(`[Audit] Wrote audit report to ${artifactPath}`);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

runAudit();
