const { Redis } = require('@upstash/redis');

let redisClient = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = Redis.fromEnv();
    console.log('Upstash Redis initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Upstash Redis:', error.message);
  }
} else {
  console.log('Upstash Redis variables missing, falling back to mock client.');
}

if (!redisClient) {
  redisClient = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
    keys: async () => []
  };
}

module.exports = redisClient;
