# CRAFTLAYERS PROJECT MEMORY

Canonical operational context for this repository. Read before making changes.
This is not a README. It exists to stop agents guessing about environments, data
origins and ownership. Anything not verifiable from the repository is marked
`UNKNOWN — requires verification`.

---

## 1. Project identity

**CraftLayers** is the personal product-design portfolio of Hariteja ("Hari") Nandipati.

- Repository: `Hariteja-CL/craftlayers` — **PUBLIC on GitHub**, default branch `main`.
- Production: `https://www.craftlayers.com` (canonical URL, per `index.html`).
- This repository controls: the React single-page application and the static files in `public/`.

**This repository does NOT control:**

| Host | What it is | Verified |
|---|---|---|
| `api.craftlayers.com` | nginx reverse proxy → `127.0.0.1:8000` on a VPS. The backend app behind it is **not in this repo**. | Config at `nginx/api.craftlayers.conf` |
| `factory-service.craftlayers.com` | Private authenticated reader (books). Returns **401**, nginx/1.24.0 Ubuntu basic auth. Zero references in this repo. | Live check 2026-09-08 |
| `factory.craftlayers.com` | Returns a **200 placeholder** ("tool currently unavailable") on every path. Behind Cloudflare. Zero references in this repo. | Live check 2026-09-08 |
| `claud.craftlayers.com` | `UNKNOWN — requires verification`. No reference anywhere in this repository. | — |

Because the repo is public, **anything committed here is published**, regardless of any
in-app gate. See §6.

---

## 2. Canonical architecture map

```text
PATH A — the portfolio (what this repo builds)
  Visitor
    ↓
  www.craftlayers.com
    ↓
  Vercel static hosting  ── vercel.json: SPA rewrite /(.*) → /
    ↓
  React SPA (dist/, built from src/)
    ↓
  Data: TypeScript modules + Markdown compiled INTO the bundle
        (src/data/*.ts, src/content/**/*.md)
  No runtime data fetch. No database. No VPS involved.

PATH B — the chat widget (optional, degrades if unset)
  Browser
    ↓
  fetch('/api/chat')  ── same-origin; no credential in the browser
    ↓
  api/chat.ts  ── reads B_GATEWAY_URL / B_GATEWAY_AUTH server-side
    ↓
  External gateway on a VPS  ← NOT in this repo

PATH C — unrelated to page rendering
  api.craftlayers.com → nginx → 127.0.0.1:8000 (VPS backend, not in this repo)

PATH D — crawler capture (observes Path A, never alters it)
  Any request
    ↓
  middleware.ts  ── Node.js runtime, runs BEFORE the CDN cache
    ↓ bot user-agents only; humans are discarded and never stored
  Vercel Blob  ── one object per hit, summary encoded in the pathname
    ↓
  api/crawler-stats.ts (session-gated) → /dashboard/crawlers
```

**The important consequence:** for every page the portfolio renders, the data source is
the repository itself. Nothing on a page comes from a VPS unless it flows through Path B.

---

## 3. Environment map

| Environment | Purpose | Location | Data source | Deployment | Authoritative? |
|---|---|---|---|---|---|
| **Production** | Live portfolio | `www.craftlayers.com` | The built bundle | Vercel (`vercel.json`). Exact project/branch trigger: `UNKNOWN — requires verification` — no `.github/` workflows and no `.vercel/` in repo | **Yes** for rendered output |
| **Localhost** | Development | `http://localhost:5173` (`npm run dev`; `.claude/launch.json`) | Same repo files | Not deployed | Yes for markup/logic, **no** for hosting behaviour |
| **VPS** | `api.craftlayers.com` backend, chat gateway, `factory-service` reader | Remote Ubuntu host | Own storage, not in repo | Manual; `scripts/setup_nginx.sh` provisions nginx + certbot | **Yes** for itself — this repo cannot change it |
| **Preview/Staging** | — | `UNKNOWN — requires verification` | — | Vercel may create PR previews; unconfirmed | — |

**Dependencies between environments:** localhost and production render from identical
source, so page content matches. They differ in hosting behaviour — `vercel.json`
redirects, rewrites and headers apply **only in production**. Neither environment depends
on the VPS to render pages. Editing this repo can never change VPS behaviour.

---

## 4. Data-source registry

