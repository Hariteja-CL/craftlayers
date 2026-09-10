import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    attachUserAgents,
    isStoreConfigured,
    MAX_USER_AGENT_READS,
    parseHitPathname,
    readHits,
    recordHit,
    type CrawlerHit,
    type StoredHit,
    type UserAgentReadReport,
} from './crawlerStore.js';
import statsHandler, { summarise } from '../crawler-stats.js';
import authHandler from '../auth.js';
import { COOKIE_NAME } from './session.js';
import { get, list, put } from '@vercel/blob';

/** Stubbed so the read path can be exercised without a live Blob store. */
vi.mock('@vercel/blob', () => ({ get: vi.fn(), list: vi.fn(), put: vi.fn() }));

const mockList = vi.mocked(list);
const mockGet = vi.mocked(get);

describe('parseHitPathname', () => {
    it('round-trips a normal hit', () => {
        const pathname = 'crawlers/2026-09-08/1757320000000-ab12cd__ai__GPTBot__%2Fwork%2Frespondent-experience.json';
        expect(parseHitPathname(pathname)).toEqual({
            at: 1757320000000,
            category: 'ai',
            family: 'GPTBot',
            path: '/work/respondent-experience',
            // Carried so the body can be located later; stripped again by
            // attachUserAgents before anything reaches a client.
            pathname,
        });
    });

    /** The separator is `__`, and encodeURIComponent leaves `_` alone — so a
     *  path containing a double underscore would split into five fields and
     *  corrupt the row unless underscores are encoded too. */
    it('survives a path containing the field separator', () => {
        const pathname = 'crawlers/2026-09-08/1757320000000-zz__search__Googlebot__%2Fa%5F%5Fb.json';
        expect(parseHitPathname(pathname)?.path).toBe('/a__b');
    });

    it('handles a family name containing a space or slash', () => {
        const pathname = 'crawlers/2026-09-08/1757320000000-xy__search__Yahoo!%20Slurp__%2F.json';
        expect(parseHitPathname(pathname)?.family).toBe('Yahoo! Slurp');
    });

    it.each([
        ['a foreign prefix', 'other/2026-09-08/123__ai__GPTBot__%2F.json'],
        ['a missing extension', 'crawlers/2026-09-08/123__ai__GPTBot__%2F'],
        ['too few fields', 'crawlers/2026-09-08/123__ai__GPTBot.json'],
        ['no date directory', 'crawlers/123__ai__GPTBot__%2F.json'],
        ['a non-numeric timestamp', 'crawlers/2026-09-08/nope__ai__GPTBot__%2F.json'],
    ])('returns null for %s', (_label, pathname) => {
        expect(parseHitPathname(pathname)).toBeNull();
    });

    it('does not throw on a badly percent-encoded segment', () => {
        const pathname = 'crawlers/2026-09-08/123__ai__GPTBot__%ZZ.json';
        expect(() => parseHitPathname(pathname)).not.toThrow();
    });
});

describe('summarise', () => {
    const hit = (at: number, family: string, category: CrawlerHit['category'], path: string): CrawlerHit => ({
        at,
        family,
        category,
        path,
    });

    const hits: CrawlerHit[] = [
        hit(500, 'GPTBot', 'ai', '/work/respondent-experience'),
        hit(400, 'Googlebot', 'search', '/work/respondent-experience'),
        hit(300, 'GPTBot', 'ai', '/library'),
        hit(200, 'Unrecognised bot', 'unknown', '/'),
        hit(100, 'Googlebot', 'search', '/work/respondent-experience'),
    ];

    it('counts total requests and distinct families', () => {
        const s = summarise(hits);
        expect(s.totals.requests).toBe(5);
        expect(s.totals.families).toBe(3);
    });

    it('splits AI, search and unknown traffic', () => {
        const s = summarise(hits);
        expect(s.totals.byCategory.ai).toBe(2);
        expect(s.totals.byCategory.search).toBe(2);
        expect(s.totals.byCategory.unknown).toBe(1);
        expect(s.totals.byCategory.social).toBe(0);
    });

    it('reports last seen per family, not first seen', () => {
        const s = summarise(hits);
        expect(s.families.find((f) => f.family === 'Googlebot')?.lastSeen).toBe(400);
        expect(s.families.find((f) => f.family === 'GPTBot')?.lastSeen).toBe(500);
    });

    it('ranks top pages by request count', () => {
        const s = summarise(hits);
        expect(s.topPages[0]).toEqual({ path: '/work/respondent-experience', count: 3 });
    });

    it('records the earliest hit so the view can state the observation window', () => {
        expect(summarise(hits).firstSeen).toBe(100);
    });

    it('returns an empty, non-throwing summary for no data', () => {
        const s = summarise([]);
        expect(s.totals.requests).toBe(0);
        expect(s.totals.families).toBe(0);
        expect(s.firstSeen).toBeNull();
        expect(s.topPages).toEqual([]);
    });
});

