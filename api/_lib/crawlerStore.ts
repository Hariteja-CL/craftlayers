/**
 * Durable storage for crawler hits, on Vercel Blob.
 *
 * WHY THE DATA LIVES IN THE BLOB PATHNAME.
 *
 * Blob has no append operation. Accumulating hits into one file per day would
 * mean read-modify-write on every request, which races and loses rows under
 * concurrent crawls. Writing one small object per hit avoids that completely —
 * every write is independent.
 *
 * The catch is reading: `list()` returns pathnames, so fetching a body per hit
 * would be one network round trip per row. Encoding the whole summary into the
 * pathname means a single `list()` call returns every field the tracker needs,
 * with no body fetches at all. The body still holds the truncated user-agent
 * for drill-down, but nothing in the dashboard requires reading it.
 *
 * WHAT IS DELIBERATELY NOT STORED: IP addresses, cookies, authorization
 * headers, and query strings. See sanitizePath in ./crawlers.ts — the query
 * string is dropped rather than filtered, so a sensitive value cannot reach
 * storage by being in a parameter nobody thought to add to a denylist.
 *
 * There is no per-visitor deduplication, and so no IP hashing, because
 * nothing here needs to distinguish two Googlebot fetches from one. If that
 * changes, the privacy-preserving option is a daily-rotating salted hash
 * truncated to 8 bytes — not a stored address.
 */
import { list, put } from '@vercel/blob';
import type { CrawlerCategory } from './crawlers.js';

const PREFIX = 'crawlers/';

export interface CrawlerHit {
    at: number;
    path: string;
    family: string;
    category: CrawlerCategory;
}

/** True when a Blob store has been provisioned for this deployment. Every
 *  entry point checks this so an unprovisioned deployment degrades to a
 *  no-op rather than throwing on each request. */
export function isStoreConfigured(): boolean {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Percent-encode a pathname segment so it cannot contain the `__` separator.
 *
 * encodeURIComponent leaves `_` alone, so a path such as `/a__b` would
 * otherwise split into the wrong number of fields and corrupt the row.
 */
function encodeSegment(value: string): string {
    return encodeURIComponent(value).replace(/_/g, '%5F');
}

function decodeSegment(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function dayKey(at: number): string {
    return new Date(at).toISOString().slice(0, 10);
}

/**
 * Record one hit. Never throws — a storage failure must not turn into a failed
 * response for the crawler, which would look like an outage to a search engine.
 */
export async function recordHit(hit: CrawlerHit, userAgent: string): Promise<void> {
    if (!isStoreConfigured()) return;

    const id = `${hit.at}-${Math.random().toString(36).slice(2, 8)}`;
    const name = [
        id,
        encodeSegment(hit.category),
        encodeSegment(hit.family),
        encodeSegment(hit.path),
    ].join('__');

    try {
        await put(`${PREFIX}${dayKey(hit.at)}/${name}.json`, JSON.stringify({ ua: userAgent }), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
        });
    } catch {
        // Intentionally swallowed. Losing an analytics row is always
        // preferable to degrading the response.
    }
}

/** Parse a stored pathname back into a hit. Returns null for anything that
 *  does not match the current layout, so an older or hand-made object cannot
 *  break the whole listing. */
export function parseHitPathname(pathname: string): CrawlerHit | null {
    if (!pathname.startsWith(PREFIX) || !pathname.endsWith('.json')) return null;

    const name = pathname.slice(PREFIX.length, -'.json'.length);
    const slash = name.indexOf('/');
    if (slash === -1) return null;

    const parts = name.slice(slash + 1).split('__');
    if (parts.length !== 4) return null;

    const [id, category, family, path] = parts;
    const at = Number(id.split('-')[0]);
    if (!Number.isFinite(at)) return null;

    return {
        at,
        category: decodeSegment(category) as CrawlerCategory,
        family: decodeSegment(family),
        path: decodeSegment(path),
    };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LOOKBACK_DAYS = 30;

/** Guard against one pathological day costing an unbounded number of list
 *  calls. 20 pages of 1000 is far beyond anything a portfolio will see. */
const MAX_PAGES_PER_DAY = 20;

/**
 * Read hits, newest first.
 *
 * WHY THIS WALKS DAY PREFIXES INSTEAD OF LISTING THE WHOLE STORE.
 *
 * Vercel does not document the sort order of `list()`. An earlier version
 * listed `crawlers/` globally, took the first N results and sorted them
 * afterwards — which is only correct if the API happens to return newest
 * first. Past a couple of thousand objects that would have shown a stale
 * window while labelling it "recent activity", and it would have broken
 * silently if Vercel ever changed the order.
 *
 * Walking `crawlers/YYYY-MM-DD/` from today backwards removes the assumption
 * entirely: recency comes from the prefix we choose, not from the API. Each
 * day is read in full and sorted before being appended, so ordering within a
 * day does not matter either.
 *
 * It also bounds the work. Only the days needed to satisfy `limit` are
 * listed, so the whole store is never scanned no matter how large it grows —
 * which is what makes the absence of a retention policy tolerable for now.
 */
export async function readHits(
    limit = 1000,
    lookbackDays = DEFAULT_LOOKBACK_DAYS,
    now = Date.now(),
): Promise<CrawlerHit[]> {
    if (!isStoreConfigured()) return [];

    const hits: CrawlerHit[] = [];

    for (let dayOffset = 0; dayOffset < lookbackDays && hits.length < limit; dayOffset++) {
        const prefix = `${PREFIX}${dayKey(now - dayOffset * DAY_MS)}/`;
        const forDay: CrawlerHit[] = [];
        let cursor: string | undefined;
        let pages = 0;

        do {
            const page = await list({ prefix, limit: 1000, cursor });
            for (const blob of page.blobs) {
                const hit = parseHitPathname(blob.pathname);
                if (hit) forDay.push(hit);
            }
            cursor = page.hasMore ? page.cursor : undefined;
            pages += 1;
        } while (cursor && pages < MAX_PAGES_PER_DAY);

        // Sorted per day, so a day returned in any order still contributes
        // its newest hits first.
        forDay.sort((a, b) => b.at - a.at);
        hits.push(...forDay);
    }

    return hits.slice(0, limit);
}
