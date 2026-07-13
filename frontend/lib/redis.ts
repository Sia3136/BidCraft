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

const ENV_PREFIX = process.env.NODE_ENV || 'development';

export async function cacheGet(key: string) {
  if (!redis) return null;
  return redis.get(`${ENV_PREFIX}:${key}`);
}

export async function cacheSet(key: string, value: unknown, ttl: number) {
  if (!redis) return;
  await redis.set(`${ENV_PREFIX}:${key}`, JSON.stringify(value), { ex: ttl });
}

export async function cacheDel(key: string) {
  if (!redis) return;
  await redis.del(`${ENV_PREFIX}:${key}`);
}