/**
 * The read path.
 *
 * These exist because an earlier version listed the whole `crawlers/` prefix
 * and trusted the order Vercel happened to return. Vercel does not document
 * that order, so these tests assert the behaviour the implementation now
 * guarantees on its own: recency comes from the day prefix, never from the API.
 */
describe('readHits — day-prefixed reads', () => {
    /** Noon UTC, so day-boundary arithmetic is unambiguous. */
    const NOW = Date.UTC(2026, 8, 8, 12, 0, 0);
    const DAY0 = 'crawlers/2026-09-08/';
    const DAY1 = 'crawlers/2026-09-07/';
    const DAY2 = 'crawlers/2026-09-06/';

    function blob(day: string, at: number, family: string, path: string) {
        const enc = encodeURIComponent(path).replace(/_/g, '%5F');
        return { pathname: `${day}${at}-aa11bb__ai__${family}__${enc}.json` };
    }

    function stubStore(byPrefix: Record<string, { pathname: string }[]>) {
        mockList.mockImplementation((async (opts: unknown) => ({
            blobs: byPrefix[(opts as { prefix?: string }).prefix ?? ''] ?? [],
            cursor: undefined,
            hasMore: false,
            folders: [],
        })) as unknown as typeof list);
    }

    const prefixesQueried = () =>
        mockList.mock.calls.map((c) => (c[0] as { prefix?: string }).prefix);

    beforeEach(() => {
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
        mockList.mockReset();
        mockGet.mockReset();
    });

    afterEach(() => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
    });

    it('reads the newest day first', async () => {
        stubStore({
            [DAY0]: [blob(DAY0, 300, 'GPTBot', '/a')],
            [DAY1]: [blob(DAY1, 200, 'GPTBot', '/b')],
        });
        await readHits(10, 30, NOW);
        expect(prefixesQueried()[0]).toBe(DAY0);
        expect(prefixesQueried()[1]).toBe(DAY1);
    });

    it('aggregates across multiple day prefixes, newest hit first', async () => {
        stubStore({
            [DAY0]: [blob(DAY0, 300, 'GPTBot', '/newest')],
            [DAY1]: [blob(DAY1, 200, 'Googlebot', '/middle')],
            [DAY2]: [blob(DAY2, 100, 'Bingbot', '/oldest')],
        });
        const hits = await readHits(10, 30, NOW);
        expect(hits.map((h) => h.path)).toEqual(['/newest', '/middle', '/oldest']);
    });

    it('stops listing once the limit is reached', async () => {
        stubStore({
            [DAY0]: [blob(DAY0, 300, 'GPTBot', '/a'), blob(DAY0, 290, 'GPTBot', '/b')],
            [DAY1]: [blob(DAY1, 200, 'GPTBot', '/c')],
        });
        const hits = await readHits(2, 30, NOW);
        expect(hits).toHaveLength(2);
        // The second day is never queried, so cost scales with the limit
        // rather than with the size of the store.
        expect(prefixesQueried()).toEqual([DAY0]);
    });

    it('does not depend on the order a day is returned in', async () => {
        stubStore({
            [DAY0]: [
                blob(DAY0, 100, 'GPTBot', '/oldest'),
                blob(DAY0, 300, 'GPTBot', '/newest'),
                blob(DAY0, 200, 'GPTBot', '/middle'),
            ],
        });
        const hits = await readHits(10, 30, NOW);
        expect(hits.map((h) => h.path)).toEqual(['/newest', '/middle', '/oldest']);
    });

    it('never lists the store globally', async () => {
        stubStore({ [DAY0]: [blob(DAY0, 300, 'GPTBot', '/a')] });
        await readHits(10, 3, NOW);
        expect(prefixesQueried()).not.toContain('crawlers/');
        for (const p of prefixesQueried()) {
            expect(p).toMatch(/^crawlers\/\d{4}-\d{2}-\d{2}\/$/);
        }
    });

    it('honours the lookback window', async () => {
        stubStore({});
        await readHits(10, 2, NOW);
        expect(prefixesQueried()).toEqual([DAY0, DAY1]);
    });

    it('reads nothing and never touches the store when unconfigured', async () => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
        stubStore({ [DAY0]: [blob(DAY0, 300, 'GPTBot', '/a')] });
        expect(await readHits(10, 30, NOW)).toEqual([]);
        expect(mockList).not.toHaveBeenCalled();
    });

    /** The cost guarantee. Aggregation runs over up to 2,000 rows, and one
     *  body read per row would be the N+1 this design exists to avoid. */
    it('never reads a Blob body', async () => {
        stubStore({
            [DAY0]: [blob(DAY0, 300, 'GPTBot', '/a'), blob(DAY0, 290, 'Googlebot', '/b')],
            [DAY1]: [blob(DAY1, 200, 'Bingbot', '/c')],
        });
        const hits = await readHits(100, 30, NOW);
        expect(hits).toHaveLength(3);
        expect(mockGet).not.toHaveBeenCalled();
    });

    it('skips unparseable objects instead of failing the whole read', async () => {
        stubStore({
            [DAY0]: [{ pathname: `${DAY0}garbage.json` }, blob(DAY0, 300, 'GPTBot', '/a')],
        });
        const hits = await readHits(10, 30, NOW);
        expect(hits.map((h) => h.path)).toEqual(['/a']);
    });
});