| Data source | Purpose | Location | Consumer | Static/Dynamic | In Git | From VPS | Generated | Source of truth |
|---|---|---|---|---|---|---|---|---|
| **Evidence library** | Canonical case-study registry | `src/data/evidence.ts` | Home, `/work`, `/for/:slug` | Static | Yes | No | No | **This file.** Pages must read from it, not restate it |
| **Role profiles** | Role-targeted readings | `src/data/roleProfiles.ts` | `/for/:slug` | Static | Yes | No | No | This file |
| **Handbook chapters** | 16 Markdown chapters (~112,755 words) | `src/content/library/ai-product-development/*.md` + `manifest.ts` | `/library/*` | Static, async-imported per chapter | Yes | No | No | Repo copy is authoritative **for the published site**. Upstream author source lives outside the repo (§15) |
| **Design tokens** | Colour, type, spacing | `craftlayers-ds/themes/*.theme.json` | CSS generator | Static | Yes | No | No | **These JSON files** |
| **Generated CSS** | `--cl-*` vars + `.cl-*` utilities | `src/styles/variables.css`, `src/styles/utilities.css` | `src/index.css` | Static | Yes (committed) | No | **YES** | Never edit — regenerate (§6) |
| **Case-study prose** | Section copy | Inside each `src/pages/work/*.tsx` | That page | Static | Yes | No | No | The page component |
| **Chat gateway** | Chat widget replies | `B_GATEWAY_URL` (server-only), via `api/chat.ts` | `ChatWidget.tsx` → `/api/chat` | **Dynamic** | No | **Yes** | No | The VPS gateway |
| **Static resume** | Resume HTML/PDF | `public/resume.html`, `public/resume-ats.html`, `public/Hariteja-Nandipati-Resume.pdf` | Direct URL | Static | Yes | No | No | These files |
| **Crawler hits** | Which bots requested which pages | Vercel Blob, prefix `crawlers/` | `api/crawler-stats.ts` → `/dashboard/crawlers` | **Dynamic** | No | No | Written by `middleware.ts` | The Blob store. Needs **either** `BLOB_STORE_ID` (OIDC, what the current Vercel integration provisions) **or** `BLOB_READ_WRITE_TOKEN`; with neither, capture is a silent no-op |
| **Sitemap** | Crawler discovery | `public/sitemap.xml` | Search engines | Static | Yes | No | **No — hand-maintained** | The file. Add new routes by hand |

**Rule this table exists to enforce:** data visible locally does not originate locally
just because you can see it. Trace it here before changing behaviour.

---

## 5. Repository map

```text
/src
Purpose: The React application. All rendered content.
Source of truth?: Yes    Safe to edit?: Yes    Generated?: No

/src/data
Purpose: evidence.ts (case registry) + roleProfiles.ts. Structured content.
Source of truth?: Yes    Safe to edit?: Yes    Generated?: No
Notes: Changing a case here changes the homepage, /work and role pages at once.

/src/content/library
Purpose: Handbook Markdown + manifest.
Source of truth?: For the published site, yes    Safe to edit?: Yes    Generated?: No

/src/styles
Purpose: variables.css + utilities.css.
Source of truth?: NO     Safe to edit?: NO      Generated?: YES
Notes: Both carry "Auto-generated. DO NOT EDIT." Edit the theme JSON instead.

/craftlayers-ds
Purpose: Design-system source — themes, presets, usage docs.
Source of truth?: Yes, for tokens    Safe to edit?: Yes    Generated?: No
Notes: /marketplace and /craftlayers-marketplace carry LICENSE + PRICING and
       describe a separate commercial product. Not portfolio content.

/scripts
Purpose: generate-craftlayers-css.js (token → CSS), setup_nginx.sh (VPS provisioning).
Safe to edit?: Yes, with care. setup_nginx.sh affects a VPS, not this site.

/nginx
Purpose: api.craftlayers.com reverse-proxy config. Reference copy.
Notes: Editing it changes NOTHING until deployed to the VPS by hand.

/public
Purpose: Files served verbatim at the site root.
Safe to edit?: Yes    Generated?: No
Notes: See §15 for two dead files here.

/dist
Purpose: Build output. Gitignored. Never edit, never commit.

middleware.ts
Purpose: Crawler capture. Node.js runtime; runs before the CDN cache on every non-asset request.
Source of truth?: Yes    Safe to edit?: Yes, carefully    Generated?: No
Notes: MUST always return next(). It observes traffic and must never alter a
       response. Storage happens in waitUntil, after the response is sent.
       Typechecked via tsconfig.api.json, not the app config.

/docs
Purpose: Operational guides that are not agent context (e.g. Search Console setup).
Safe to edit?: Yes    Generated?: No

vercel.json
Purpose: Production redirects, SPA rewrite, cache and robots headers.
Notes: Production-only. Has no effect on localhost.

Authoring notes — NOT application code, never imported, safe to ignore:
  /Project rules, /Craftlayers V2, /refrence, /drafts, /temp_source.md,
  /AI_Factory_Checklist.md, /AgentDesignRules.md,
  /CraftLayers theme rule book.md, /Enculture Case Study Rules.md,
  /src/Enculture casestudy, /src/Governance casestudy
```

