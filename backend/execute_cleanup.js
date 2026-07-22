require('dotenv').config();
const db = require('./src/utils/db');

async function executeCleanup() {
  const client = await db.pool.connect();
  let success = false;
  
  try {
    await client.query('BEGIN');
    
    // 1. Identify the 47 target listings
    const { rows: targets } = await client.query("SELECT id FROM listings WHERE NOT (image_urls::text LIKE '%cloudinary.com%') OR image_urls IS NULL");
    
    if (targets.length !== 47) {
      throw new Error(`Expected exactly 47 target listings, but found ${targets.length}`);
    }
    
    const targetIds = targets.map(t => t.id);
    
    // 2. Dependency checks
    const { rows: bidCheck } = await client.query("SELECT count(*) FROM bids WHERE auction_id IN (SELECT id FROM auctions WHERE listing_id = ANY($1))", [targetIds]);
    if (parseInt(bidCheck[0].count) > 0) throw new Error("Found bids on target listings");
    
    const { rows: orderCheck } = await client.query("SELECT count(*) FROM orders WHERE listing_id = ANY($1)", [targetIds]);
    if (parseInt(orderCheck[0].count) > 0) throw new Error("Found orders on target listings");
    
    const { rows: wishCheck } = await client.query("SELECT count(*) FROM wishlist WHERE listing_id = ANY($1)", [targetIds]);
    if (parseInt(wishCheck[0].count) > 0) throw new Error("Found wishlist entries on target listings");
    
    const { rows: activeAuctCheck } = await client.query("SELECT count(*) FROM auctions WHERE listing_id = ANY($1) AND status = 'active'", [targetIds]);
    if (parseInt(activeAuctCheck[0].count) > 0) throw new Error("Found active auctions on target listings");
    
    let offerCheckCount = 0;
    try {
      const { rows: offerCheck } = await client.query("SELECT count(*) FROM offers WHERE listing_id = ANY($1)", [targetIds]);
      offerCheckCount = parseInt(offerCheck[0].count);
    } catch (e) { /* table might not exist */ }
    if (offerCheckCount > 0) throw new Error("Found offers on target listings");
    
    // 3. Perform Deletions
    console.log("Checks passed. Deleting dependent auctions...");
    const { rowCount: deletedAuctions } = await client.query("DELETE FROM auctions WHERE listing_id = ANY($1)", [targetIds]);
    console.log(`Deleted ${deletedAuctions} inactive auctions.`);
    
    console.log("Deleting 47 target listings...");
    const { rowCount: deletedListings } = await client.query("DELETE FROM listings WHERE id = ANY($1)", [targetIds]);
    console.log(`Deleted ${deletedListings} listings.`);
    
    if (deletedListings !== 47) {
      throw new Error(`Deleted ${deletedListings} instead of 47 listings`);
    }
    
    // 4. Post-Deletion Audits
    const { rows: totalRows } = await client.query("SELECT count(*) FROM listings");
    const remainingCount = parseInt(totalRows[0].count);
    if (remainingCount !== 109) throw new Error(`Remaining listings is ${remainingCount}, expected 109`);
    
    const { rows: orphanListings } = await client.query("SELECT count(*) FROM listings WHERE seller_id NOT IN (SELECT id FROM users)");
    if (parseInt(orphanListings[0].count) > 0) throw new Error("Orphaned listings with missing sellers remain");
    
    const { rows: nonCloudinary } = await client.query("SELECT count(*) FROM listings WHERE NOT (image_urls::text LIKE '%cloudinary.com%') OR image_urls IS NULL");
    if (parseInt(nonCloudinary[0].count) > 0) throw new Error("Listings without Cloudinary URLs remain");
    
    const { rows: orphanAuctions } = await client.query("SELECT count(*) FROM auctions WHERE listing_id NOT IN (SELECT id FROM listings)");
    if (parseInt(orphanAuctions[0].count) > 0) throw new Error("Orphaned auctions remain");
    
    const { rows: orphanBids } = await client.query("SELECT count(*) FROM bids WHERE auction_id NOT IN (SELECT id FROM auctions)");
    if (parseInt(orphanBids[0].count) > 0) throw new Error("Orphaned bids remain");
    
    // Unique check
    const { rows: allIds } = await client.query("SELECT id FROM listings");
    const uniqueIds = new Set(allIds.map(r => r.id));
    if (uniqueIds.size !== 109) throw new Error("Duplicate listings detected");
    
    console.log("All post-deletion checks passed. Committing transaction.");
    await client.query('COMMIT');
    success = true;
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("TRANSACTION ROLLED BACK DUE TO ERROR:", err.message);
  } finally {
    client.release();
    process.exit(success ? 0 : 1);
  }
}

executeCleanup();
