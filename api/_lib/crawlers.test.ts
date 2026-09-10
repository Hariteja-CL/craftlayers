import { describe, expect, it } from 'vitest';
import {
    classifyUserAgent,
    isIgnorablePath,
    sanitizePath,
    truncateUserAgent,
} from './crawlers.js';

/** Real-world user-agent strings, kept verbatim so the tests fail if the
 *  matching logic drifts away from what agents actually send. */
const UA = {
    googlebot:
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    gptbot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot',
    chatgptUser:
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
    oaiSearch:
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot',
    claudebot: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
    claudeUser: 'Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)',
    perplexity: 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    applebot: 'Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)',
    applebotExtended: 'Mozilla/5.0 (compatible; Applebot-Extended/0.1; +http://www.apple.com/go/applebot)',
    duckduck: 'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)',
    yandex: 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
    baidu: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    linkedin: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
    twitterbot: 'Twitterbot/1.0',
    facebook: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    uptimerobot: 'Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)',
    curl: 'curl/8.4.0',
    // Humans
    chrome:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    safariIphone:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    firefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    // A real Android phone whose brand name ends in "bot".
    cubot: 'Mozilla/5.0 (Linux; Android 11; CUBOT NOTE 20 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0 Mobile Safari/537.36',
};

describe('classifyUserAgent — search crawlers', () => {
    it.each([
        [UA.googlebot, 'Googlebot'],
        [UA.bingbot, 'Bingbot'],
        [UA.applebot, 'Applebot'],
        [UA.duckduck, 'DuckDuckBot'],
        [UA.yandex, 'YandexBot'],
        [UA.baidu, 'Baiduspider'],
    ])('identifies %s as a search crawler', (ua, family) => {
        expect(classifyUserAgent(ua)).toEqual({ family, category: 'search' });
    });
});

describe('classifyUserAgent — AI crawlers', () => {
    it.each([
        [UA.gptbot, 'GPTBot'],
        [UA.chatgptUser, 'ChatGPT-User'],
        [UA.oaiSearch, 'OAI-SearchBot'],
        [UA.claudebot, 'ClaudeBot'],
        [UA.claudeUser, 'Claude-User'],
        [UA.perplexity, 'PerplexityBot'],
    ])('identifies %s as an AI crawler', (ua, family) => {
        expect(classifyUserAgent(ua)).toEqual({ family, category: 'ai' });
    });

    /** The signature order exists for exactly this pair. Apple's AI training
     *  agent extends the search agent's name, so a substring match in the
     *  wrong order silently files AI traffic as search. */
    it('does not confuse Applebot-Extended with Applebot', () => {
        expect(classifyUserAgent(UA.applebotExtended)).toEqual({
            family: 'Applebot-Extended',
            category: 'ai',
        });
        expect(classifyUserAgent(UA.applebot)).toEqual({
            family: 'Applebot',
            category: 'search',
        });
    });

    /** Both Claude agents carry "Claude", and the user-initiated one must not
     *  be collapsed into the training crawler. */
    it('separates Claude-User from ClaudeBot', () => {
        expect(classifyUserAgent(UA.claudeUser)?.family).toBe('Claude-User');
        expect(classifyUserAgent(UA.claudebot)?.family).toBe('ClaudeBot');
    });
});

describe('classifyUserAgent — social and monitoring', () => {
    it.each([
        [UA.linkedin, 'LinkedInBot'],
        [UA.twitterbot, 'Twitterbot'],
        [UA.facebook, 'FacebookExternalHit'],
    ])('identifies %s as a social bot', (ua, family) => {
        expect(classifyUserAgent(ua)).toEqual({ family, category: 'social' });
    });

    it.each([
        [UA.uptimerobot, 'UptimeRobot'],
        [UA.curl, 'curl'],
    ])('identifies %s as monitoring/tooling', (ua, family) => {
        expect(classifyUserAgent(ua)).toEqual({ family, category: 'monitoring' });
    });
});

describe('classifyUserAgent — humans are never classified as bots', () => {
    it.each([
        ['Chrome on Windows', UA.chrome],
        ['Safari on iPhone', UA.safariIphone],
        ['Firefox on macOS', UA.firefox],
    ])('returns null for %s', (_label, ua) => {
        expect(classifyUserAgent(ua)).toBeNull();
    });

    /** Regression guard. A naive /bot/i match files every CUBOT phone owner
     *  as a crawler, which both corrupts the counts and starts storing rows
     *  for real people. */
    it('returns null for a CUBOT phone, whose brand name ends in "bot"', () => {
        expect(classifyUserAgent(UA.cubot)).toBeNull();
    });
});

