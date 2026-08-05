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
    '/work/dashboard-explainability': {
        route: '/work/dashboard-explainability',
        content_type: 'case_study',
        context_id: 'dashboard-explainability',
        title: 'Designing Dashboards People Can Read, Trust and Act On',
    },
};

function normalise(pathname: string): string {
    // Tolerate a trailing slash so /work/respondent-experience/ still matches.
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/** Resolve the context for a pathname, or null when the route has none. */
export function resolvePageContext(pathname: string): PageContext | null {
    return PAGE_CONTEXTS[normalise(pathname)] ?? null;
}

/* ------------------------------------------------------------------ *
 * TEMPORARY — remove once the gateway ships context routing.
 *
 * The site correctly sends page_context, but factory-service currently
 * discards it: asked about this case study it answers from an unrelated
 * portfolio project (the security disclosure) and names organisations the
 * published page deliberately anonymises.
 *
 * Rather than present a knowingly wrong assistant beside the case study, the
 * launcher is suppressed on this route only. The assistant stays available
 * everywhere else.
 *
 * REMOVAL: once GATEWAY-INTEGRATION-SPEC.md acceptance tests pass against
 * production, empty this set. No other change is required.
 * ------------------------------------------------------------------ */
const ASSISTANT_SUPPRESSED_ROUTES = new Set<string>([
    '/work/respondent-experience',
    // Same reason: the gateway does not yet support context_id
    // "dashboard-explainability", and this case is confidential-adjacent, so a
    // wrong answer here carries more risk than on any other route.
    '/work/dashboard-explainability',
]);

/** True when the chat launcher must not be shown on this route. */
export function isAssistantSuppressed(pathname: string): boolean {
    return ASSISTANT_SUPPRESSED_ROUTES.has(normalise(pathname));
}
