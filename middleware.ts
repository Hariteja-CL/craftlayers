/**
 * Crawler capture.
 *
 * WHY THIS EXISTS AT THE EDGE AND NOT IN THE APP.
 *
 * CraftLayers is a static SPA. Crawlers do not run JavaScript, so no
 * client-side analytics — GA4 included — can see them; GA4 additionally
 * filters known bots out of its own reports by design. Routing Middleware is
 * the only layer in this stack that observes the raw request, and it runs
 * before the CDN cache, so it still sees a hit that is served statically —
 * cache hits included.
 *
 * WHAT THIS DOES NOT DO.
 *
 * It never alters the response. Every path returns `next()`, so the request
 * continues exactly as it would without this file. Storage happens inside
 * `waitUntil`, which runs after the response has been sent — a slow or failing
 * Blob write cannot delay or break a page, which matters most for the search
 * crawlers whose opinion of the site depends on it responding quickly.
 *
 * Human traffic is discarded here and never reaches storage. That is the
 * privacy position, and it is also why this stays cheap: the write path only
 * runs for the small fraction of requests that are automated.
 */
import { next, waitUntil } from '@vercel/functions';
import { classifyUserAgent, isIgnorablePath, sanitizePath, truncateUserAgent } from './api/_lib/crawlers.js';
import { recordHit } from './api/_lib/crawlerStore.js';

/**
 * `runtime` is set explicitly. The file convention defaults to the Edge
 * runtime, which Vercel has deprecated — its build warns and tells you to
 * migrate. Node.js is also the better fit here: `@vercel/blob` and
 * `process.env` are first-class on it, and none of this work is latency
 * sensitive because it happens after the response is sent.
 *
 * `matcher` skips build assets, the API and Vercel's own endpoints. Filtering
 * here rather than in code means the middleware is not invoked at all for
 * those paths, so they cost nothing. `isIgnorablePath` still runs below as a
 * second line of defence, because this pattern is easy to get subtly wrong
 * and a miss would flood the "top pages" table with .js files.
 */
export const config = {
    runtime: 'nodejs',
    matcher: ['/((?!api/|assets/|_vercel/|favicon\\.ico).*)'],
};

export default function middleware(request: Request) {
    // Wrapped whole. Capture is best-effort telemetry; if anything in here
    // throws, the visitor must still get their page.
    try {
        const identity = classifyUserAgent(request.headers.get('user-agent'));

        // null means an ordinary browser. Nothing is recorded, and no
        // further work happens on the request.
        if (identity) {
            const path = sanitizePath(request.url);
            if (!isIgnorablePath(path)) {
                waitUntil(
                    recordHit(
                        { at: Date.now(), path, family: identity.family, category: identity.category },
                        truncateUserAgent(request.headers.get('user-agent')),
                    ),
                );
            }
        }
    } catch {
        // Deliberately silent.
    }

    return next();
}