/**
 * Credential detection.
 *
 * These exist because of a real production failure: the store was connected
 * correctly through Vercel's current integration, which provisions the OIDC
 * pair and NO read-write token, while this check tested only for
 * BLOB_READ_WRITE_TOKEN. Every hit was silently dropped and the dashboard
 * reported "no storage provisioned" against a working store.
 *
 * @vercel/blob's resolveBlobAuth accepts either path, so this must too.
 */
describe('isStoreConfigured', () => {
    const saved = {
        rw: process.env.BLOB_READ_WRITE_TOKEN,
        id: process.env.BLOB_STORE_ID,
    };

    beforeEach(() => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
        delete process.env.BLOB_STORE_ID;
    });

    afterEach(() => {
        if (saved.rw === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
        else process.env.BLOB_READ_WRITE_TOKEN = saved.rw;
        if (saved.id === undefined) delete process.env.BLOB_STORE_ID;
        else process.env.BLOB_STORE_ID = saved.id;
    });

    it('accepts the classic read-write token', () => {
        process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_test';
        expect(isStoreConfigured()).toBe(true);
    });

    /** The regression this whole block exists for. */
    it('accepts OIDC auth, where only BLOB_STORE_ID is set', () => {
        process.env.BLOB_STORE_ID = 'store_testonly';
        expect(isStoreConfigured()).toBe(true);
    });

    it('accepts both being present', () => {
        process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_test';
        process.env.BLOB_STORE_ID = 'store_testonly';
        expect(isStoreConfigured()).toBe(true);
    });

    it('reports unconfigured only when neither credential exists', () => {
        expect(isStoreConfigured()).toBe(false);
    });

    it('treats an empty value as unconfigured', () => {
        process.env.BLOB_STORE_ID = '';
        process.env.BLOB_READ_WRITE_TOKEN = '';
        expect(isStoreConfigured()).toBe(false);
    });

    it('lets readHits run on OIDC credentials alone', async () => {
        process.env.BLOB_STORE_ID = 'store_testonly';
        mockList.mockReset();
        mockList.mockImplementation((async () => ({
            blobs: [],
            cursor: undefined,
            hasMore: false,
            folders: [],
        })) as unknown as typeof list);
        await readHits(10, 1, Date.UTC(2026, 8, 9, 12, 0, 0));
        expect(mockList).toHaveBeenCalled();
    });
});

/**
 * Write outcomes.
 *
 * recordHit used to swallow every error, which made a completely dead write
 * path indistinguishable from "no crawler has visited yet" — and with no
 * readable deployment logs, close to undebuggable. It now reports.
 */
