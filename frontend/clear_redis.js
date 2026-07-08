const Redis = require('ioredis');

async function clearCache() {
  try {
    const redis = new Redis(process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379');
    
    // Check explore keys
    const exploreKeys = await redis.keys('explore:*');
    if (exploreKeys.length > 0) {
      await redis.del(...exploreKeys);
      console.log('Cleared explore keys:', exploreKeys.length);
    }
    
    // Check home keys
    const homeKeys = await redis.keys('home:*');
    if (homeKeys.length > 0) {
      await redis.del(...homeKeys);
      console.log('Cleared home keys:', homeKeys.length);
    }
    
    console.log('Redis cache cleared successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing redis cache:', err.message);
    process.exit(1);
  }
}

clearCache();
