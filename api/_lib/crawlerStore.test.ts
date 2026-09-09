import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isStoreConfigured, parseHitPathname, readHits, type CrawlerHit } from './crawlerStore.js';
import { summarise } from '../crawler-stats.js';
import { list } from '@vercel/blob';

/** Stubbed so the read path can be exercised without a live Blob store. */
vi.mock('@vercel/blob', () => ({ list: vi.fn(), put: vi.fn() }));

const mockList = vi.mocked(list);

describe('parseHitPathname', () => {
    it('round-trips a normal hit', () => {
        const pathname = 'crawlers/2026-09-08/1757320000000-ab12cd__ai__GPTBot__%2Fwork%2Frespondent-experience.json';
        expect(parseHitPathname(pathname)).toEqual({
            at: 1757320000000,
            category: 'ai',
            family: 'GPTBot',
            path: '/work/respondent-experience',
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