describe('recordHit outcomes', () => {
    const mockPut = vi.mocked(put);

    beforeEach(() => {
        process.env.BLOB_STORE_ID = 'store_testonly';
        mockPut.mockReset();
    });

    afterEach(() => {
        delete process.env.BLOB_STORE_ID;
    });

    const hit: CrawlerHit = { at: Date.UTC(2026, 8, 9, 10, 0, 0), path: '/x', family: 'GPTBot', category: 'ai' };

    it('reports ok on a successful write', async () => {
        mockPut.mockImplementation((async () => ({})) as unknown as typeof put);
        expect(await recordHit(hit, 'GPTBot/1.1')).toBe('ok');
    });

    /** The store is private, and the SDK rejects a public write against it —
     *  which is what silently dropped every hit in production. These objects
     *  should not be world-readable regardless: the pathname carries the
     *  requested path and crawler family, and the body carries the user-agent. */
    it('writes with private access, never public', async () => {
        let seen: unknown;
        mockPut.mockImplementation((async (_p: unknown, _b: unknown, opts: unknown) => {
            seen = opts;
            return {};
        }) as unknown as typeof put);
        await recordHit(hit, 'GPTBot/1.1');
        expect((seen as { access?: string }).access).toBe('private');
    });

    it('reports no-store when no credentials exist', async () => {
        delete process.env.BLOB_STORE_ID;
        expect(await recordHit(hit, 'GPTBot/1.1')).toBe('no-store');
        expect(mockPut).not.toHaveBeenCalled();
    });

    it('reports the error instead of throwing', async () => {
        mockPut.mockImplementation((async () => {
            throw new Error('No blob credentials found.');
        }) as unknown as typeof put);
        const result = await recordHit(hit, 'GPTBot/1.1');
        expect(result).toMatch(/^error:/);
        expect(result).toContain('No blob credentials found');
    });

    /** The outcome reaches a response header, so it must never carry a token. */
    it('redacts any long opaque run from the reported message', async () => {
        mockPut.mockImplementation((async () => {
            throw new Error('rejected token vercel_blob_rw_ZmFrZXRva2VuZmFrZXRva2Vu123456');
        }) as unknown as typeof put);
        const result = await recordHit(hit, 'GPTBot/1.1');
        expect(result).toContain('<redacted>');
        expect(result).not.toContain('ZmFrZXRva2VuZmFrZXRva2Vu123456');
    });

    it('never throws, whatever the SDK does', async () => {
        mockPut.mockImplementation((() => {
            throw 'not even an Error';
        }) as unknown as typeof put);
        await expect(recordHit(hit, 'GPTBot/1.1')).resolves.toContain('unknown');
    });
});

/**
 * Recovering the stored user-agent.
 *
 * These exist because of a real investigation that could not be finished. On
 * 2026-09-09 an unattributed bot made 28 requests, enumerating every handbook
 * chapter, and the tracker could say how many and which paths but not what it
 * called itself — the user-agent had been written into every Blob body since
 * the tracker shipped, and no read path ever opened one.
 *
 * The two properties under test pull in opposite directions: the strings must
 * become reachable, and reaching them must not cost a body read per row.
 */
