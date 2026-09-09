/**
 * What the site exposes publicly.
 *
 * The handbook was publicly downloadable until 2026-09-09: it lived under
 * `src/content/`, so Vite compiled every chapter into a public JS chunk. These
 * tests exist so that cannot silently come back — moving a single `.md` file
 * into `src/` would fail them.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

/** Strings that only appear in the private handbook. If any reaches a public
 *  artefact, the content has leaked. */
const PRIVATE_MARKERS = [
    'AI Product Development Handbook',
    'Retrieval and RAG',
    'identity-authentication-authorization-rbac',
    'A model proposes; it does not authorize',
    'A protocol connection is not a trust relationship',
    'G-18',
];

describe('sitemap', () => {
    const sitemap = read('public/sitemap.xml');

    it('advertises no library route', () => {
        const libraryUrls = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)]
            .map((m) => m[1])
            .filter((u) => u.includes('/library'));
        expect(libraryUrls).toEqual([]);
    });

    it('still advertises the public portfolio', () => {
        for (const path of ['/work/respondent-experience', '/work/dashboard-explainability', '/blog', '/profile']) {
            expect(sitemap).toContain(`https://www.craftlayers.com${path}<`);
        }
    });
});

describe('robots.txt', () => {
    const robots = read('public/robots.txt');

    it('disallows the library', () => {
        expect(robots).toMatch(/^Disallow:\s*\/library\s*$/m);
    });

    it('keeps disallowing the dashboards and the API', () => {
        expect(robots).toMatch(/^Disallow:\s*\/dashboard\s*$/m);
        expect(robots).toMatch(/^Disallow:\s*\/api\/\s*$/m);
    });

    /** robots.txt is advisory. The file says so, and that note is the reason
     *  nobody should mistake it for the control that protects the library. */
    it('states that it is not a security control', () => {
        expect(robots.toLowerCase()).toMatch(/not a security control|advisory/);
    });

    it('does not disallow the public portfolio', () => {
        expect(robots).not.toMatch(/^Disallow:\s*\/work/m);
        expect(robots).not.toMatch(/^Disallow:\s*\/blog/m);
    });
});

describe('handbook source location', () => {
    it('keeps no markdown under src/, where Vite would bundle it', () => {
        const contentDir = join(ROOT, 'src', 'content');
        const found: string[] = [];
        if (existsSync(contentDir)) {
            (function walk(d: string) {
                for (const f of readdirSync(d)) {
                    const p = join(d, f);
                    if (statSync(p).isDirectory()) walk(p);
                    else if (f.endsWith('.md')) found.push(p);
                }
            })(contentDir);
        }
        expect(found).toEqual([]);
    });

    it('keeps the chapters and manifest under api/_content/', () => {
        const dir = join(ROOT, 'api', '_content', 'library', 'ai-product-development');
        const files = readdirSync(dir);
        expect(files.filter((f) => f.endsWith('.md'))).toHaveLength(16);
        expect(files).toContain('manifest.ts');
    });

    it('has no client module importing the server manifest', () => {
        const srcDir = join(ROOT, 'src');
        const offenders: string[] = [];
        (function walk(d: string) {
            for (const f of readdirSync(d)) {
                const p = join(d, f);
                if (statSync(p).isDirectory()) walk(p);
                else if (/\.(ts|tsx)$/.test(f) && readFileSync(p, 'utf8').includes('_content/library')) {
                    offenders.push(p);
                }
            }
        })(srcDir);
        expect(offenders).toEqual([]);
    });
});

/**
 * The decisive check. Skipped when `dist/` is absent so `npm test` works on a
 * clean checkout; the release verification runs it after a build.
 */
describe('production bundle', () => {
    const dist = join(ROOT, 'dist');
    const built = existsSync(dist);

    it.runIf(built)('contains no handbook content of any kind', () => {
        const files: string[] = [];
        (function walk(d: string) {
            for (const f of readdirSync(d)) {
                const p = join(d, f);
                if (statSync(p).isDirectory()) walk(p);
                else files.push(p);
            }
        })(dist);

        const haystack = files.map((f) => readFileSync(f, 'utf8')).join('\n');
        const leaked = PRIVATE_MARKERS.filter((m) => haystack.includes(m));
        expect(leaked).toEqual([]);
    });

    it.runIf(built)('emits no per-chapter JS chunk', () => {
        const assets = readdirSync(join(dist, 'assets'));
        expect(assets.filter((f) => /^\d{2}-.*\.js$/.test(f))).toEqual([]);
    });

    it.runIf(built)('still contains the public portfolio content', () => {
        const assets = readdirSync(join(dist, 'assets'));
        const main = assets.find((f) => /^index-.*\.js$/.test(f))!;
        const js = readFileSync(join(dist, 'assets', main), 'utf8');
        expect(js).toContain('Three Questions Were Not the Problem');
    });
});
