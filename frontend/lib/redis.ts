import { Redis } from '@upstash/redis';

const isRedisConfigured = 
  !!process.env.UPSTASH_REDIS_REST_URL && 
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

if (!isRedisConfigured && process.env.NODE_ENV === 'production') {
  throw new Error(
    'Missing Upstash Redis env vars. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local\n' +
    'Get them from: https://console.upstash.com → Create Database → REST API tab'
  );
}

export const redis = isRedisConfigured
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! })
  : null;

// Usage wrapper — always use this instead of redis directly:
export async function cacheGet(key: string) {
  if (!redis) return null;
  return redis.get(key);
}

export async function cacheSet(key: string, value: unknown, ttl: number) {
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), { ex: ttl });
}