describe('attachUserAgents', () => {
    const pathnameFor = (i: number) =>
        `crawlers/2026-09-08/${1000 + i}-aa11bb__unknown__Unrecognised%20bot__%2Fp${i}.json`;

    const stored = (i: number): StoredHit => ({
        at: 1000 + i,
        path: `/p${i}`,
        family: 'Unrecognised bot',
        category: 'unknown',
        pathname: pathnameFor(i),
    });

    /** A 200 carrying a JSON body, shaped the way recordHit writes one. */
    function body(payload: unknown) {
        return {
            statusCode: 200,
            stream: new Response(typeof payload === 'string' ? payload : JSON.stringify(payload)).body,
            headers: new Headers(),
            blob: {},
        };
    }

    const stubGet = (fn: (pathname: string) => unknown) =>
        mockGet.mockImplementation((async (pathname: string) => fn(pathname)) as unknown as typeof get);

    beforeEach(() => {
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
        mockGet.mockReset();
    });

    afterEach(() => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
    });

    it('reads the stored user-agent onto the row', async () => {
        stubGet(() => body({ ua: 'SomeBot/2.1 (+http://example.invalid/bot)' }));
        const [row] = await attachUserAgents([stored(0)]);
        expect(row.userAgent).toBe('SomeBot/2.1 (+http://example.invalid/bot)');
    });

    /** The mapping must come from the index, not from whichever read wins the
     *  race — with a concurrent pool those are different things. */
    it('maps each row to its own user-agent regardless of completion order', async () => {
        stubGet(async (pathname) => {
            const n = Number(/%2Fp(\d+)\.json$/.exec(pathname)![1]);
            // Later rows resolve first, so completion order is the reverse of
            // input order.
            await new Promise((resolve) => setTimeout(resolve, (6 - n) * 4));
            return body({ ua: `agent-${n}` });
        });
        const out = await attachUserAgents([0, 1, 2, 3, 4, 5].map(stored));
        expect(out.map((h) => h.userAgent)).toEqual([
            'agent-0',
            'agent-1',
            'agent-2',
            'agent-3',
            'agent-4',
            'agent-5',
        ]);
        expect(out.map((h) => h.path)).toEqual(['/p0', '/p1', '/p2', '/p3', '/p4', '/p5']);
    });

    it.each([
        ['a deleted object', () => null],
        ['a 304 with no body', () => ({ statusCode: 304, stream: null, headers: new Headers(), blob: {} })],
        ['a body that is not JSON', () => body('<html>not json</html>')],
        ['a body that is JSON but not an object', () => body(42)],
        ['a body with no ua field', () => body({ something: 'else' })],
        ['a ua that is not a string', () => body({ ua: { nested: true } })],
        ['a ua that is empty', () => body({ ua: '   ' })],
        [
            'a read that throws',
            () => {
                throw new Error('blob unreachable');
            },
        ],
    ])('returns the row without a user-agent for %s', async (_label, stub) => {
        stubGet(stub as (pathname: string) => unknown);
        const out = await attachUserAgents([stored(0)]);
        expect(out).toHaveLength(1);
        expect(out[0].userAgent).toBeUndefined();
        // The row itself is intact — a missing diagnostic never costs the event.
        expect(out[0]).toMatchObject({ at: 1000, path: '/p0', family: 'Unrecognised bot' });
    });

    it('keeps the good rows when only one body fails', async () => {
        stubGet((pathname) => (pathname.includes('%2Fp1') ? null : body({ ua: 'GoodBot/1.0' })));
        const out = await attachUserAgents([stored(0), stored(1), stored(2)]);
        expect(out.map((h) => h.userAgent)).toEqual(['GoodBot/1.0', undefined, 'GoodBot/1.0']);
    });

    /** The pathname is an internal address. Nothing that leaves the store
     *  should carry it, so no client can come to depend on the layout. */
    it('never returns the Blob pathname', async () => {
        stubGet(() => body({ ua: 'SomeBot/1.0' }));
        const out = await attachUserAgents([stored(0)]);
        expect(out[0]).not.toHaveProperty('pathname');
        expect(JSON.stringify(out)).not.toContain('crawlers/');
    });

    it('reads no more than MAX_USER_AGENT_READS bodies however many rows it is given', async () => {
        stubGet(() => body({ ua: 'SomeBot/1.0' }));
        const out = await attachUserAgents(Array.from({ length: 400 }, (_, i) => stored(i)));
        expect(MAX_USER_AGENT_READS).toBe(50);
        expect(out).toHaveLength(MAX_USER_AGENT_READS);
        expect(mockGet.mock.calls.length).toBe(MAX_USER_AGENT_READS);
    });

    it('touches the store not at all when it is unconfigured', async () => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
        const out = await attachUserAgents([stored(0)]);
        expect(out[0].userAgent).toBeUndefined();
        expect(mockGet).not.toHaveBeenCalled();
    });

    it('handles being given nothing', async () => {
        expect(await attachUserAgents([])).toEqual([]);
        expect(mockGet).not.toHaveBeenCalled();
    });

    /**
     * A user-agent is written by the client. The write path truncates it and
     * nothing else, so everything hostile about the string has to be handled
     * on the way out.
     */
    describe('sanitisation', () => {
        it('re-clamps a stored user-agent that is longer than the cap', async () => {
            stubGet(() => body({ ua: 'A'.repeat(5000) }));
            const [row] = await attachUserAgents([stored(0)]);
            expect(row.userAgent).toHaveLength(201);
            expect(row.userAgent!.endsWith('…')).toBe(true);
        });

        /** Idempotent against what the write path produces: a value already
         *  truncated to 200 plus an ellipsis must survive unchanged. */
        it('leaves an already-truncated value alone', async () => {
            const written = 'B'.repeat(200) + '…';
            stubGet(() => body({ ua: written }));
            const [row] = await attachUserAgents([stored(0)]);
            expect(row.userAgent).toBe(written);
        });

        it('strips control characters, including NUL and ANSI escapes', async () => {
            stubGet(() => body({ ua: 'Evil\u0000Bot\u001b[31m/1.0\u0007' }));
            const [row] = await attachUserAgents([stored(0)]);
            expect(row.userAgent).toBe('Evil Bot [31m/1.0');
            // Asserted by code point, not by a pattern: a control-character
            // class inside a regex is the very thing no-control-regex forbids.
            expect([...row.userAgent!].every((c) => c.codePointAt(0)! >= 0x20)).toBe(true);
        });

        it('collapses newlines rather than carrying them into a log or a page', async () => {
            stubGet(() => body({ ua: 'Multi\nLine\r\nBot/1.0' }));
            const [row] = await attachUserAgents([stored(0)]);
            expect(row.userAgent).toBe('Multi Line Bot/1.0');
        });
    });
});

