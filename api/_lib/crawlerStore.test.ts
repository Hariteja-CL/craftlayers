import { describe, expect, it } from 'vitest';
import { parseHitPathname, type CrawlerHit } from './crawlerStore.js';
import { summarise } from '../crawler-stats.js';

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
