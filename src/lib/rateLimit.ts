/**
 * Sliding-window rate limiter (in-memory).
 *
 * Good for a single Node process (VPS / container). On serverless platforms each instance has its own
 * memory, so the limit is per-instance — swap `store` for Redis/Upstash for a global limit
 * (documented in docs/DEPLOYMENT.md). The interface is deliberately tiny to make that swap trivial.
 */
export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

type Store = Map<string, number[]>;
const globalStore = globalThis as unknown as { __consoleRl?: Store };
const store: Store = (globalStore.__consoleRl ??= new Map());

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const cutoff = now - windowMs;
  const hits = (store.get(key) ?? []).filter((t) => t > cutoff);

  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    store.set(key, hits);
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }

  hits.push(now);
  store.set(key, hits);

  // opportunistic cleanup so the map cannot grow without bound
  if (store.size > 5000) {
    for (const [k, v] of store) if (!v.some((t) => t > cutoff)) store.delete(k);
  }
  return { allowed: true, remaining: limit - hits.length, retryAfterSeconds: 0 };
}

export function __resetRateLimitForTests() {
  store.clear();
}
