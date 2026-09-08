/**
 * Crawler statistics, served only to an authenticated session.
 *
 * The underlying rows are not secret — they are user-agent strings and public
 * URL paths — but they are operational data about the site, so they sit behind
 * the same session gate as the dashboard rather than being world-readable.
 *
 * Aggregation happens here rather than in the browser so the client receives a
 * small summary instead of thousands of raw rows.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasValidSession } from './_lib/session.js';
import { isStoreConfigured, readHits, type CrawlerHit } from './_lib/crawlerStore.js';
import type { CrawlerCategory } from './_lib/crawlers.js';

/** How many rows to read. Bounds cost and response size; the view only ever
 *  shows recent activity, so older rows would not be displayed anyway. */
const READ_LIMIT = 2000;
const RECENT_COUNT = 50;
const TOP_PAGES = 15;

export interface CrawlerStats {
    configured: boolean;
    totals: {
        requests: number;
        families: number;
        byCategory: Record<CrawlerCategory, number>;
    };
    families: { family: string; category: CrawlerCategory; count: number; lastSeen: number }[];
    topPages: { path: string; count: number }[];
    recent: CrawlerHit[];
    firstSeen: number | null;
}

function tally<T extends string>(counts: Map<T, number>, key: T): void {
    counts.set(key, (counts.get(key) ?? 0) + 1);
}

export function summarise(hits: CrawlerHit[]): Omit<CrawlerStats, 'configured'> {
    const byCategory: Record<CrawlerCategory, number> = {
        search: 0,
        ai: 0,
        social: 0,
        monitoring: 0,
        unknown: 0,
    };

    const families = new Map<string, { category: CrawlerCategory; count: number; lastSeen: number }>();
    const pages = new Map<string, number>();
    let firstSeen: number | null = null;

    for (const hit of hits) {
        if (hit.category in byCategory) byCategory[hit.category] += 1;
        tally(pages, hit.path);

        const existing = families.get(hit.family);
        if (existing) {
            existing.count += 1;
            existing.lastSeen = Math.max(existing.lastSeen, hit.at);
        } else {
            families.set(hit.family, { category: hit.category, count: 1, lastSeen: hit.at });
        }

        if (firstSeen === null || hit.at < firstSeen) firstSeen = hit.at;
    }

    return {
        totals: { requests: hits.length, families: families.size, byCategory },
        families: [...families.entries()]
            .map(([family, v]) => ({ family, ...v }))
            .sort((a, b) => b.count - a.count),
        topPages: [...pages.entries()]
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, TOP_PAGES),
        recent: hits.slice(0, RECENT_COUNT),
        firstSeen,
    };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!hasValidSession(req.headers.cookie)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // `configured: false` is reported honestly rather than as an empty
    // dataset, so the view can say "no store provisioned" instead of
    // implying that no crawler has ever visited.
    if (!isStoreConfigured()) {
        return res.status(200).json({
            configured: false,
            totals: { requests: 0, families: 0, byCategory: { search: 0, ai: 0, social: 0, monitoring: 0, unknown: 0 } },
            families: [],
            topPages: [],
            recent: [],
            firstSeen: null,
        } satisfies CrawlerStats);
    }

    try {
        const hits = await readHits(READ_LIMIT);
        return res.status(200).json({ configured: true, ...summarise(hits) } satisfies CrawlerStats);
    } catch {
        return res.status(502).json({ error: 'Could not read crawler store' });
    }
}
