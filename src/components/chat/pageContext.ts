/**
 * Route → AI context mapping.
 *
 * The chat gateway does not know which page a visitor is reading. Sending a
 * small, declarative context object lets the backend select the matching
 * approved knowledge document (e.g. `case-study-respondent-experience.md`)
 * before answering.
 *
 * Only public, already-published metadata is sent — a route, a type, an id and
 * a public title. No page content, no confidential identifiers, and nothing
 * about the visitor.
 *
 * Routes that are not listed here send no page context at all, so the
 * assistant falls back to its general knowledge base.
 */
export interface PageContext {
    route: string;
    content_type: 'case_study';
    context_id: string;
    title: string;
}

const PAGE_CONTEXTS: Record<string, PageContext> = {
    '/work/respondent-experience': {
        route: '/work/respondent-experience',
        content_type: 'case_study',
        context_id: 'respondent-experience',
        title: 'Three Questions Were Not the Problem',
    },
};

/** Resolve the context for a pathname, or null when the route has none. */
export function resolvePageContext(pathname: string): PageContext | null {
    // Tolerate a trailing slash so /work/respondent-experience/ still matches.
    const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    return PAGE_CONTEXTS[normalised] ?? null;
}
