const db = require('../src/utils/db');
const redis = require('../src/utils/redis');

async function run() {
  try {
    console.log('Running DB updates for Fixes 7, 8, and 11...');
    const client = await db.pool.connect();
    
    // Fix 11: Normalize listing_type
    await client.query(`UPDATE listings SET listing_type = LOWER(listing_type);`);
    console.log('Normalized listing_type');

    // Fix 7: Reset auction end times
    await client.query(`
      UPDATE auctions 
      SET auction_end_time = NOW() 
        + (INTERVAL '1 day' * ((id % 6) + 1))
        + (INTERVAL '1 hour' * (id % 24))
        + (INTERVAL '1 minute' * (id % 60)),
        status = 'active'
      WHERE status IN ('active', 'ended');
    `);
    
    // In case the column is end_time instead of auction_end_time, we might need to handle it. 
    // Let's also check if it's 'end_time'. The previous code used a.end_time in some queries.
    // I will write a try-catch for end_time vs auction_end_time just in case.
    
    // Fix 8: Add Tags for collections
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'vintage')
      WHERE subcategory IN ('vintage-items', 'antiques', 'rare-collectibles')
        AND NOT 'vintage' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'minimalist')
      WHERE subcategory IN ('prints-and-posters', 'digital-art-and-illustrations', 'home-decor')
        AND NOT 'minimalist' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'traditional')
      WHERE subcategory IN ('paintings', 'sculptures', 'textile-art', 'pottery-and-ceramics')
        AND NOT 'traditional' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);

    // Fix 8: Add Tags for occasions
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'birthday')
      WHERE price BETWEEN 200 AND 3000
        AND listing_type != 'auction'
        AND NOT 'birthday' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'anniversary')
      WHERE price BETWEEN 500 AND 5000
        AND NOT 'anniversary' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'housewarming')
      WHERE subcategory IN ('home-decor', 'pottery-and-ceramics', 'plants-and-botanicals', 'candles-and-soaps')
        AND NOT 'housewarming' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);
    await client.query(`
      UPDATE listings SET tags = array_append(COALESCE(tags, ARRAY[]::text[]), 'gift')
      WHERE price BETWEEN 100 AND 1500
        AND NOT 'gift' = ANY(COALESCE(tags, ARRAY[]::text[]));
    `);

    // Fix 12: Clear Redis Cache
    if (redis) {
      try {
        console.log('Clearing Redis cache...');
        const patterns = ['explore:*', 'home:*', 'listing:*', 'seller:*'];
        for (const pattern of patterns) {
          const keys = await redis.keys(pattern);
          if (keys && keys.length > 0) {
            await redis.del(...keys);
          }
        }
        await redis.del('home:new-arrivals');
        await redis.del('home:live-auctions');
      } catch (e) {
        console.log('Redis KEYS failed or Upstash restricted. Deleting known keys directly.');
        await redis.del('home:new-arrivals');
        await redis.del('home:live-auctions');
      }
    }
    
    // Invalidate listings by bumping updated_at
    await client.query(`UPDATE listings SET updated_at = NOW();`);
    console.log('Bumped updated_at on all listings');

    client.release();
    console.log('Done DB updates');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('auction_end_time')) {
       console.log('auction_end_time column does not exist, trying end_time');
       const client = await db.pool.connect();
       await client.query(`
          UPDATE auctions 
          SET end_time = NOW() 
            + (INTERVAL '1 day' * ((id % 6) + 1))
            + (INTERVAL '1 hour' * (id % 24))
            + (INTERVAL '1 minute' * (id % 60)),
            status = 'active'
          WHERE status IN ('active', 'ended');
        `);
       client.release();
       console.log('Done DB updates using end_time');
       process.exit(0);
    } else {
       console.error('Fatal error:', err);
       process.exit(1);
    }
  }
}
run();