/**
 * The endpoint wiring.
 *
 * attachUserAgents being correct is worth nothing if the handler never calls
 * it, and the cost guarantee is worth nothing if it calls it on the whole
 * aggregation set.
 */
describe('crawler-stats — user-agent wiring', () => {
    const PASSWORD = 'correct-horse-battery-staple';
    const saved = {
        pw: process.env.ACCESS_DASHBOARD_PASSWORD,
        sec: process.env.ACCESS_DASHBOARD_SECRET,
    };

    beforeAll(() => {
        process.env.ACCESS_DASHBOARD_PASSWORD = PASSWORD;
        process.env.ACCESS_DASHBOARD_SECRET = 'unit-test-signing-secret-0123456789';
    });

    afterAll(() => {
        if (saved.pw === undefined) delete process.env.ACCESS_DASHBOARD_PASSWORD;
        else process.env.ACCESS_DASHBOARD_PASSWORD = saved.pw;
        if (saved.sec === undefined) delete process.env.ACCESS_DASHBOARD_SECRET;
        else process.env.ACCESS_DASHBOARD_SECRET = saved.sec;
    });

    beforeEach(() => {
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
        mockList.mockReset();
        mockGet.mockReset();
    });

    afterEach(() => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
    });

    /* eslint-disable @typescript-eslint/no-explicit-any -- mocked Vercel req/res */
    function mockRes() {
        const captured: { status: number; body: any; headers: Record<string, string> } = {
            status: 0,
            body: undefined,
            headers: {},
        };
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

    async function login(): Promise<string> {
        const { res, captured } = mockRes();
        // A fresh address each time, so logins never share a rate-limit bucket.
        const ip = `10.7.7.${Math.floor(Math.random() * 250)}`;
        await authHandler(
            { method: 'POST', headers: { 'x-forwarded-for': ip }, body: { password: PASSWORD } } as any,
            res,
        );
        expect(captured.status).toBe(200);
        return `${COOKIE_NAME}=${captured.headers['set-cookie'].split(';')[0].split('=')[1]}`;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    /** Stored hits on today's prefix, so readHits finds them on its first day. */
    function stubStore(count: number) {
        const now = Date.now();
        const today = new Date(now).toISOString().slice(0, 10);
        const blobs = Array.from({ length: count }, (_, i) => ({
            pathname: `crawlers/${today}/${now - i}-aa11bb__unknown__Unrecognised%20bot__%2Fp${i}.json`,
        }));
        mockList.mockImplementation((async (opts: unknown) => ({
            blobs: (opts as { prefix?: string }).prefix === `crawlers/${today}/` ? blobs : [],
            cursor: undefined,
            hasMore: false,
            folders: [],
        })) as unknown as typeof list);
        mockGet.mockImplementation((async () => ({
            statusCode: 200,
            stream: new Response(JSON.stringify({ ua: 'MysteryBot/3.0' })).body,
            headers: new Headers(),
            blob: {},
        })) as unknown as typeof get);
    }

    it('returns user-agents on recent rows, and reads one body per recent row only', async () => {
        stubStore(120);
        const cookie = await login();
        const { res, captured } = mockRes();
        await statsHandler({ method: 'GET', headers: { cookie }, query: {} } as never, res as never);

        expect(captured.status).toBe(200);
        // Aggregation still saw everything…
        expect(captured.body.totals.requests).toBe(120);
        // …while bodies were read only for the slice a person reads.
        expect(captured.body.recent).toHaveLength(50);
        expect(mockGet.mock.calls.length).toBe(50);
        expect(captured.body.recent.every((h: CrawlerHit) => h.userAgent === 'MysteryBot/3.0')).toBe(true);
    });

    it('puts no Blob pathname on the wire', async () => {
        stubStore(3);
        const cookie = await login();
        const { res, captured } = mockRes();
        await statsHandler({ method: 'GET', headers: { cookie }, query: {} } as never, res as never);
        expect(JSON.stringify(captured.body)).not.toContain('crawlers/');
    });

    it('still refuses an unauthenticated read, and reads no body doing it', async () => {
        stubStore(3);
        const { res, captured } = mockRes();
        await statsHandler({ method: 'GET', headers: {}, query: {} } as never, res as never);
        expect(captured.status).toBe(401);
        expect(mockGet).not.toHaveBeenCalled();
        expect(mockList).not.toHaveBeenCalled();
    });
});

/**
 * The read report.
 *
 * These exist because the first version of this feature shipped, failed in
 * production, and could not say why. Every read error degraded to "row without
 * a user-agent" — correct behaviour, and indistinguishable from fifty crawlers
 * that sent no user-agent. The rows alone cannot tell those apart, so the
 * report has to.
 */
describe('attachUserAgents — read report', () => {
    const stored = (i: number): StoredHit => ({
        at: 2000 + i,
        path: `/r${i}`,
        family: 'Unrecognised bot',
        category: 'unknown',
        pathname: `crawlers/2026-09-09/${2000 + i}-bb22cc__unknown__Unrecognised%20bot__%2Fr${i}.json`,
    });

    const okBody = (ua: string) => ({
        statusCode: 200,
        stream: new Response(JSON.stringify({ ua })).body,
        headers: new Headers(),
        blob: {},
    });

    const stubGet = (fn: (pathname: string) => unknown) =>
        mockGet.mockImplementation((async (pathname: string) => fn(pathname)) as unknown as typeof get);

    beforeEach(() => {
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
        mockGet.mockReset();
    });

    afterEach(() => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
    });

    it('counts what it attempted and what it resolved', async () => {
        stubGet(() => okBody('SomeBot/1.0'));
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };
        await attachUserAgents([stored(0), stored(1), stored(2)], report);
        expect(report).toEqual({ attempted: 3, resolved: 3, failed: 0 });
        expect(report.error).toBeUndefined();
    });

    /** The whole point: a total failure must not look like an empty result. */
    it('reports the error when every read fails', async () => {
        stubGet(() => {
            throw new Error('Access denied');
        });
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };
        const rows = await attachUserAgents(Array.from({ length: 50 }, (_, i) => stored(i)), report);
        expect(rows.every((r) => r.userAgent === undefined)).toBe(true);
        expect(report.attempted).toBe(50);
        expect(report.resolved).toBe(0);
        expect(report.error).toMatch(/Access denied/);
    });

    /** Scattered failures must not stop the reads that would have worked. */
    it('keeps going past scattered failures', async () => {
        stubGet((pathname) => {
            // Every odd index, two-digit ones included — an earlier version of this
            // pattern matched a single digit only and quietly tested half of what
            // its name claimed.
            if (/%2Fr\d*[13579]\.json$/.test(pathname)) throw new Error('transient');
            return okBody('SomeBot/1.0');
        });
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };
        const rows = await attachUserAgents(Array.from({ length: 20 }, (_, i) => stored(i)), report);
        expect(report.attempted).toBe(20);
        expect(report.resolved).toBe(10);
        expect(rows).toHaveLength(20);
    });

    it('distinguishes a missing object from a rejected read', async () => {
        stubGet(() => null);
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };
        await attachUserAgents([stored(0)], report);
        expect(report.error).toBe('not-found');
    });

    /** Callers that do not care keep the simple shape. */
    it('works with no report passed at all', async () => {
        stubGet(() => okBody('SomeBot/1.0'));
        const rows = await attachUserAgents([stored(0)]);
        expect(rows[0].userAgent).toBe('SomeBot/1.0');
    });
});

