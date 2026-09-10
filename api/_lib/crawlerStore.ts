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
import { get, list, put } from '@vercel/blob';
import { MAX_UA_LENGTH, type CrawlerCategory } from './crawlers.js';

const PREFIX = 'crawlers/';

export interface CrawlerHit {
    at: number;
    path: string;
    family: string;
    category: CrawlerCategory;
    /**
     * The user-agent as it was stored, present only on rows something asked
     * for it. Reading it costs one Blob body fetch per row, so it is attached
     * to the recent slice and never to the aggregation set — see
     * `attachUserAgents`.
     */
    userAgent?: string;
}

/**
 * A hit plus the Blob pathname it was parsed from.
 *
 * The pathname is the address needed to read the body, and nothing more: it
 * encodes only fields that are already sitting beside it. It stays internal
 * to the store and the stats endpoint, and `attachUserAgents` drops it before
 * anything reaches a client.
 */
export interface StoredHit extends CrawlerHit {
    pathname: string;
}

/**
 * True when a Blob store has been provisioned for this deployment. Every entry
 * point checks this so an unprovisioned deployment degrades to a no-op rather
 * than throwing on each request.
 *
 * BOTH of the SDK's credential paths count. `@vercel/blob` resolves auth in
 * this order (see `resolveBlobAuth`): an explicit token, then OIDC — a Vercel
 * runtime token plus `BLOB_STORE_ID` — and only then `BLOB_READ_WRITE_TOKEN`.
 * Connecting a store through the current Vercel integration provisions the
 * OIDC pair and no read-write token at all, so checking only for the latter
 * reports a correctly configured store as missing and silently drops every
 * hit. This function must stay in step with what the SDK actually accepts.
 *
 * If the OIDC token is somehow unavailable at runtime the SDK throws, which
 * `recordHit` swallows — so a false positive here degrades to a lost row, never
 * to a failed response.
 */
