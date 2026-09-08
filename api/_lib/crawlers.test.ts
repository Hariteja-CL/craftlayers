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

    it.each(['/', '/work/respondent-experience', '/library/ai-product-development', '/profile'])(
        'keeps %s',
        (p) => expect(isIgnorablePath(p)).toBe(false),
    );
});
