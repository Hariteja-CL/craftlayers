/**
 * Access control for the private handbook.
 *
 * These exist because of a real exposure. The handbook used to live under
 * `src/content/`, so Vite compiled all sixteen chapters into public JS chunks
 * and a single public manifest chunk listed every chapter URL. The whole
 * 112,000-word handbook could be downloaded with seventeen unauthenticated
 * requests. No route guard could have fixed that — the content never needed
 * the route — so the source moved out of `src/` and behind this endpoint.
 *
 * The handler is called directly with mocked request/response objects, so
 * these verify the real authorization branches rather than a reimplementation.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import libraryHandler from './library.js';
import authHandler from './auth.js';
import { COOKIE_NAME } from './_lib/session.js';

const PASSWORD = 'correct-horse-battery-staple';
const SECRET = 'unit-test-signing-secret-0123456789';

beforeAll(() => {
    process.env.ACCESS_DASHBOARD_PASSWORD = PASSWORD;
    process.env.ACCESS_DASHBOARD_SECRET = SECRET;
});

/* eslint-disable @typescript-eslint/no-explicit-any -- mocked Vercel req/res */
interface Captured {
    status: number;
    body: any;
    headers: Record<string, string>;
}

function mockRes() {
    const captured: Captured = { status: 0, body: undefined, headers: {} };
    const res: any = {
        setHeader(k: string, v: string) {
            captured.headers[k.toLowerCase()] = String(v);
            return res;
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

function mockReq(method: string, opts: { cookie?: string; query?: Record<string, string> } = {}) {
    return {
        method,
        headers: {
            cookie: opts.cookie,
            'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}`,
        },
        query: opts.query ?? {},
    } as any;
}

async function login(): Promise<string> {
    const { res, captured } = mockRes();
    // A fresh address each time, so logins never share a rate-limit bucket.
    const ip = `10.9.9.${Math.floor(Math.random() * 250)}`;
    await authHandler(
        { method: 'POST', headers: { 'x-forwarded-for': ip }, body: { password: PASSWORD } } as any,
        res,
    );
    expect(captured.status).toBe(200);
    const setCookie = captured.headers['set-cookie'];
    return `${COOKIE_NAME}=${setCookie.split(';')[0].split('=')[1]}`;
}

describe('library endpoint — unauthenticated', () => {
    it('refuses the index with no session', async () => {
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET'), res);
        expect(captured.status).toBe(401);
        expect(captured.body).toEqual({ error: 'Unauthorized' });
    });

    /** The deep link is the case that matters: a chapter URL pasted into a
     *  browser, or fetched directly, must not return content. */
    it('refuses a chapter with no session', async () => {
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET', { query: { chapter: 'retrieval-and-rag' } }), res);
        expect(captured.status).toBe(401);
        expect(JSON.stringify(captured.body)).not.toMatch(/retrieval/i);
    });

    it('refuses a forged session cookie', async () => {
        const { res, captured } = mockRes();
        await libraryHandler(
            mockReq('GET', { cookie: `${COOKIE_NAME}=v1.99999999999999.aaa.bbb` }),
            res,
        );
        expect(captured.status).toBe(401);
    });

    it('refuses an empty session cookie', async () => {
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET', { cookie: `${COOKIE_NAME}=` }), res);
        expect(captured.status).toBe(401);
    });

    /** An expired token is signed correctly but past its expiry. It must be
     *  refused the same way a forged one is. */
    it('refuses an expired session', async () => {
        const cookie = await login();
        const { res, captured } = mockRes();
        // Ten hours on; the TTL is eight.
        vi.setSystemTime(new Date(Date.now() + 10 * 60 * 60 * 1000));
        await libraryHandler(mockReq('GET', { cookie }), res);
        vi.useRealTimers();
        expect(captured.status).toBe(401);
    });

    it('rejects a non-GET method before touching content', async () => {
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('POST'), res);
        expect(captured.status).toBe(405);
    });
});

describe('library endpoint — authenticated', () => {
    it('returns the index, including titles and ordering', async () => {
        const cookie = await login();
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET', { cookie }), res);
        expect(captured.status).toBe(200);
        expect(captured.body.chapters).toHaveLength(16);
        expect(captured.body.chapters[0].number).toBe(1);
        expect(captured.body.handbook.title).toMatch(/handbook/i);
        expect(captured.body.lessons.length).toBeGreaterThan(0);
        expect(captured.body.evidence.length).toBeGreaterThan(0);
        expect(captured.body.gaps.length).toBeGreaterThan(0);
    });

    it('returns a chapter with its markdown and neighbours', async () => {
        const cookie = await login();
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET', { cookie, query: { chapter: 'retrieval-and-rag' } }), res);
        expect(captured.status).toBe(200);
        expect(captured.body.chapter.slug).toBe('retrieval-and-rag');
        expect(typeof captured.body.markdown).toBe('string');
        expect(captured.body.markdown.length).toBeGreaterThan(1000);
        expect(captured.body.previous.slug).toBe('tool-use');
        expect(captured.body.next.slug).toBe('mcp-and-external-systems');
    });

    it('404s an unknown chapter rather than reading a file', async () => {
        const cookie = await login();
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET', { cookie, query: { chapter: 'not-a-chapter' } }), res);
        expect(captured.status).toBe(404);
    });

    /** The slug is resolved through the manifest before it can reach the
     *  filesystem, so a traversal-shaped value is simply an unknown chapter. */
    it('refuses a path-traversal slug', async () => {
        const cookie = await login();
        for (const slug of ['../../../etc/passwd', '../auth', './../../package.json']) {
            const { res, captured } = mockRes();
            await libraryHandler(mockReq('GET', { cookie, query: { chapter: slug } }), res);
            expect(captured.status).toBe(404);
        }
    });

    it('never allows a chapter response to be cached', async () => {
        const cookie = await login();
        const { res, captured } = mockRes();
        await libraryHandler(mockReq('GET', { cookie, query: { chapter: 'tool-use' } }), res);
        expect(captured.headers['cache-control']).toBe('no-store');
    });
});