---

## 6. Source-of-truth rules

1. **Never edit `src/styles/variables.css` or `utilities.css`.** They are generated. Edit
   `craftlayers-ds/themes/*.theme.json`, then run `node scripts/generate-craftlayers-css.js`.
   The generator is **not** wired into `npm run build` — if you skip it, your token change
   silently does nothing.
2. **Never restate evidence-library content in a page.** If a case's title, status or
   summary is wrong, fix `src/data/evidence.ts`. Divergence between the homepage and
   `/work` is exactly what that file prevents.
3. **Never assume a VPS is involved in page rendering.** Every route in this repo renders
   from bundled data. Only the chat widget calls out.
4. **Never change VPS behaviour from this repo.** `nginx/` and `scripts/setup_nginx.sh`
   are reference copies. Real changes require access to the host.
5. **Treat every `VITE_*` variable as public.** Vite inlines them into the client bundle.
   A key in a `VITE_*` var is a published key.
6. **The repo is public — committing is publishing.** Never commit private manuscripts,
   client-identifying material or credentials, even behind an in-app gate. Git history
   is not retractable.
7. **A local build proves nothing about production.** See §9.
8. **Prefer accurate wording over impressive wording** in all portfolio copy. See §12.
9. **Client-side analytics cannot see crawlers.** GA4 does not execute for most bots and
   filters known ones from its reports. Crawler questions are answered by
   `middleware.ts` (who requested what) and Google Search Console (what got indexed) —
   never by adding browser tracking.
10. **A user-agent is a claim, not an identity.** It is trivially forged. Never present
    crawler data as verified without reverse-DNS or published IP-range checks.

---

## 7. Deployment model

- **Build:** `npm run build` → `tsc -b && vite build` → `dist/` (gitignored).
- **Host:** Vercel, configured by `vercel.json`:
  - `/about` → `/profile` (permanent), `/resume.pdf` → the PDF
  - SPA rewrite: `/(.*)` → `/`
  - `X-Robots-Tag: noindex, nofollow` on `/work/enculture`
  - no-cache revalidation on `*.html`
- **Branch that triggers deployment:** `UNKNOWN — requires verification`. No `.github/`
  workflows and no `.vercel/` directory exist. Vercel Git integration is the likely
  mechanism but is not evidenced in the repo.
- **Server components:** `api/*.ts` Vercel serverless functions, live on `main` since
  PR #106 (merged 2026-09-08, squash commit `5e2fc48`). They provide a signed HttpOnly
  session cookie, rate limiting and server-side secrets, and replaced the client-side
  `PasswordGate`. Verified in production: `GET /api/auth` returns
  `{"authenticated":false}` as JSON with `Cache-Control: no-store`, and
  `/api/culture-data` returns 401 without a session.
- **Requires VPS changes, not repo changes:** anything behind `api.craftlayers.com`,
  the chat gateway, and `factory-service.craftlayers.com`.
- **`claud.craftlayers.com` deployment:** `UNKNOWN — requires verification`.

---

