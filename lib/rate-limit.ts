import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfter: number;
};

const redis = Redis.fromEnv();
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
});

export async function rateLimit(key: string): Promise<RateLimitResult> {
  const result = await limiter.limit(key);

  return {
    success: result.success,
    remaining: result.remaining,
    retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
  };
}
