require('dotenv').config();
const db = require('./src/utils/db');

async function runCleanup() {
  const client = await db.pool.connect();
  let success = false;
  try {
    await client.query('BEGIN');

    // PHASE 1: Pre-Deletion Verification
    const { rows: orphans } = await client.query('SELECT id FROM listings WHERE creator_id NOT IN (SELECT id FROM users)');
    console.log('Orphaned listings found:', orphans.length);

    if (orphans.length !== 47) {
      throw new Error('Verification Failed: Expected exactly 47 orphaned listings, found ' + orphans.length);
    }

    for (const orphan of orphans) {
      const id = orphan.id;
      // bids
      const { rows: bids } = await client.query('SELECT count(*) FROM bids WHERE auction_id IN (SELECT id FROM auctions WHERE listing_id = $1)', [id]);
      if (parseInt(bids[0].count) > 0) throw new Error('Listing ' + id + ' has bids');
      
      // orders
      const { rows: orders } = await client.query('SELECT count(*) FROM orders WHERE listing_id = $1', [id]);
      if (parseInt(orders[0].count) > 0) throw new Error('Listing ' + id + ' has orders');
      
      // wishlist
      const { rows: wish } = await client.query('SELECT count(*) FROM wishlist WHERE listing_id = $1', [id]);
      if (parseInt(wish[0].count) > 0) throw new Error('Listing ' + id + ' is in wishlist');
      
      // active auctions
      const { rows: activeAuct } = await client.query("SELECT count(*) FROM auctions WHERE listing_id = $1 AND status = 'active'", [id]);
      if (parseInt(activeAuct[0].count) > 0) throw new Error('Listing ' + id + ' has an active auction');
    }
    console.log('✓ Pre-deletion verification passed.');

    // PHASE 2: Safe Deletion
    const { rowCount: deletedAuctions } = await client.query('DELETE FROM auctions WHERE listing_id IN (SELECT id FROM listings WHERE creator_id NOT IN (SELECT id FROM users))');
    console.log('Deleted auctions:', deletedAuctions);
    
    if (deletedAuctions > 8) {
      throw new Error('Safety Check Failed: Expected to delete 8 auctions, but deleted ' + deletedAuctions);
    }

    const { rowCount: deletedListings } = await client.query('DELETE FROM listings WHERE creator_id NOT IN (SELECT id FROM users)');
    console.log('Deleted listings:', deletedListings);

    if (deletedListings !== 47) {
      throw new Error('Safety Check Failed: Expected to delete 47 listings, but deleted ' + deletedListings);
    }

    // PHASE 3: Post-Deletion Integrity Audit
    const { rows: total } = await client.query('SELECT count(*) FROM listings');
    if (parseInt(total[0].count) !== 109) {
      throw new Error('Audit Failed: Total listings is not 109. Found ' + total[0].count);
    }
    console.log('✓ Total listings = 109');

    const { rows: missingCreators } = await client.query('SELECT count(*) FROM listings WHERE creator_id NOT IN (SELECT id FROM users)');
    if (parseInt(missingCreators[0].count) > 0) throw new Error('Audit Failed: Orphaned listings remain');
    console.log('✓ Every listing has a valid creator');

    const { rows: nonCloudinary } = await client.query("SELECT count(*) FROM listings WHERE NOT (image_urls::text LIKE '%cloudinary.com%')");
    if (parseInt(nonCloudinary[0].count) > 0) throw new Error('Audit Failed: Non-Cloudinary images exist');
    console.log('✓ Every listing has valid Cloudinary images');

    // PHASE 4: DB Health Check (Orphan checks across related tables)
    const { rows: brokenOrders } = await client.query('SELECT count(*) FROM orders WHERE listing_id NOT IN (SELECT id FROM listings)');
    if (parseInt(brokenOrders[0].count) > 0) throw new Error('Broken orders found');
    
    const { rows: brokenWishlist } = await client.query('SELECT count(*) FROM wishlist WHERE listing_id NOT IN (SELECT id FROM listings)');
    if (parseInt(brokenWishlist[0].count) > 0) throw new Error('Broken wishlists found');

    console.log('✓ No broken foreign keys or references');

    await client.query('COMMIT');
    success = true;
    console.log('\nSUCCESS! Database is production-ready.');

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('TRANSACTION ROLLED BACK DUE TO ERROR:', e.message);
  } finally {
    client.release();
    process.exit(success ? 0 : 1);
  }
}

runCleanup();