export function isStoreConfigured(): boolean {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
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

/** What happened to a write. Returned rather than thrown, so the caller can
 *  surface it without any risk of breaking the response. */
export type RecordOutcome = 'ok' | 'no-store' | `error:${string}`;

/**
 * Describe a failure without leaking a credential.
 *
 * Blob errors are about missing or rejected credentials rather than their
 * values, but the message is third-party text, so any long opaque run is
 * redacted before it can reach a response header.
 */
function describeError(err: unknown): string {
    if (!(err instanceof Error)) return 'unknown';
    const msg = err.message.replace(/[A-Za-z0-9_-]{24,}/g, '<redacted>');
    return `${err.name}: ${msg}`.slice(0, 160);
}

/**
 * Record one hit. Never throws — a storage failure must not turn into a failed
 * response for the crawler, which would look like an outage to a search engine.
 *
 * It does, however, REPORT. An earlier version swallowed every error silently,
 * which meant a completely dead write path was indistinguishable from "no
 * crawler has visited yet" — and with no log access that is close to
 * undebuggable. The outcome is returned so the caller can decide what to do
 * with it.
 */
export async function recordHit(hit: CrawlerHit, userAgent: string): Promise<RecordOutcome> {
    if (!isStoreConfigured()) return 'no-store';

    const id = `${hit.at}-${Math.random().toString(36).slice(2, 8)}`;
    const name = [
        id,
        encodeSegment(hit.category),
        encodeSegment(hit.family),
        encodeSegment(hit.path),
    ].join('__');

    try {
        // `access: 'private'` is both required and correct here.
        //
        // Required because the store is provisioned as private, and the SDK
        // rejects a public write against it outright — which is what silently
        // dropped every hit until the write path started reporting its errors.
        //
        // Correct because these objects should never have been public. The
        // pathname encodes the requested path, the crawler family and its
        // category, and the body holds the user-agent; a public blob exposes
        // all of that at a guessable URL to anyone. Operational data about the
        // site belongs behind the same gate as the dashboard that reads it.
        await put(`${PREFIX}${dayKey(hit.at)}/${name}.json`, JSON.stringify({ ua: userAgent }), {
            access: 'private',
            contentType: 'application/json',
            addRandomSuffix: false,
        });
        return 'ok';
    } catch (err) {
        // Reported, never rethrown. Losing an analytics row is always
        // preferable to degrading the response.
        return `error:${describeError(err)}`;
    }
}

/** Parse a stored pathname back into a hit. Returns null for anything that
 *  does not match the current layout, so an older or hand-made object cannot
 *  break the whole listing. */
export function parseHitPathname(pathname: string): StoredHit | null {
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
        pathname,
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
): Promise<StoredHit[]> {
    if (!isStoreConfigured()) return [];

    const hits: StoredHit[] = [];

    for (let dayOffset = 0; dayOffset < lookbackDays && hits.length < limit; dayOffset++) {
        const prefix = `${PREFIX}${dayKey(now - dayOffset * DAY_MS)}/`;
        const forDay: StoredHit[] = [];
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

/**
 * The most Blob bodies a single dashboard load may read.
 *
 * Bounded on purpose, and the bound is the whole design. Aggregation runs over
 * up to 2,000 rows and stays pathname-only; reading a body per row would turn
 * one page view into thousands of round trips, which is exactly the N+1 this
 * cap exists to prevent. Only the recent slice — the rows a person actually
 * reads — pays for bodies.
 */
export const MAX_USER_AGENT_READS = 50;

/** Bodies are read in parallel, but not all at once. */
const USER_AGENT_READ_CONCURRENCY = 10;

/**
 * Clean a stored user-agent before it can reach a dashboard.
 *
 * A user-agent is attacker-controlled text. The write path truncates it but
 * does not sanitise it, so control characters are stripped here and the
 * length is re-clamped rather than trusted — a body written by an older
 * version, or by hand, cannot return an unbounded or terminal-hostile string.
 *
 * Clamping to `MAX_UA_LENGTH` is idempotent against what the write path
 * produces: slicing a 200-characters-plus-ellipsis value back to 200 yields
 * the original 200 characters.
 */
function cleanStoredUserAgent(raw: unknown): string | undefined {
    if (typeof raw !== 'string') return undefined;
    const cleaned = raw
        .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (cleaned === '') return undefined;
    return cleaned.length > MAX_UA_LENGTH ? cleaned.slice(0, MAX_UA_LENGTH) + '…' : cleaned;
}

/**
 * Read one hit's stored user-agent. Never throws.
 *
 * Every failure resolves to undefined and the row is simply shown without a
 * user-agent: a deleted object, a 304 carrying no body, a body that is not
 * JSON, a body whose shape changed, a store that rejects the read. A
 * diagnostic detail is never worth a failed dashboard.
 */
async function readStoredUserAgent(pathname: string): Promise<string | undefined> {
    try {
        const result = await get(pathname, { access: 'private' });
        if (!result || result.statusCode !== 200 || !result.stream) return undefined;
        const parsed: unknown = JSON.parse(await new Response(result.stream).text());
        if (typeof parsed !== 'object' || parsed === null) return undefined;
        return cleanStoredUserAgent((parsed as Record<string, unknown>).ua);
    } catch {
        return undefined;
    }
}

/**
 * Attach stored user-agents to a slice of hits, and drop the Blob pathname.
 *
 * This is the reason the tracker can name an unknown bot at all. `recordHit`
 * has written the user-agent into every body since the tracker shipped, but
 * each read reconstructed its rows from the pathname alone — so the strings
 * were stored and unreachable, and the dashboard could count 29 requests from
 * an "Unrecognised bot" without ever saying what it called itself. That is
 * the same class of defect as trap 12: data captured in a form nothing can
 * report.
 *
 * Order is preserved regardless of which reads finish first — index `i` of
 * the result is index `i` of the input.
 */
export async function attachUserAgents(hits: StoredHit[]): Promise<CrawlerHit[]> {
    const slice = hits.slice(0, MAX_USER_AGENT_READS);
    const out: CrawlerHit[] = slice.map(({ at, path, family, category }) => ({
        at,
        path,
        family,
        category,
    }));

    if (!isStoreConfigured()) return out;

    // A work-stealing pool: each worker takes the next unclaimed index, so a
    // slow read delays only itself rather than a whole fixed-size batch.
    let next = 0;
    const worker = async () => {
        for (let i = next++; i < slice.length; i = next++) {
            const userAgent = await readStoredUserAgent(slice[i].pathname);
            if (userAgent !== undefined) out[i] = { ...out[i], userAgent };
        }
    };

    await Promise.all(
        Array.from({ length: Math.min(USER_AGENT_READ_CONCURRENCY, slice.length) }, worker),
    );

    return out;
}