describe('classifyUserAgent — unknown and malformed agents', () => {
    it('flags an unrecognised bot rather than dropping it', () => {
        expect(classifyUserAgent('Mozilla/5.0 (compatible; SomeNewBot/3.0)')).toEqual({
            family: 'Unrecognised bot',
            category: 'unknown',
        });
    });

    it.each([
        ['a generic crawler', 'SuperCrawler/1.0'],
        ['a generic spider', 'archive-spider 2.2'],
    ])('flags %s as unknown', (_label, ua) => {
        expect(classifyUserAgent(ua)?.category).toBe('unknown');
    });

    it.each([
        ['undefined', undefined],
        ['null', null],
        ['empty string', ''],
        ['whitespace only', '   '],
    ])('treats %s as an unknown bot, not a human', (_label, ua) => {
        expect(classifyUserAgent(ua)).toEqual({ family: 'No user-agent', category: 'unknown' });
    });

    it('does not throw on a hostile or nonsense agent', () => {
        expect(() => classifyUserAgent('\u0000\u0001 %%% ' + 'x'.repeat(10_000))).not.toThrow();
    });
});

describe('sanitizePath — privacy', () => {
    it('drops the query string entirely', () => {
        expect(sanitizePath('/work/respondent-experience?token=abc123&email=a@b.com')).toBe(
            '/work/respondent-experience',
        );
    });

    it('drops the fragment', () => {
        expect(sanitizePath('/library#section-4')).toBe('/library');
    });

    it('keeps a plain path unchanged', () => {
        expect(sanitizePath('/work/dashboard-explainability')).toBe(
            '/work/dashboard-explainability',
        );
    });

    it('normalises an empty path to root', () => {
        expect(sanitizePath('https://www.craftlayers.com')).toBe('/');
    });

    it('truncates an absurdly long path', () => {
        const result = sanitizePath('/' + 'a'.repeat(5000));
        expect(result.length).toBeLessThanOrEqual(257);
        expect(result.endsWith('…')).toBe(true);
    });

    it('returns a marker instead of throwing on a malformed url', () => {
        expect(sanitizePath('http://[')).toBe('/malformed');
    });
});

describe('truncateUserAgent', () => {
    it('caps length so storage cannot be padded', () => {
        const result = truncateUserAgent('x'.repeat(5000));
        expect(result.length).toBeLessThanOrEqual(201);
    });

    it('marks a missing agent explicitly', () => {
        expect(truncateUserAgent(undefined)).toBe('(none)');
        expect(truncateUserAgent('')).toBe('(none)');
    });

    it('leaves a normal agent intact', () => {
        expect(truncateUserAgent(UA.googlebot)).toBe(UA.googlebot);
    });
});

describe('isIgnorablePath', () => {
    it.each(['/assets/index-abc123.js', '/_vercel/insights', '/api/chat', '/vite.svg', '/x.woff2'])(
        'ignores %s',
        (p) => expect(isIgnorablePath(p)).toBe(true),
    );

    /** These are protocol, not content. Every search crawler requests
     *  robots.txt and sitemap.xml first and often most, so counting them
     *  would top the "most crawled pages" table with files nobody reads. */
    it.each(['/robots.txt', '/sitemap.xml', '/404.html'])('ignores the non-content file %s', (p) => {
        expect(isIgnorablePath(p)).toBe(true);
    });

    it.each(['/fonts/x.otf', '/fonts/y.eot', '/z.OTF'])('ignores the font file %s', (p) => {
        expect(isIgnorablePath(p)).toBe(true);
    });

    it.each([
        '/',
        '/work/respondent-experience',
        '/work/dashboard-explainability',
        '/blog/secure-ux',
        '/profile',
        '/contact',
        // Public résumé content. Deliberately still counted — these are
        // portfolio pages, not protocol files.
        '/resume.html',
        '/resume-ats.html',
        '/Hariteja-Nandipati-Resume.pdf',
    ])('keeps %s', (p) => expect(isIgnorablePath(p)).toBe(false));

    /** Exact-match only. A page that merely ends in one of those names is
     *  still real content. */
    it('does not ignore a content path that merely resembles a protocol file', () => {
        expect(isIgnorablePath('/blog/robots.txt-explained')).toBe(false);
        expect(isIgnorablePath('/work/sitemap.xml.case-study')).toBe(false);
    });
});

/**
 * The private library must not appear in crawler storage.
 *
 * Recording it would write private route names — chapter slugs included — into
 * the tracker, and a crawl of a page nobody can read is not a discoverability
 * signal worth keeping. This was found live: an unrecognised bot walked every
 * chapter URL and each hit was being stored.
 */
describe('isIgnorablePath — private library', () => {
    it.each([
        '/library',
        '/library/ai-product-development',
        '/library/ai-product-development/retrieval-and-rag',
        '/library/ai-product-development/identity-authentication-authorization-rbac',
    ])('ignores %s', (p) => expect(isIgnorablePath(p)).toBe(true));

    /** Exact-match plus a trailing slash, so a public page whose name merely
     *  starts with "library" is still counted. */
    it('does not ignore a public path that only resembles the library', () => {
        expect(isIgnorablePath('/work/library-systems')).toBe(false);
        expect(isIgnorablePath('/blog/library-design')).toBe(false);
    });

    it('leaves public work and blog routes tracked', () => {
        for (const p of ['/work', '/work/respondent-experience', '/blog', '/blog/secure-ux', '/profile', '/']) {
            expect(isIgnorablePath(p)).toBe(false);
        }
    });
});

