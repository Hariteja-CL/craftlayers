import { describe, it, expect } from 'vitest';
import {
    COOKIE_NAME,
    SESSION_TTL_MS,
    buildClearedCookie,
    buildSessionCookie,
    clientKey,
    issueToken,
    parseCookies,
    safeEqual,
    verifyToken,
} from './session.js';
import { rateLimit, __resetRateLimit } from './rateLimit.js';

const SECRET = 'test-secret-value-not-used-anywhere-real';

describe('safeEqual', () => {
    it('matches identical strings', () => {
        expect(safeEqual('hunter2', 'hunter2')).toBe(true);
    });

    it('rejects different strings of equal length', () => {
        expect(safeEqual('hunter2', 'hunter3')).toBe(false);
    });

    it('rejects different lengths without throwing', () => {
        // timingSafeEqual throws on length mismatch; the hashing wrapper is
        // what stops that from becoming a length oracle.
        expect(() => safeEqual('a', 'a-much-longer-password')).not.toThrow();
        expect(safeEqual('a', 'a-much-longer-password')).toBe(false);
    });

    it('rejects a prefix of the correct value', () => {
        expect(safeEqual('hunter', 'hunter2')).toBe(false);
    });
});

describe('token', () => {
    it('accepts a freshly issued token', () => {
        expect(verifyToken(issueToken(SECRET), SECRET)).toBe(true);
    });

    it('rejects a token signed with a different secret', () => {
        expect(verifyToken(issueToken('other-secret'), SECRET)).toBe(false);
    });

    it('rejects an expired token', () => {
        const past = Date.now() - SESSION_TTL_MS - 1000;
        expect(verifyToken(issueToken(SECRET, past), SECRET)).toBe(false);
    });

    it('rejects a token whose expiry was tampered with', () => {
        const token = issueToken(SECRET);
        const [v, , nonce, sig] = token.split('.');
        const forged = [v, String(Date.now() + 10 * 365 * 24 * 3600 * 1000), nonce, sig].join('.');
        expect(verifyToken(forged, SECRET)).toBe(false);
    });

    it('rejects undefined, empty and malformed tokens', () => {
        expect(verifyToken(undefined, SECRET)).toBe(false);
        expect(verifyToken('', SECRET)).toBe(false);
        expect(verifyToken('garbage', SECRET)).toBe(false);
        expect(verifyToken('v1.1.2', SECRET)).toBe(false);
    });

    it('issues distinct tokens on repeat calls', () => {
        expect(issueToken(SECRET)).not.toBe(issueToken(SECRET));
    });
});

describe('cookies', () => {
    it('marks the session cookie HttpOnly, SameSite=Strict and Path=/', () => {
        const c = buildSessionCookie('abc');
        expect(c).toContain(`${COOKIE_NAME}=abc`);
        expect(c).toContain('HttpOnly');
        expect(c).toContain('SameSite=Strict');
        expect(c).toContain('Path=/');
    });

    it('clears with Max-Age=0', () => {
        expect(buildClearedCookie()).toContain('Max-Age=0');
    });

    it('parses a cookie header', () => {
        expect(parseCookies('a=1; cl_session=xyz; b=2').cl_session).toBe('xyz');
    });

    it('returns nothing for a missing header', () => {
        expect(parseCookies(undefined)).toEqual({});
    });
});

describe('clientKey', () => {
    it('takes the first hop of x-forwarded-for', () => {
        expect(clientKey('203.0.113.9, 70.41.3.18')).toBe('203.0.113.9');
    });

    it('falls back when the header is absent', () => {
        expect(clientKey(undefined)).toBe('unknown');
    });
});

describe('rateLimit', () => {
    it('allows up to the limit then blocks', () => {
        __resetRateLimit();
        for (let i = 0; i < 5; i += 1) {
            expect(rateLimit('k', 5, 60_000).allowed).toBe(true);
        }
        const blocked = rateLimit('k', 5, 60_000);
        expect(blocked.allowed).toBe(false);
        expect(blocked.retryAfter).toBeGreaterThan(0);
    });

    it('tracks keys independently', () => {
        __resetRateLimit();
        for (let i = 0; i < 5; i += 1) rateLimit('a', 5, 60_000);
        expect(rateLimit('a', 5, 60_000).allowed).toBe(false);
        expect(rateLimit('b', 5, 60_000).allowed).toBe(true);
    });

    it('recovers once the window has passed', () => {
        __resetRateLimit();
        const t0 = 1_000_000;
        for (let i = 0; i < 5; i += 1) rateLimit('c', 5, 60_000, t0);
        expect(rateLimit('c', 5, 60_000, t0).allowed).toBe(false);
        expect(rateLimit('c', 5, 60_000, t0 + 61_000).allowed).toBe(true);
    });
});
