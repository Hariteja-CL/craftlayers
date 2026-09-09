/**
 * The private AI Product Development handbook, served only to an authenticated
 * session.
 *
 * WHY THIS ENDPOINT EXISTS.
 *
 * The handbook used to live under `src/content/`, so Vite compiled all sixteen
 * chapters into public JS chunks. A single public 5 KB manifest chunk listed
 * every chapter URL, and each chapter could then be fetched directly — no
 * session, no cookie, no browser. The entire 112,000-word handbook was
 * downloadable with seventeen requests. No route guard could have fixed that,
 * because the content never needed the route.
 *
 * Moving the source out of `src/` is what actually closed it. This endpoint is
 * the only way back in, and it checks the session first.
 *
 * Everything is private, not just the prose: titles, ordering and the chapter
 * questions are all behind the same gate, so an unauthenticated visitor cannot
 * learn what the handbook contains or how it is structured.
 *
 *   GET /api/library                → { handbook, chapters, lessons, evidence, gaps }
 *   GET /api/library?chapter=<slug> → { handbook, chapter, markdown, previous, next }
 *
 * One endpoint rather than two: the index and a chapter need the same session
 * check and the same manifest, and a second file would have duplicated both.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasValidSession } from './_lib/session.js';
import {
    CHAPTERS,
    EVIDENCE,
    GAPS,
    HANDBOOK,
    LESSONS,
    chapterBySlug,
    chapterNeighbours,
    loadChapter,
} from './_content/library/ai-product-development/manifest.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Never cached. A shared cache holding a chapter would hand it to the next
    // requester without a session check.
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!hasValidSession(req.headers.cookie)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const raw = req.query.chapter;
    const slug = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;

    // No slug — the index.
    if (!slug) {
        return res.status(200).json({
            handbook: HANDBOOK,
            chapters: CHAPTERS,
            lessons: LESSONS,
            evidence: EVIDENCE,
            gaps: GAPS,
        });
    }

    // A slug is only ever resolved through the manifest, so an arbitrary or
    // traversal-shaped value can never reach the filesystem.
    const chapter = chapterBySlug(slug);
    if (!chapter) {
        return res.status(404).json({ error: 'No such chapter' });
    }

    const markdown = await loadChapter(chapter.number, chapter.slug);
    if (markdown === null) {
        return res.status(404).json({ error: 'No such chapter' });
    }

    const { previous, next } = chapterNeighbours(chapter.slug);
    return res.status(200).json({
        handbook: HANDBOOK,
        chapter,
        markdown,
        previous,
        next,
        totalChapters: CHAPTERS.length,
    });
}
