/**
 * Crawler identification and privacy sanitisation.
 *
 * Pure functions, no I/O, no environment access — so this module is fully
 * testable and is safe to import from both the middleware (Edge runtime) and
 * the stats endpoint (Node runtime).
 *
 * TWO THINGS THIS DELIBERATELY DOES NOT DO.
 *
 * It does not verify identity. A user-agent string is self-reported and
 * trivially forged: anything can call itself Googlebot. Real verification
 * needs reverse DNS or a published IP range check, which is out of scope
 * here. Everything this module returns is a CLAIMED identity, and the
 * tracker view labels it that way.
 *
 * It does not classify humans. `classifyUserAgent` returns null for ordinary
 * browsers, and the caller stores nothing at all in that case. Human traffic
 * never reaches storage, which is both the privacy position and the reason
 * this stays cheap.
 */

export type CrawlerCategory = 'search' | 'ai' | 'social' | 'monitoring' | 'unknown';

export interface CrawlerIdentity {
    /** Display name for the crawler family, e.g. "Googlebot". */
    family: string;
    category: CrawlerCategory;
}

interface Signature {
    /** Matched case-insensitively as a plain substring of the user-agent. */
    token: string;
    family: string;
    category: CrawlerCategory;
}

/**
 * Order matters. The first match wins, so more specific tokens must come
 * before the prefixes they extend — `Applebot-Extended` (Apple's AI training
 * crawler) has to be tested before `Applebot` (Apple's search crawler), or
 * every AI fetch would be miscounted as search traffic. The same applies to
 * the Claude and OpenAI families, where a user-initiated fetch and a training
 * crawler share a prefix but mean very different things.
 */
const SIGNATURES: Signature[] = [
    // --- AI crawlers ------------------------------------------------------
    // Split by intent where the operator publishes distinct agents: a
    // training crawler, a search index, and a fetch made because a person
    // asked a question right now.
    { token: 'GPTBot', family: 'GPTBot', category: 'ai' },
    { token: 'ChatGPT-User', family: 'ChatGPT-User', category: 'ai' },
    { token: 'OAI-SearchBot', family: 'OAI-SearchBot', category: 'ai' },
    { token: 'Claude-SearchBot', family: 'Claude-SearchBot', category: 'ai' },
    { token: 'Claude-User', family: 'Claude-User', category: 'ai' },
    { token: 'ClaudeBot', family: 'ClaudeBot', category: 'ai' },
    { token: 'anthropic-ai', family: 'anthropic-ai', category: 'ai' },
    { token: 'Perplexity-User', family: 'Perplexity-User', category: 'ai' },
    { token: 'PerplexityBot', family: 'PerplexityBot', category: 'ai' },
    { token: 'Applebot-Extended', family: 'Applebot-Extended', category: 'ai' },
    { token: 'meta-externalagent', family: 'Meta-ExternalAgent', category: 'ai' },
    { token: 'Bytespider', family: 'Bytespider', category: 'ai' },
    // Common Crawl is a general-purpose archive, but in practice its corpus
    // is a primary training input, so it is counted here rather than as an
    // unknown bot.
    { token: 'CCBot', family: 'CCBot', category: 'ai' },

    // --- Search crawlers --------------------------------------------------
    { token: 'Googlebot', family: 'Googlebot', category: 'search' },
    { token: 'Storebot-Google', family: 'Storebot-Google', category: 'search' },
    { token: 'Google-InspectionTool', family: 'Google-InspectionTool', category: 'search' },
    { token: 'BingPreview', family: 'BingPreview', category: 'search' },
    { token: 'bingbot', family: 'Bingbot', category: 'search' },
    { token: 'Applebot', family: 'Applebot', category: 'search' },
    { token: 'DuckDuckBot', family: 'DuckDuckBot', category: 'search' },
    { token: 'DuckDuckGo-Favicons-Bot', family: 'DuckDuckBot', category: 'search' },
    { token: 'YandexBot', family: 'YandexBot', category: 'search' },
    { token: 'Baiduspider', family: 'Baiduspider', category: 'search' },
    { token: 'Slurp', family: 'Yahoo! Slurp', category: 'search' },

    // --- Social / link preview -------------------------------------------
    // These fire when someone pastes a link into a chat or a post. They are
    // a useful signal that a page is being shared, which is why they are
    // kept separate from search.
    { token: 'LinkedInBot', family: 'LinkedInBot', category: 'social' },
    { token: 'Twitterbot', family: 'Twitterbot', category: 'social' },
    { token: 'facebookexternalhit', family: 'FacebookExternalHit', category: 'social' },
    { token: 'WhatsApp', family: 'WhatsApp', category: 'social' },
    { token: 'Slackbot', family: 'Slackbot', category: 'social' },
    { token: 'Discordbot', family: 'Discordbot', category: 'social' },
    { token: 'TelegramBot', family: 'TelegramBot', category: 'social' },
    { token: 'redditbot', family: 'Redditbot', category: 'social' },
    { token: 'Pinterestbot', family: 'Pinterestbot', category: 'social' },

    // --- Monitoring / tooling --------------------------------------------
    { token: 'Chrome-Lighthouse', family: 'Lighthouse', category: 'monitoring' },
    { token: 'UptimeRobot', family: 'UptimeRobot', category: 'monitoring' },
    { token: 'Pingdom', family: 'Pingdom', category: 'monitoring' },
    { token: 'StatusCake', family: 'StatusCake', category: 'monitoring' },
    { token: 'Site24x7', family: 'Site24x7', category: 'monitoring' },
    { token: 'GTmetrix', family: 'GTmetrix', category: 'monitoring' },
    { token: 'vercel-screenshot', family: 'Vercel', category: 'monitoring' },
    { token: 'vercel-favicon', family: 'Vercel', category: 'monitoring' },
    { token: 'curl/', family: 'curl', category: 'monitoring' },
    { token: 'Wget/', family: 'Wget', category: 'monitoring' },
    { token: 'python-requests', family: 'python-requests', category: 'monitoring' },
    { token: 'Go-http-client', family: 'Go-http-client', category: 'monitoring' },
    { token: 'node-fetch', family: 'node-fetch', category: 'monitoring' },
];

