/**
 * Dashboard authentication.
 *
 *   GET    → { authenticated: boolean }   cheap check used to decide whether
 *                                          to render the login form
 *   POST   → { password } sets the session cookie on success
 *   DELETE → clears the session cookie
 *
 * Every failure returns the same body and the same status. The response never
 * reveals whether the password was wrong, whether it was close, how long it
 * should have been, or whether the server is configured at all.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
    buildClearedCookie,
    buildSessionCookie,
    clientKey,
    hasValidSession,
    issueToken,
    safeEqual,
} from './_lib/session';
import { rateLimit, resetKey } from './_lib/rateLimit';

/** Five attempts per fifteen minutes per client key. See rateLimit.ts for
 *  why this is a speed bump rather than a guarantee. */
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const GENERIC_FAILURE = { error: 'Invalid credentials' } as const;

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'GET') {
        return res.status(200).json({ authenticated: hasValidSession(req.headers.cookie) });
    }

    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', buildClearedCookie());
        return res.status(200).json({ authenticated: false });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST, DELETE');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // POST only. GET (session status) and DELETE (logout) return above, so
    // neither a page load nor a sign-out can consume a login attempt.
    // The `auth:` prefix keeps this bucket separate from `chat:`.
    const attemptKey = `auth:${clientKey(req.headers['x-forwarded-for'])}`;
    const limit = rateLimit(attemptKey, MAX_ATTEMPTS, ATTEMPT_WINDOW_MS);
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter));
        return res.status(429).json({ error: 'Too many attempts' });
    }

    const expected = process.env.ACCESS_DASHBOARD_PASSWORD;
    const secret = process.env.ACCESS_DASHBOARD_SECRET;

    // Fail closed and stay generic. A distinct "not configured" response would
    // tell an attacker the deployment is half-set-up and worth revisiting.
    if (!expected || !secret) {
        console.error('auth: ACCESS_DASHBOARD_PASSWORD or ACCESS_DASHBOARD_SECRET is not set');
        return res.status(401).json(GENERIC_FAILURE);
    }

    const supplied = typeof req.body?.password === 'string' ? req.body.password : '';

    // safeEqual hashes both sides first, so it is constant-time with respect
    // to both the value and the length of the supplied password.
    if (!safeEqual(supplied, expected)) {
        return res.status(401).json(GENERIC_FAILURE);
    }

    // Only failures should count towards the lockout.
    resetKey(attemptKey);
    res.setHeader('Set-Cookie', buildSessionCookie(issueToken(secret)));
    return res.status(200).json({ authenticated: true });
}