## 8. Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run preview    # serve dist/ locally
npm run lint
node scripts/generate-craftlayers-css.js   # only after editing theme JSON
```

Environment variables are optional; the site renders without them.
**Note a real mismatch:** `.env.example` documents `VITE_CHAT_API_URL` and
`VITE_CHAT_API_KEY`, but the code reads `VITE_B_GATEWAY_URL` and `VITE_B_GATEWAY_AUTH`
(`ChatWidget.tsx`) and `VITE_OPENAI_API_KEY` (`InterventionChat.tsx`). Trust the code.

**What localhost CAN prove:** routing, layout, responsive behaviour, component logic,
copy, token output, typecheck and lint, accessibility of rendered markup.

**What localhost CANNOT prove:** `vercel.json` redirects, rewrites, cache and robots
headers; real 404 behaviour on deep links; serverless function behaviour; anything on the
VPS; CDN or Cloudflare behaviour; production environment variables.

---

## 9. Production verification

1. Inspect `https://www.craftlayers.com` — not localhost.
2. Check the route you changed, plus `/`, `/work` and `/library` if shared data moved.
3. Deep-link a nested route directly (e.g. `/work/respondent-experience`) to confirm the
   SPA rewrite served the app rather than a 404.
4. If you touched `vercel.json`, verify the header or redirect on the live response.
5. If you touched anything under `api/`, exercise the endpoint and confirm an
   unauthenticated call is rejected.
6. VPS verification is additionally required only for the chat gateway,
   `api.craftlayers.com` or `factory-service.craftlayers.com` — none of which this repo
   can deploy.

A green local build is not evidence that production is correct.

---

## 10. Content model

| Area | Route | Edit here |
|---|---|---|
| Homepage | `/` | `src/pages/Home.tsx` + `src/data/evidence.ts` |
| Work index | `/work` | `src/pages/work/Works.tsx` (reads the evidence library) |
| Case studies | `/work/*` | The page component in `src/pages/work/` |
| Role pages | `/for/:slug` | `src/data/roleProfiles.ts` |
| Library | `/library`, `/library/ai-product-development[/:chapterSlug]` | `src/content/library/…` + `manifest.ts` |
| Blog | `/blog`, `/blog/secure-ux`, `/blog/governance` | `src/pages/` |
| Profile / Contact | `/profile`, `/contact` | `src/pages/` |
| Culture dashboard | `/dashboard/culture` | `src/components/dashboard/CultureDashboard.tsx` |
| Resume | `/resume.html`, `/resume-ats.html`, `/resume.pdf` | `public/` |
| Site metadata | — | `index.html` (canonical, OG, JSON-LD) |

`/work/enculture` is deliberately reachable but unlisted and `noindex` — it names a
client. Do not link or promote it.

---

## 11. Product and career positioning

CraftLayers is a **senior Product / UX design portfolio**. Current direction:
**Senior Product Designer focused on complex B2B and AI-enabled products.**

Evidence areas: enterprise/B2B product design, complex workflows, dashboards and
analytics, UX research, information architecture, design systems, engineering
collaboration, AI-enabled design workflows, privacy- and security-aware product design.

**Do not** rewrite this into an AI-engineer portfolio, a generic developer portfolio, a
cybersecurity portfolio or an agency site. AI and technical fluency are differentiators
*within* a design identity, not the identity.

---

## 12. Evidence and claim rules

Never invent metrics, business impact, responsibilities, technologies, user counts,
research methods, AI capabilities or engineering ownership.

If a claim is not supported by project evidence, existing portfolio evidence, or a source
the user supplied, do not publish it as fact. Where evidence is absent, say the material
does not establish it — not that it did not happen.

---

## 13. Design system and visual rules

Do not invent a new design system. The existing one:

- **Tokens:** `craftlayers-ds/themes/*.theme.json` → CSS custom properties `--cl-*`
- **Utilities:** `.cl-*` classes in the generated `src/styles/utilities.css`
- **Tailwind:** `tailwind.config.js`, alongside the `cl-` layer
- **Typography:** Inter, Poppins, JetBrains Mono (loaded in `index.html`)
- **Components:** `src/components/ui/`; case-study parts in `src/components/case-study/`
- **Usage guidance:** `craftlayers-ds/Usage/*.md`
- **Responsive:** mobile scaling is generated into the CSS, not hand-written

Read those files rather than duplicating their values here.

---

# 14. BEFORE ANY AGENT STARTS WORK

1. Read this file.
2. Read the source files for the area you are changing.
3. Identify which environment the task affects — repo, VPS, or production config.
4. Trace the data source in §4 before changing data behaviour.
5. Distinguish source files from generated output (§6, rule 1).
6. Check the existing implementation before proposing new architecture.
7. Preserve working functionality unless the task explicitly changes it.
8. Never invent infrastructure that does not exist.
9. Never assume localhost and production behave identically.
10. Verify the finished change at the right layer (§9).

