/**
 * Tiny in-memory limiter (per server instance) to blunt form spam.
 * For multi-instance deployments swap this for a shared store such as Redis/Upstash.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 8, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
