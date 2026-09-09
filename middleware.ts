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
 * It never changes what a page returns. Every path ends in `next()`, so the
 * request continues exactly as it would without this file; the only difference
 * is a diagnostic response header, and only for automated clients. A storage
 * failure is caught and reported, never rethrown, so it cannot break a page.
 *
 * Human traffic is discarded here and never reaches storage. That is the
 * privacy position, and it is also why this stays cheap: the write path only
 * runs for the small fraction of requests that are automated.
 */
import { next } from '@vercel/functions';
import { classifyUserAgent, isIgnorablePath, sanitizePath, truncateUserAgent } from './api/_lib/crawlers.js';
import { recordHit } from './api/_lib/crawlerStore.js';

/**
 * `runtime` is set explicitly. The file convention defaults to the Edge
 * runtime, which Vercel has deprecated — its build warns and tells you to
 * migrate. Node.js is also the better fit here: `@vercel/blob` and
 * `process.env` are first-class on it, and a bot's request is not latency
 * sensitive.
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

/**
 * The write is AWAITED rather than handed to `waitUntil`.
 *
 * Under the Edge runtime `waitUntil` reliably keeps the invocation alive after
 * the response. Under the Node.js runtime it resolves an ambient context that
 * is not always present, and when it is missing the promise is simply dropped —
 * which is indistinguishable from a working write that recorded nothing. That
 * is the failure this replaced.
 *
 * Awaiting costs a crawler a few hundred milliseconds. Nothing here is latency
 * sensitive for a bot, and a correct count is worth more than that.
 *
 * `x-cl-crawler` reports what happened, and is set only for automated clients —
 * a human's response is untouched. It carries no credential: `describeError`
 * redacts any long opaque run before the message can reach a header. It exists
 * because this deployment has no readable logs, so without it a dead write path
 * looks exactly like an unvisited site.
 */
export default async function middleware(request: Request) {
    let outcome: string | null = null;

    // Wrapped whole. Capture is best-effort telemetry; if anything in here
    // throws, the visitor must still get their page.
    try {
        const userAgent = request.headers.get('user-agent');
        const identity = classifyUserAgent(userAgent);

        // null means an ordinary browser. Nothing is recorded, no header is
        // set, and no further work happens on the request.
        if (identity) {
            const path = sanitizePath(request.url);
            if (isIgnorablePath(path)) {
                outcome = 'ignored-path';
            } else {
                const result = await recordHit(
                    { at: Date.now(), path, family: identity.family, category: identity.category },
                    truncateUserAgent(userAgent),
                );
                outcome = `${identity.category}/${identity.family} ${result}`;
            }
        }
    } catch (err) {
        outcome = `middleware-error: ${err instanceof Error ? err.name : 'unknown'}`;
    }

    return outcome ? next({ headers: { 'x-cl-crawler': outcome } }) : next();
}
