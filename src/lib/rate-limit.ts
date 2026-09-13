/**
 * Simple in-memory rate limiter using token bucket algorithm.
 * Note: Resets on server restart. For production, use Redis.
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.lastRefill > 10 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Maximum number of tokens (requests) */
  maxTokens: number;
  /** Refill interval in milliseconds */
  refillIntervalMs: number;
  /** Tokens added per refill interval */
  refillAmount: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxTokens: 10,
  refillIntervalMs: 60_000, // 1 minute
  refillAmount: 10,
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const { maxTokens, refillIntervalMs, refillAmount } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { tokens: maxTokens, lastRefill: now };
    store.set(key, entry);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  if (elapsed >= refillIntervalMs) {
    const refills = Math.floor(elapsed / refillIntervalMs);
    entry.tokens = Math.min(maxTokens, entry.tokens + refills * refillAmount);
    entry.lastRefill = now;
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    return { allowed: true, remaining: entry.tokens };
  }

  const retryAfterMs = refillIntervalMs - (now - entry.lastRefill);
  return { allowed: false, remaining: 0, retryAfterMs };
}

/**
 * Extract client identifier from request headers.
 * Uses X-Forwarded-For, X-Real-IP, or falls back to a generic key.
 */
export function getClientKey(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown-client"
  );
}
