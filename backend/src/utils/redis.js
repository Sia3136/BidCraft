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
  const store = new Map();
  redisClient = {
    get: async (k) => store.get(k) || null,
    set: async (k, v) => { store.set(k, v); return 'OK'; },
    del: async (k) => { store.delete(k); return 1; },
    keys: async () => Array.from(store.keys()),
    incr: async (k) => {
      const val = (store.get(k) || 0) + 1;
      store.set(k, val);
      return val;
    },
    expire: async (k, s) => {
      setTimeout(() => store.delete(k), s * 1000);
      return 1;
    }
  };
}

module.exports = redisClient;