/**
 * SEO crawlers, added from observation rather than from a list.
 *
 * Both of these walked the sitemap on 2026-09-09 and were counted as
 * "Unrecognised bot" for a day, because the user-agent that would have named
 * them was stored in a Blob body nothing read. The strings below are the exact
 * ones recovered from that storage, kept verbatim.
 */
describe('classifyUserAgent — observed SEO crawlers', () => {
    /** Recovered from production storage, 26 requests on 2026-09-09. */
    const AHREFS = 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)';
    /** Recovered from production storage, 1 request on 2026-09-09. */
    const SEZNAM =
        'Mozilla/5.0 (compatible; SeznamBot/4.0; +https://o-seznam.cz/napoveda/vyhledavani/en/seznambot-crawler/)';

    it('identifies the exact AhrefsBot agent seen in production', () => {
        expect(classifyUserAgent(AHREFS)).toEqual({ family: 'AhrefsBot', category: 'search' });
    });

    it('identifies the exact SeznamBot agent seen in production', () => {
        expect(classifyUserAgent(SEZNAM)).toEqual({ family: 'SeznamBot', category: 'search' });
    });

    /** Matching is a case-insensitive substring test, so a vendor changing the
     *  capitalisation of its own name must not silently drop it back into
     *  "Unrecognised bot". */
    it.each([
        ['lower case', 'mozilla/5.0 (compatible; ahrefsbot/7.0; +http://ahrefs.com/robot/)', 'AhrefsBot'],
        ['upper case', 'MOZILLA/5.0 (COMPATIBLE; AHREFSBOT/7.0)', 'AhrefsBot'],
        ['bare token', 'AhrefsBot', 'AhrefsBot'],
        ['lower case', 'mozilla/5.0 (compatible; seznambot/4.0)', 'SeznamBot'],
        ['bare token', 'SeznamBot/4.0', 'SeznamBot'],
    ])('matches %s for %s', (_label, ua, family) => {
        expect(classifyUserAgent(ua)).toEqual({ family, category: 'search' });
    });

    /** The Seznam agent carries "seznambot-crawler" inside its own help URL,
     *  which the generic crawler pattern would also match. The named signature
     *  has to win, or the family regresses to "Unrecognised bot". */
    it('does not fall through to the generic crawler pattern', () => {
        expect(classifyUserAgent(SEZNAM)?.family).not.toBe('Unrecognised bot');
        expect(classifyUserAgent(AHREFS)?.family).not.toBe('Unrecognised bot');
    });

    /** The reason these two were added and four others were not: a crawler
     *  nobody has observed is still correctly reported as unrecognised. */
    it.each([
        ['SemrushBot', 'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)'],
        ['DotBot', 'Mozilla/5.0 (compatible; DotBot/1.2; +https://opensiteexplorer.org/dotbot)'],
        ['MJ12bot', 'Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)'],
        ['DataForSeoBot', 'Mozilla/5.0 (compatible; DataForSeoBot/1.0; +https://dataforseo.com/dataforseo-bot)'],
    ])('still reports unobserved %s as an unrecognised bot', (_label, ua) => {
        expect(classifyUserAgent(ua)).toEqual({ family: 'Unrecognised bot', category: 'unknown' });
    });
});

describe('classifyUserAgent — the new signatures change nothing else', () => {
    /** Every previously known agent, asserted again after the insert. First
     *  match wins in SIGNATURES, so adding a token in the middle of the list
     *  is exactly the kind of edit that can shadow a neighbour. */
    it.each([
        [UA.googlebot, 'Googlebot', 'search'],
        [UA.bingbot, 'Bingbot', 'search'],
        [UA.applebot, 'Applebot', 'search'],
        [UA.applebotExtended, 'Applebot-Extended', 'ai'],
        [UA.duckduck, 'DuckDuckBot', 'search'],
        [UA.yandex, 'YandexBot', 'search'],
        [UA.baidu, 'Baiduspider', 'search'],
        [UA.gptbot, 'GPTBot', 'ai'],
        [UA.claudebot, 'ClaudeBot', 'ai'],
        [UA.claudeUser, 'Claude-User', 'ai'],
        [UA.perplexity, 'PerplexityBot', 'ai'],
        [UA.linkedin, 'LinkedInBot', 'social'],
        [UA.twitterbot, 'Twitterbot', 'social'],
        [UA.facebook, 'FacebookExternalHit', 'social'],
        [UA.uptimerobot, 'UptimeRobot', 'monitoring'],
        [UA.curl, 'curl', 'monitoring'],
    ])('still identifies %s', (ua, family, category) => {
        expect(classifyUserAgent(ua)).toEqual({ family, category });
    });

    it('still refuses to classify humans', () => {
        for (const ua of [UA.chrome, UA.safariIphone, UA.firefox, UA.cubot]) {
            expect(classifyUserAgent(ua)).toBeNull();
        }
    });

    it('still flags a genuinely unknown bot', () => {
        expect(classifyUserAgent('Mozilla/5.0 (compatible; SomeNewBot/3.0)')).toEqual({
            family: 'Unrecognised bot',
            category: 'unknown',
        });
    });
});
