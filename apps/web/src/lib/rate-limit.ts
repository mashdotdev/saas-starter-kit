import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "@saas-kit/ai",
    });
  }
  return ratelimit;
}

export async function checkRateLimit(
  userId: string,
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRatelimit();

  // Graceful degradation in dev when Upstash is not configured
  if (!limiter) {
    return { success: true, remaining: 10 };
  }

  const { success, remaining } = await limiter.limit(userId);
  return { success, remaining };
}