/**
 * Catches automated traffic that matches no known signature.
 *
 * `bot` is matched only at a token edge so that ordinary words ending in
 * those letters do not trip it. This is not paranoia: "Cubot" is a real
 * phone brand that appears in genuine Android browser user-agents, and a
 * naive /bot/i would file every one of those visitors as a crawler.
 */
const GENERIC_BOT = /(?:bot\b|bot[/\s;)]|crawler|crawling|spider|feedfetcher|scrapy)/i;

/** Substrings that contain "bot" but belong to human devices or browsers. */
const NOT_A_BOT = /\bcubot\b/i;

const MAX_UA_LENGTH = 200;
const MAX_PATH_LENGTH = 256;

/**
 * Identify a crawler from its user-agent.
 *
 * Returns null when the agent is not recognisably automated — which is the
 * signal to the caller that nothing should be recorded. Missing, empty and
 * malformed agents all return an `unknown` bot rather than null: a request
 * with no user-agent at all is not a normal browser, and is worth seeing.
 */
export function classifyUserAgent(userAgent: string | null | undefined): CrawlerIdentity | null {
    if (typeof userAgent !== 'string') return { family: 'No user-agent', category: 'unknown' };

    const ua = userAgent.trim();
    if (ua === '') return { family: 'No user-agent', category: 'unknown' };

    for (const sig of SIGNATURES) {
        if (ua.toLowerCase().includes(sig.token.toLowerCase())) {
            return { family: sig.family, category: sig.category };
        }
    }

    if (NOT_A_BOT.test(ua)) return null;
    if (GENERIC_BOT.test(ua)) return { family: 'Unrecognised bot', category: 'unknown' };

    return null;
}

/**
 * Reduce a request path to something safe to store.
 *
 * The query string is dropped entirely rather than filtered. Deciding which
 * parameters are sensitive is a judgement that would have to be revisited
 * every time a link format changes, and crawler analysis does not need them.
 */
export function sanitizePath(rawUrl: string): string {
    let pathname: string;
    try {
        pathname = new URL(rawUrl, 'https://placeholder.invalid').pathname;
    } catch {
        return '/malformed';
    }
    if (pathname === '') pathname = '/';
    return pathname.length > MAX_PATH_LENGTH ? pathname.slice(0, MAX_PATH_LENGTH) + '…' : pathname;
}

/** Truncated so a hostile agent cannot pad storage with a megabyte of text. */
export function truncateUserAgent(userAgent: string | null | undefined): string {
    if (typeof userAgent !== 'string' || userAgent.trim() === '') return '(none)';
    const ua = userAgent.trim();
    return ua.length > MAX_UA_LENGTH ? ua.slice(0, MAX_UA_LENGTH) + '…' : ua;
}

/**
 * Paths that say nothing about discoverability.
 *
 * Build assets and Vercel's internal endpoints would dominate the "top pages"
 * table without telling you anything about whether your case studies are
 * being read.
 */
export function isIgnorablePath(pathname: string): boolean {
    return (
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/_vercel/') ||
        pathname.startsWith('/api/') ||
        /\.(js|css|map|png|jpe?g|svg|webp|ico|woff2?|ttf)$/i.test(pathname)
    );
}

export const CATEGORY_LABELS: Record<CrawlerCategory, string> = {
    search: 'Search crawler',
    ai: 'AI crawler',
    social: 'Social / link preview',
    monitoring: 'Monitoring / tooling',
    unknown: 'Unknown bot',
};