If something contradicts this file, do not silently pick one. Establish which is newer,
then update this file if the architecture genuinely changed.

**Memory update rule:** when an architectural fact, deployment path, data source,
environment dependency or major convention changes, update `CRAFTLAYERS_MEMORY.md` in the
same change or PR. Routine UI and copy edits should not cause memory churn.

---

## 15. Known traps

1. **`src/styles/*.css` look editable and are not.** 175 KB and 17 KB of committed,
   generated CSS. The generator is absent from `package.json` scripts, so a token edit
   without a manual regeneration step appears to do nothing.
2. **`.env.example` disagrees with the code.** It documents `VITE_CHAT_API_URL` /
   `VITE_CHAT_API_KEY`; the code reads `VITE_B_GATEWAY_URL` / `VITE_B_GATEWAY_AUTH`.
3. **`public/404.html` is a GitHub Pages SPA shim** (`spa-github-pages`). The site is on
   Vercel, where `vercel.json` handles rewrites. The file is inert and misleading.
4. **`public/assets/css/main.css` and `dashboard.css` are referenced nowhere.** Dead.
5. **`src/Enculture casestudy/` and `src/Governance casestudy/` are Markdown notes inside
   `src/`** and are never imported. Their presence in `src/` implies otherwise.
6. **Two governance routes both exist** — `/work/governance` and
   `/work/architecturing-governance`. Only the latter is listed. Both are alive.
7. **`factory.craftlayers.com` ≠ `factory-service.craftlayers.com`.** The first is a dead
   placeholder answering 200 on every path — including `/learning/`, which makes it look
   alive. The second is the real authenticated host and answers 401.
8. **Package name is `temp_app`, version `0.0.0`,** and `temp_source.md` sits at the root.
   Scaffolding leftovers, not signals about the project.
9. **Handbook chapters exist in two places.** The repo copy renders the site; the author's
   working source is outside the repo (`OneDrive/Documents/AI notes/`,
   `UNKNOWN — requires verification` as a stable path). Editing one does not update the other.
10. **`craftlayers-ds/marketplace` carries `PRICING.md`** — a separate commercial product,
    not portfolio content. Keep it out of portfolio work.
11. **Vercel Blob has two credential shapes, and only one looks familiar.**
    `@vercel/blob` accepts OIDC (`BLOB_STORE_ID` plus a runtime token) *or*
    `BLOB_READ_WRITE_TOKEN`. The current Vercel integration provisions the OIDC
    pair and no read-write token, so a project can be correctly connected while
    a naive `process.env.BLOB_READ_WRITE_TOKEN` check reports it as missing.
    That exact bug silently dropped every crawler hit in production on
    2026-09-09. Any code gating on Blob availability must accept both.

---

## 16. Current known architecture status

```text
Last verified:            2026-09-08
Repository/commit:        main at 5e2fc486 "Security: move secrets server-side and
                          replace client dashboard gate (#106)"
Repository visibility:    PUBLIC (Hariteja-CL/craftlayers), default branch main
Production domain:        https://www.craftlayers.com
Production deployment:    Vercel, configured by vercel.json.
                          Branch trigger UNKNOWN — requires verification
                          (no .github/ workflows, no .vercel/ in repo)
Server-side code:         api/* serverless functions live on main since #106.
                          Verified in production 2026-09-08: /api/auth serves JSON,
                          /api/culture-data 401s without a session, and the public
                          bundle carries no key, gateway host or hardcoded password
VPS dependency:           Chat widget only (VITE_B_GATEWAY_URL). Page rendering: none.
                          api.craftlayers.com and factory-service.craftlayers.com are
                          VPS-hosted and NOT deployable from this repo
Localhost dependency:     None. Site renders fully offline without env vars

Known unresolved architecture questions:
  - claud.craftlayers.com — purpose, ownership, deployment. No repo evidence
  - Which branch/project triggers the Vercel production deploy
  - Whether Vercel PR previews are enabled
  - Whether the api.craftlayers.com backend (port 8000) is still running, and what it serves
  - Stable location and sync direction for handbook chapters vs their upstream source
  - B_GATEWAY_URL and/or B_GATEWAY_AUTH are NOT set in production as of
    2026-09-08. RESOLVED 2026-09-09: both are now set and POST /api/chat
    returns 400 for an empty message, i.e. it gets past the config check
  - Whether Google Search Console is verified — see docs/search-console-setup.md
```
