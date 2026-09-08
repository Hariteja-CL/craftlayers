# Google Search Console — setup

The crawler tracker at `/dashboard/crawlers` shows **who requested a page**. It cannot
show whether a page was indexed, what it ranks for, or how often it appeared in results.
Nothing in this repository can, because that data only exists inside the search engines.

Search Console fills that gap for Google, is free, and needs no code. Bing Webmaster
Tools is the equivalent for Bing. Between them and the tracker you cover all four
categories: browser analytics, request logs, indexing signals, and AI crawler traffic.

---

## 1. Verify the property

1. Go to <https://search.google.com/search-console> and sign in.
2. **Add property → URL prefix**, and enter `https://www.craftlayers.com`.
   Use the URL-prefix type, not Domain — Domain requires a DNS TXT record, and the
   site is served from Vercel while the DNS may be managed elsewhere.
3. Choose the **HTML tag** verification method. It gives a `<meta name="google-site-verification" content="…">` tag.
4. Add that tag to `index.html`, inside `<head>`, alongside the existing meta tags.
   The token is not a credential — it only proves control of the site — so committing
   it is fine.
5. Deploy, then press **Verify**.

## 2. Submit the sitemap

In **Sitemaps**, submit `sitemap.xml`.

The file is at `public/sitemap.xml` and is **maintained by hand**. It deliberately
excludes `/work/enculture` (client-named, and carrying a `noindex` header in
`vercel.json`), `/dashboard/*` (private), `/for/:slug` (role links meant to be sent
directly), and `/about` (a permanent redirect). When you add a route, add it here too.

## 3. What to read, and how often

- **Pages** — which URLs are indexed, and the reason for each exclusion. Worth checking
  after publishing a case study.
- **Crawl stats** (Settings → Crawl stats) — Googlebot request volume, response codes and
  timings. This is the authoritative version of what the tracker approximates.
- **Performance** — queries and impressions. The only place ranking data exists.

## 4. Bing

<https://www.bing.com/webmasters> allows importing the verified property directly from
Search Console, which is faster than verifying again. Worth doing: Bing's index feeds
several other surfaces.

## 5. What none of this covers

No AI crawler reports. Search Console will not tell you about GPTBot, ClaudeBot,
PerplexityBot or ChatGPT-User — that is precisely what `/dashboard/crawlers` is for, and
why both exist.
