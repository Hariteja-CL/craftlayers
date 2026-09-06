/**
 * Access-control tests for the private endpoints.
 *
 * These call the real handlers with mocked request/response objects, so they
 * verify the actual authorization branches rather than a reimplementation of
 * them. No network call is made: every path asserted here returns before any
 * upstream request.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import authHandler from '../auth';
import cultureHandler from '../culture-data';
import interventionHandler from '../intervention';
import { COOKIE_NAME } from './session';

const PASSWORD = 'correct-horse-battery-staple';
const SECRET = 'unit-test-signing-secret-0123456789';

beforeAll(() => {
    process.env.ACCESS_DASHBOARD_PASSWORD = PASSWORD;
    process.env.ACCESS_DASHBOARD_SECRET = SECRET;
});

interface Captured {
    status: number;
    body: unknown;
    headers: Record<string, string>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mockRes() {
    const captured: Captured = { status: 0, body: undefined, headers: {} };
    const res: any = {
        setHeader(k: string, v: string) {
            captured.headers[k.toLowerCase()] = String(v);
        },
        status(code: number) {
            captured.status = code;
            return res;
        },
        json(payload: unknown) {
            captured.body = payload;
            return res;
        },
    };
    return { res, captured };
}

function mockReq(method: string, opts: { cookie?: string; body?: unknown } = {}) {
    return {
        method,
        headers: { cookie: opts.cookie, 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}` },
        body: opts.body,
    } as any;
}

/** Extracts the cookie value from a Set-Cookie header. */
function cookieFrom(setCookie: string): string {
    return `${COOKIE_NAME}=${setCookie.split(';')[0].split('=')[1]}`;
}

async function login(): Promise<string> {
    const { res, captured } = mockRes();
    await authHandler(mockReq('POST', { body: { password: PASSWORD } }), res);
    expect(captured.status).toBe(200);
    return cookieFrom(captured.headers['set-cookie']);
}

describe('auth endpoint', () => {
    it('reports unauthenticated with no cookie', async () => {
        const { res, captured } = mockRes();
        await authHandler(mockReq('GET'), res);
        expect(captured.status).toBe(200);
        expect(captured.body).toEqual({ authenticated: false });
    });

    it('rejects a wrong password with a generic 401', async () => {
        const { res, captured } = mockRes();
        await authHandler(mockReq('POST', { body: { password: 'wrong' } }), res);
        expect(captured.status).toBe(401);
        expect(captured.body).toEqual({ error: 'Invalid credentials' });
        expect(captured.headers['set-cookie']).toBeUndefined();
    });

    it('rejects a near-miss with the identical response', async () => {
        const { res, captured } = mockRes();
        await authHandler(mockReq('POST', { body: { password: PASSWORD.slice(0, -1) } }), res);
        expect(captured.status).toBe(401);
        expect(captured.body).toEqual({ error: 'Invalid credentials' });
    });

    it('rejects a non-string password', async () => {
        const { res, captured } = mockRes();
        await authHandler(mockReq('POST', { body: { password: { $ne: null } } }), res);
        expect(captured.status).toBe(401);
    });

    it('sets a hardened cookie on success', async () => {
        const { res, captured } = mockRes();
        await authHandler(mockReq('POST', { body: { password: PASSWORD } }), res);
        expect(captured.status).toBe(200);
        const cookie = captured.headers['set-cookie'];
        expect(cookie).toContain('HttpOnly');
        expect(cookie).toContain('SameSite=Strict');
        expect(cookie).toContain('Path=/');
    });

    it('clears the cookie on logout', async () => {
        const { res, captured } = mockRes();
        await authHandler(mockReq('DELETE'), res);
        expect(captured.status).toBe(200);
        expect(captured.headers['set-cookie']).toContain('Max-Age=0');
    });
});

describe('culture-data endpoint', () => {
    it('returns 401 and no data without a cookie', async () => {
        const { res, captured } = mockRes();
        await cultureHandler(mockReq('GET'), res);
        expect(captured.status).toBe(401);
        expect(captured.body).toEqual({ error: 'Unauthorized' });
    });

    it('returns 401 for a forged cookie', async () => {
        const { res, captured } = mockRes();
        await cultureHandler(mockReq('GET', { cookie: `${COOKIE_NAME}=v1.99999999999999.aaa.bbb` }), res);
        expect(captured.status).toBe(401);
    });

    it('returns 401 for the old client-side bypass shape', async () => {
        // The previous gate trusted sessionStorage.access_enculture_dashboard.
        // Nothing the browser can set is honoured any more.
        const { res, captured } = mockRes();
        await cultureHandler(mockReq('GET', { cookie: 'access_enculture_dashboard=true' }), res);
        expect(captured.status).toBe(401);
    });

    it('returns data with a valid session', async () => {
        const cookie = await login();
        const { res, captured } = mockRes();
        await cultureHandler(mockReq('GET', { cookie }), res);
        expect(captured.status).toBe(200);
        expect((captured.body as { data: unknown[] }).data).toHaveLength(5);
    });

    it('stops serving data after logout invalidates the cookie', async () => {
        const cookie = await login();
        const { res: r1, captured: c1 } = mockRes();
        await cultureHandler(mockReq('GET', { cookie }), r1);
        expect(c1.status).toBe(200);

        // Logout clears the cookie in the browser; the server then sees none.
        const { res: r2, captured: c2 } = mockRes();
        await cultureHandler(mockReq('GET', { cookie: `${COOKIE_NAME}=` }), r2);
        expect(c2.status).toBe(401);
    });
});

describe('intervention endpoint', () => {
    it('returns 401 before spending any model credit', async () => {
        const { res, captured } = mockRes();
        await interventionHandler(
            mockReq('POST', { body: { messages: [{ role: 'user', content: 'hi' }] } }),
            res
        );
        expect(captured.status).toBe(401);
    });

    it('rejects a non-POST method', async () => {
        const { res, captured } = mockRes();
        await interventionHandler(mockReq('GET'), res);
        expect(captured.status).toBe(405);
    });
});
