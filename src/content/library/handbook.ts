/**
 * Client access to the private handbook.
 *
 * Types and fetchers only — deliberately no data. Chapter prose, titles,
 * ordering and questions all live under `api/_content/`, outside anything Vite
 * compiles, and reach the browser only through `/api/library` after that
 * endpoint has checked the session.
 *
 * If you are tempted to add a chapter list here for a nicer loading state:
 * don't. That list is exactly what used to leak.
 */

export type Chapter = {
    number: number;
    slug: string;
    title: string;
    question: string;
};

export type Handbook = {
    slug: string;
    title: string;
    label: string;
    status: string;
    summary: string;
};

export type EvidenceStat = { value: string; label: string };
export type Gap = { id: string; title: string; detail: string };

export type LibraryIndex = {
    handbook: Handbook;
    chapters: Chapter[];
    lessons: string[];
    evidence: EvidenceStat[];
    gaps: Gap[];
};

export type ChapterPayload = {
    handbook: Handbook;
    chapter: Chapter;
    markdown: string;
    previous: Chapter | null;
    next: Chapter | null;
    totalChapters: number;
};

/** The handbook's stable URL segment. A slug is not content, and the route
 *  needs it before any data has loaded. */
export const HANDBOOK_SLUG = 'ai-product-development';

/** Distinguishes "you are not signed in" from "something broke", so the caller
 *  can show the sign-in surface rather than an error. */
export class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized');
        this.name = 'UnauthorizedError';
    }
}

async function get<T>(url: string): Promise<T> {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (res.status === 401) throw new UnauthorizedError();
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as T;
}

export function fetchLibraryIndex(): Promise<LibraryIndex> {
    return get<LibraryIndex>('/api/library');
}

export function fetchChapter(slug: string): Promise<ChapterPayload> {
    return get<ChapterPayload>(`/api/library?chapter=${encodeURIComponent(slug)}`);
}