/**
 * The two production failures, as tests.
 *
 * Neither was hypothetical. After PR #113 shipped, no row on the live
 * dashboard carried a user-agent; after PR #115 added diagnostics, the
 * endpoint stopped answering at all and the page sat on "Loading…" — a worse
 * failure than the one the diagnostics were added to explain.
 */
describe('attachUserAgents — production regressions', () => {
    const stored = (i: number, url?: string): StoredHit => ({
        at: 3000 + i,
        path: `/x${i}`,
        family: 'Unrecognised bot',
        category: 'unknown',
        // The literal percent-escapes are the point: these are what the store
        // actually holds, and what get() interpolates into a URL unencoded.
        pathname: `crawlers/2026-09-09/${3000 + i}-cc33dd__unknown__Unrecognised%20bot__%2Fblog.json`,
        ...(url ? { url } : {}),
    });

    const okBody = (ua: string) => ({
        statusCode: 200,
        stream: new Response(JSON.stringify({ ua })).body,
        headers: new Headers(),
        blob: {},
    });

    beforeEach(() => {
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
        mockGet.mockReset();
    });

    afterEach(() => {
        delete process.env.BLOB_READ_WRITE_TOKEN;
    });

    /**
     * `get()` builds its request URL by interpolating the pathname into a
     * template with no encoding at all:
     *
     *     `https://${storeId}.${access}.blob.vercel-storage.com/${pathname}`
     *
     * These pathnames carry their own percent-escapes, so who decodes them is
     * ambiguous. The listing already hands back a canonical URL; use it.
     */
    it('reads by the canonical URL from the listing, not the pathname', async () => {
        const url = 'https://store123.private.blob.vercel-storage.com/crawlers/2026-09-09/x.json';
        const seen: string[] = [];
        mockGet.mockImplementation((async (target: string) => {
            seen.push(target);
            return okBody('SomeBot/1.0');
        }) as unknown as typeof get);

        await attachUserAgents([stored(0, url)]);
        expect(seen).toEqual([url]);
        expect(seen[0]).not.toContain('%2F');
    });

    /** Rows written before the listing URL was carried still have to work. */
    it('falls back to the pathname when the listing gave no URL', async () => {
        const seen: string[] = [];
        mockGet.mockImplementation((async (target: string) => {
            seen.push(target);
            return okBody('SomeBot/1.0');
        }) as unknown as typeof get);

        await attachUserAgents([stored(0)]);
        expect(seen[0]).toBe(stored(0).pathname);
    });

    it('never puts the internal URL on a returned row', async () => {
        mockGet.mockImplementation((async () => okBody('SomeBot/1.0')) as unknown as typeof get);
        const out = await attachUserAgents([
            stored(0, 'https://store123.private.blob.vercel-storage.com/a.json'),
        ]);
        expect(out[0]).not.toHaveProperty('url');
        expect(out[0]).not.toHaveProperty('pathname');
        expect(JSON.stringify(out)).not.toContain('blob.vercel-storage.com');
    });

    /**
     * The failure that broke the dashboard. A read that never settles ignores
     * its own per-read abort, so the ceiling cannot depend on the read
     * cooperating. Partial data beats no answer.
     */
    it('returns within the deadline even when every read hangs forever', async () => {
        mockGet.mockImplementation((() => new Promise(() => {})) as unknown as typeof get);
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };

        const started = Date.now();
        const out = await attachUserAgents(
            Array.from({ length: 50 }, (_, i) => stored(i)),
            report,
        );
        const elapsed = Date.now() - started;

        expect(out).toHaveLength(50);
        expect(out.every((r) => r.userAgent === undefined)).toBe(true);
        expect(report.error).toBe('deadline-exceeded');
        // Comfortably under any serverless function limit.
        expect(elapsed).toBeLessThan(9000);
    }, 15000);

    /** A slow store should still contribute whatever it managed to return. */
    it('keeps the rows that resolved before the deadline', async () => {
        mockGet.mockImplementation((async (target: string) => {
            if (target.includes('3000-')) return okBody('FastBot/1.0');
            return new Promise(() => {});
        }) as unknown as typeof get);
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };

        const out = await attachUserAgents(
            Array.from({ length: 20 }, (_, i) => stored(i)),
            report,
        );

        expect(out[0].userAgent).toBe('FastBot/1.0');
        expect(report.resolved).toBe(1);
        expect(report.error).toBe('deadline-exceeded');
    }, 15000);

    /** A thrown BlobError is what a real 404 looks like — get() throws rather
     *  than returning null for any non-200. */
    it('counts failures and reports the first error', async () => {
        mockGet.mockImplementation((async () => {
            throw new Error('Vercel Blob: Not found');
        }) as unknown as typeof get);
        const report: UserAgentReadReport = { attempted: 0, resolved: 0, failed: 0 };

        await attachUserAgents(Array.from({ length: 6 }, (_, i) => stored(i)), report);

        expect(report.attempted).toBe(6);
        expect(report.failed).toBe(6);
        expect(report.resolved).toBe(0);
        expect(report.error).toMatch(/Not found/);
    });
});
