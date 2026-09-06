/**
 * In-memory sliding-window rate limiter.
 *
 * HONEST LIMITATION: serverless instances are ephemeral and Vercel runs many
 * of them concurrently, so this counter is per-instance, not global. A
 * determined attacker spraying requests across instances gets more attempts
 * than the nominal limit suggests. It is a speed bump, not a control.
 *
 * It is here because the alternative within a strict $0 budget is nothing at
 * all, and a speed bump plus a strong password is meaningfully better than an
 * unthrottled endpoint. A real limiter needs shared state (Redis), which is
 * deliberately out of scope for this PR.
 */

interface Window {
    hits: number[];
}

const buckets = new Map<string, Window>();

/** Keeps the map from growing without bound on a long-lived instance. */
const MAX_KEYS = 5000;

export interface RateLimitResult {
    allowed: boolean;
    /** Seconds until the caller may retry. Zero when allowed. */
    retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
    if (buckets.size > MAX_KEYS) buckets.clear();

    const bucket = buckets.get(key) ?? { hits: [] };
    const cutoff = now - windowMs;
    bucket.hits = bucket.hits.filter((t) => t > cutoff);

    if (bucket.hits.length >= limit) {
        buckets.set(key, bucket);
        const oldest = bucket.hits[0];
        return { allowed: false, retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
    }

    bucket.hits.push(now);
    buckets.set(key, bucket);
    return { allowed: true, retryAfter: 0 };
}

/**
 * Clear one key's history.
 *
 * Used after a successful login so that only FAILED attempts accumulate.
 * Without it, five legitimate sign-ins inside the window would lock the owner
 * out of their own dashboard — and an attacker who already knows the password
 * gains nothing from the reset.
 */
export function resetKey(key: string): void {
    buckets.delete(key);
}

/** Test seam. Not used in production paths. */
export function __resetRateLimit(): void {
    buckets.clear();
}
