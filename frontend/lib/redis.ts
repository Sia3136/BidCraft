import { Redis } from '@upstash/redis';

const restUrl = process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const globalForRedis = global as unknown as { redis: any };

export let redis: any;

if (restUrl && restToken) {
  redis =
    globalForRedis.redis ||
    new Redis({
      url: restUrl,
      token: restToken,
    });

  if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
} else {
  if (typeof window === 'undefined') {
    console.log('Upstash Redis variables missing. Falling back to mock Redis client.');
  }
  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
    keys: async () => [],
    on: () => {},
  };
}



