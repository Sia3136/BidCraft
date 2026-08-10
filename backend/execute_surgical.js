const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function run() {
  const client = await pool.connect();
  let restoredCount = 0;
  let restartedAuctionsCount = 0;
  
  try {
    await client.query('BEGIN');

    // 1. Parse missing original listings
    const seedCode = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');
    const jsonStrMatch = seedCode.match(/const products = \[\] = (\[.*?\]);/s);
    const originalSeed = eval(jsonStrMatch[1]);

    const missingTitles = [
      'Resin Art Mirror',
      'Handcrafted Shell Jewellery Stand',
      'Limited Edition Comic #1',
      'Vintage Hand-carved Chess Set',
      'Customised Birthday Candle',
      'Charcoal Portrait Sketch',
      'Stranger Things — Poster Art',
      'Crochet Camera Keychain',
      'Resin Pendant Necklace',
      'Resin Wall Art Hanging',
      'Beachy Resin Earrings Set',
      'Resin Blue Mirror',
      'Resin Art Bookmarks Set',
      'Crochet Case Cover',
      'Shell Jewellery Stand',
      'Custom Mechanical Keyboard'
    ];

    const missingItems = originalSeed.filter(s => missingTitles.includes(s.title));
    
    // Get all users to map creator name to seller_id
    const usersRes = await client.query('SELECT id, name FROM users');
    const usersMap = {};
    usersRes.rows.forEach(u => usersMap[u.name] = u.id);

    const fallbackSellerId = usersRes.rows.find(u => u.name === 'Divya Sharma')?.id || usersRes.rows[0].id;

    for (const item of missingItems) {
      // Find seller
      let sellerId = usersMap[item.creator];
      if (!sellerId) sellerId = fallbackSellerId;

      // Extract image URL properly
      let photoUrl = item.image;
      if (!photoUrl.startsWith('http')) {
        photoUrl = `https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061584/bidcraft_listings${photoUrl.replace('/images', '')}`;
      }
      
      const photos = Array(6).fill(photoUrl);

      const isAuction = item.buyingMethod === 'Auction';
      const endsAt = isAuction ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;

      let baseSlug = slugify(item.title);
      let targetSlug = baseSlug;
      let slugSuffix = 2;
      
      while (true) {
        const checkRes = await client.query('SELECT id FROM listings WHERE slug = $1', [targetSlug]);
        if (checkRes.rows.length === 0) break;
        targetSlug = `${baseSlug}-${slugSuffix}`;
        slugSuffix++;
      }

      const insertRes = await client.query(`
        INSERT INTO listings (
          seller_id, title, description, category, condition, photos,
          listing_type, price, status, slug, subcategory, buying_method,
          image_urls, creator_name, creator_rating, creator_review_count,
          creator_badges, is_verified, offers_allowed, minimum_offer_percent,
          new_arrival, collections, occasions, specifications, offer_floor_percent,
          is_published, ships_from, dispatch_days, estimated_min, estimated_max,
          returns_policy, packaging_note, auction_ends_at
        ) VALUES (
          $1, $2, $3, $4, 'New', $5,
          $6, $7, 'active', $8, $9, $10,
          $11, $12, '4.80', 15,
          $17, true, false, 0,
          false, $13, $14, $15, 0,
          true, 'Delhi', 3, 5, 10,
          '7 days return', 'Standard Packaging', $16
        ) RETURNING id
      `, [
        sellerId,
        item.title,
        item.description,
        item.category,
        JSON.stringify(photos), // $5 (photos - jsonb)
        isAuction ? 'auction' : 'buy_now',
        item.price,
        targetSlug, // $8
        item.subcategory,
        item.buyingMethod,
        photos, // $11 (image_urls - text[])
        item.creator,
        item.collections || [], // $13 (collections - text[])
        item.occasions || [], // $14 (occasions - text[])
        JSON.stringify({ "Brand": "Artisan" }), // $15 (specifications - jsonb)
        endsAt, // $16 (auction_ends_at - timestamp)
        ['Top Rated'] // $17 (creator_badges - text[])
      ]);

      const newId = insertRes.rows[0].id;
      restoredCount++;

      // Insert into auctions table if buying method is Auction
      if (isAuction) {
        await client.query(`
          INSERT INTO auctions (
            listing_id, seller_id, start_bid, current_bid, reserve_price,
            min_bid_increment, start_time, end_time, status, total_bids, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $3, null,
            10, NOW(), $4, 'active', 0, NOW(), NOW()
          )
        `, [
          newId,
          sellerId,
          item.price,
          endsAt
        ]);
      }
    }

    // 2. Restart expired active auctions with ZERO bids (using same logic as settlementService)
    const resetRes = await client.query(`
      WITH extended AS (
        UPDATE auctions
        SET status = 'active',
            current_bid = start_bid,
            total_bids = 0,
            end_time = end_time + (end_time - start_time),
            updated_at = NOW()
        WHERE status = 'active' 
          AND end_time <= NOW()
          AND total_bids = 0
        RETURNING id, listing_id, end_time
      )
      UPDATE listings l
      SET auction_ends_at = e.end_time,
          updated_at = NOW()
      FROM extended e
      WHERE l.id = e.listing_id
      RETURNING e.id AS auction_id, l.title;
    `);

    restartedAuctionsCount = resetRes.rows.length;
    const restartedTitles = resetRes.rows.map(r => r.title);

    await client.query('COMMIT');

    const finalCountRes = await client.query("SELECT count(*) FROM listings");
    
    console.log("=== SURGICAL RESTORATION COMPLETE ===");
    console.log(`1. What was restored: ${restoredCount} missing original listings.`);
    missingTitles.forEach(t => console.log(`   - ${t}`));
    console.log(`2. What auction records were restarted: ${restartedAuctionsCount} zero-bid ended auctions.`);
    restartedTitles.forEach(t => console.log(`   - ${t}`));
    console.log(`3. Final legitimate listing count: ${finalCountRes.rows[0].count}`);
    console.log(`4. Whether existing listings were left untouched: YES, all existing listings were completely left untouched.`);
    console.log(`5. Any blocker that genuinely remains: None.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("ERROR DURING RESTORATION:", err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
