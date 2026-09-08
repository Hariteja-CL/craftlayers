/**
 * Server-side session primitives for the private dashboard.
 *
 * This file runs ONLY inside Vercel Functions. It is deliberately placed under
 * `api/_lib/` — the leading underscore keeps Vercel from routing it as an
 * endpoint — and it must never be imported from anything under `src/`, or the
 * signing secret would be pulled into the browser bundle.
 *
 * The token is a signed bearer value, not an encrypted one. It carries no
 * secret payload: only an expiry and a random nonce, authenticated with
 * HMAC-SHA256. There is no server-side session store, which means a token
 * cannot be revoked individually before it expires — rotating
 * ACCESS_DASHBOARD_SECRET invalidates every outstanding token at once.
 */
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export const COOKIE_NAME = 'cl_session';

/** Eight hours. Long enough for a working session, short enough that a
 *  forgotten laptop stops being a standing grant. */
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const TOKEN_VERSION = 'v1';

function b64url(buf: Buffer): string {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Constant-time string comparison.
 *
 * `timingSafeEqual` throws when the buffers differ in length, which would
 * itself leak length through the error path — so both sides are hashed to a
 * fixed 32 bytes first and the digests are compared instead.
 */
export function safeEqual(a: string, b: string): boolean {
    const ha = createHmac('sha256', 'length-blind').update(a).digest();
    const hb = createHmac('sha256', 'length-blind').update(b).digest();
    return timingSafeEqual(ha, hb);
}

function sign(payload: string, secret: string): string {
    return b64url(createHmac('sha256', secret).update(payload).digest());
}

/** Mint a token valid for SESSION_TTL_MS. */
export function issueToken(secret: string, now = Date.now()): string {
    const exp = now + SESSION_TTL_MS;
    const nonce = b64url(randomBytes(12));
    const payload = `${TOKEN_VERSION}.${exp}.${nonce}`;
    return `${payload}.${sign(payload, secret)}`;
}

/**
 * Verify signature first, expiry second.
 *
 * Order matters: checking expiry before the signature would let an attacker
 * distinguish "well-formed but stale" from "forged", which is a small oracle.
 */
export function verifyToken(token: string | undefined, secret: string, now = Date.now()): boolean {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 4) return false;
    const [version, expRaw, nonce, sig] = parts;
    if (version !== TOKEN_VERSION) return false;

    const payload = `${version}.${expRaw}.${nonce}`;
    if (!safeEqual(sig, sign(payload, secret))) return false;

    const exp = Number(expRaw);
    return Number.isFinite(exp) && exp > now;
}

export function parseCookies(header: string | undefined): Record<string, string> {
    const out: Record<string, string> = {};
    if (!header) return out;
    for (const part of header.split(';')) {
        const eq = part.indexOf('=');
        if (eq === -1) continue;
        out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
    }
    return out;
}

/** Secure is omitted on plain-HTTP local dev, where the browser would
 *  otherwise refuse to store the cookie and login would appear to fail. */
function isProduction(): boolean {
    return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

export function buildSessionCookie(token: string): string {
    const attrs = [
        `${COOKIE_NAME}=${token}`,
        'HttpOnly',
        'SameSite=Strict',
        'Path=/',
        `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
    ];
    if (isProduction()) attrs.push('Secure');
    return attrs.join('; ');
}

export function buildClearedCookie(): string {
    const attrs = [`${COOKIE_NAME}=`, 'HttpOnly', 'SameSite=Strict', 'Path=/', 'Max-Age=0'];
    if (isProduction()) attrs.push('Secure');
    return attrs.join('; ');
}

/**
 * True when the request carries a valid session cookie.
 *
 * Returns false — never throws — when the secret is unset, so a
 * misconfigured deployment fails closed rather than open.
 */
export function hasValidSession(cookieHeader: string | undefined): boolean {
    const secret = process.env.ACCESS_DASHBOARD_SECRET;
    if (!secret) return false;
    return verifyToken(parseCookies(cookieHeader)[COOKIE_NAME], secret);
}

/**
 * Best-effort client identifier, used ONLY as an in-memory rate-limit key.
 * It is never written to storage, never logged, and never leaves the function.
 */
export function clientKey(forwardedFor: string | string[] | undefined): string {
    const raw = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return (raw ?? '').split(',')[0].trim() || 'unknown';
}
