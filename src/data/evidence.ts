import type { WorkStatus } from '../components/work/WorkCard';

/**
 * The evidence library — one source of truth for what each case demonstrates.
 *
 * Before this existed, case metadata was written out twice (Home.tsx and
 * Works.tsx) and had already drifted: the same case carried different category
 * lines on each page. Role pages under /for/:slug would have become a third
 * copy. Everything that presents a case now reads from here.
 *
 * The rule this encodes: one evidence library, many lightweight
 * interpretations. A role page selects and reorders from this file; it never
 * restates a case in its own words.
 *
 * Nothing in here may claim more than the published case study supports.
 * Where an outcome was not measured, the field says what was decided or
 * produced instead of implying a result.
 */

/**
 * Capability vocabulary. Mostly metadata: used to select and order cases for a
 * role, and surfaced on cards only where it tells a hiring manager something.
 */
export const EVIDENCE_AREAS = [
    'Product Discovery',
    'UX Research',
    'Behavioural Analytics',
    'Enterprise UX',
    'Complex Workflows',
    'Dashboard UX',
    'Information Architecture',
    'Explainability',
    'Trust & Privacy',
    'Design Systems',
    'Product Patterns',
    'Engineering Collaboration',
    'Design-to-Development',
    'AI-Assisted Delivery',
    'Accessibility',
    'Product Strategy',
] as const;

export type EvidenceArea = (typeof EVIDENCE_AREAS)[number];

/**
 * Every valid case id. Role configs are typed against this, so referencing a
 * case that does not exist is a compile error rather than a silently missing
 * block on a live role page. Adding a case means adding its id here too.
 */
export type EvidenceCaseId =
    | 'respondent-experience'
    | 'dashboard-explainability'
    | 'design-system';

export interface EvidenceCase {
    /** Stable key used by role configs. Not the URL. */
    id: EvidenceCaseId;
    title: string;
    href: string;
    status: WorkStatus;
    confidentiality?: string;
    readTime?: string;

    /**
     * The product this work happened in, named before the click.
     *
     * A recruiter's first question is "has he built something like ours?", and
     * a case that names no product cannot answer it. The employer and the
     * product environment are public — they are already on the résumé — so
     * withholding them here bought nothing and cost comparability.
     *
     * What stays out: customer and tenant names, their data, and anything from
     * a private pilot. Those are what the "anonymised" and "sanitised" labels
     * on each case refer to, and they are unaffected by naming the product.
     */
    productContext?: string;

    /** What was wrong, in one line. */
    problem: string;
    /** What Hari actually did. */
    contribution?: string;
    /** How it was evidenced. */
    method?: string;

    /** Taxonomy tags — drive role matching. */
    evidenceFor: EvidenceArea[];
    /**
     * The short line shown above the title. Not decorative skill tags: it
     * states what this case is evidence *of*.
     *
     * Multi-word terms are joined with non-breaking spaces so the line can
     * only wrap at the separators. Without this, narrow cards split terms
     * like "Information architecture" across two lines.
     */
    evidenceLabel: string;
    /** One sentence on what the case proves. Shown as "Why this matters". */
    evidenceSummary: string;
    /** Interview prompts this case answers. Metadata; not rendered today. */
    hiringQuestions: string[];
    /** Role titles this case is strong for. Metadata; not rendered today. */
    recommendedFor: string[];
}

export const EVIDENCE_CASES: EvidenceCase[] = [
    {
        id: 'respondent-experience',
        title: 'Three Questions Were Not the Problem',
        href: '/work/respondent-experience',
        status: 'Public case study',
        confidentiality: 'Public · Anonymised',
        readTime: '7 min read',
        productContext: 'EnCulture at NHR Technologies · B2B culture analytics · assessment workflows',
        problem:
            'The real problem was not the dashboard. Too few people understood why the survey mattered, whether it was safe to answer honestly, or what happened after they responded.',
        contribution: 'Diagnosed the cause and set out what would need to change.',
        method: 'Interviews, communication review and a walk-through of the respondent journey.',
        evidenceFor: [
            'Product Discovery',
            'UX Research',
            'Enterprise UX',
            'Trust & Privacy',
            'Product Strategy',
        ],
        evidenceLabel: 'Research · Problem diagnosis · Enterprise UX',
        evidenceSummary:
            'Shows how I moved from an assumed dashboard problem to the underlying participation and trust problem — and what the evidence did not support.',
        hiringQuestions: [
            'Tell me about a time when you used research to identify the real product problem.',
            'Tell me about a time when the evidence contradicted what the team believed.',
            'How do you design for participation and trust in a sensitive workflow?',
            'Tell me about a time when you had to act on directional evidence rather than statistically valid data.',
        ],
        recommendedFor: [
            'Senior Product Designer',
            'Enterprise Product Designer',
            'UX Researcher / Research-led Product Designer',
        ],
    },
    {
        id: 'dashboard-explainability',
        title: 'Designing Dashboards People Can Read, Trust and Act On',
        href: '/work/dashboard-explainability',
        status: 'Sanitised case study',
        confidentiality: 'Sanitised enterprise case',
        readTime: '7 min read',
        productContext: 'EnCulture at NHR Technologies · multi-role dashboards · role-based reporting',
        // Was: "Created a four-step model for making dashboards easier to
        // understand…" — which described the solution. A card that opens with
        // the answer gives a reader nothing to be curious about, and it made
        // this case read weaker than the other two despite being just as strong.
        problem:
            'Decision-makers and client-facing teams could read the numbers but not what produced them — how a metric was calculated, what a colour meant, or why a recommendation was being made.',
        contribution: 'A dashboard philosophy, four explanation principles and a card-level rule.',
        method: 'Product and artifact review with feedback from an operational user.',
        evidenceFor: [
            'Dashboard UX',
            'Information Architecture',
            'Explainability',
            'Enterprise UX',
            'Complex Workflows',
            'Product Patterns',
        ],
        evidenceLabel: 'Analytics UX · Explainability · Information architecture',
        evidenceSummary:
            'Shows how I turned a dashboard interpretation problem into product principles and reusable interaction rules rather than a one-off redesign.',
        hiringQuestions: [
            'Tell me about a time when you made complex data understandable.',
            'How do you decide what detail to show and what to hold back?',
            'Tell me about a time when you turned a specific fix into a general rule.',
            'Tell me about a time when you had to use colour to communicate meaning without making colour the only signal.',
        ],
        recommendedFor: [
            'Senior Product Designer',
            'Enterprise Product Designer',
            'Analytics / Data Product Designer',
        ],
    },
    {
        id: 'design-system',
        title: 'Turning Design Decisions into Implementation Rules',
        href: '/work/design',
        status: 'System story',
        productContext:
            'EnCulture Design System at NHR Technologies · governing three products: Assessments, Multi-Rater and Culture Intelligence',
        problem:
            'Three products with different implementation foundations were solving the same problems differently, and design decisions kept being re-litigated because they lived in files and conversations rather than in rules a team could build against.',
        contribution:
            'One decision became one governed rule applied across all three products: experience principles, product patterns, the Clarity theme and an implementation checklist.',
        evidenceFor: [
            'Design Systems',
            'Product Patterns',
            'Engineering Collaboration',
            'Design-to-Development',
            'AI-Assisted Delivery',
            'Accessibility',
        ],
        evidenceLabel: 'Design systems · Implementation · AI-assisted delivery',
        evidenceSummary:
            'Shows how I keep a product coherent as it grows — including where AI speeds up production work and a person still owns the decision.',
        hiringQuestions: [
            'Tell me about a time when you kept a product consistent as the team grew.',
            'How do you make sure design decisions survive handover to engineering?',
            'How do you use AI without losing control of what ships?',
        ],
        recommendedFor: [
            'Senior Product Designer',
            'Design Systems / Product Platform Designer',
            'Product Designer (AI-enabled delivery)',
        ],
    },
];

/** Lookup by id. Returns undefined for an unknown key rather than throwing. */
export function getCase(id: EvidenceCaseId): EvidenceCase | undefined {
    return EVIDENCE_CASES.find((c) => c.id === id);
}

/** Resolve a list of ids, silently dropping any that no longer exist. */
export function getCases(ids: readonly EvidenceCaseId[]): EvidenceCase[] {
    return ids.map(getCase).filter((c): c is EvidenceCase => Boolean(c));
}

/**
 * The two strongest cases, in reading order. Drives "Start here" on the
 * homepage. Deliberately two: a third would dilute rather than add.
 */
export const START_HERE_IDS: EvidenceCaseId[] = ['respondent-experience', 'dashboard-explainability'];

/**
 * The four situations Hari is usually brought in for, each tied to the case
 * that evidences it. The connection is the point — a problem statement with no
 * proof behind it is a claim, not evidence.
 */
export interface ProblemArea {
    title: string;
    body: string;
    /** Case that demonstrates this. */
    caseId: EvidenceCaseId;
    /** Names the proof. Rendered after an "Evidence" label, so it carries
     *  no prefix of its own. */
    evidenceLabel: string;
}

export const PROBLEM_AREAS: ProblemArea[] = [
    {
        title: 'Complex products are hard to understand',
        body: 'Dashboards and enterprise tools often hold the right information but still need someone to explain them. I make the meaning, the evidence and the next step visible on the screen itself.',
        caseId: 'dashboard-explainability',
        evidenceLabel: 'Dashboard explainability',
    },
    {
        title: 'Research is not reaching product decisions',
        body: 'Findings get collected and then quietly ignored. I connect what users and stakeholders actually said to the decisions a team is about to make.',
        caseId: 'respondent-experience',
        evidenceLabel: 'Respondent experience',
    },
    {
        title: 'Product experiences are becoming inconsistent',
        body: 'As teams grow, the same problem gets solved five different ways. I turn design decisions into reusable rules so consistency survives handover.',
        caseId: 'design-system',
        evidenceLabel: 'Implementation rules',
    },
    {
        title: 'AI is accelerating delivery without enough control',
        body: 'AI can produce interfaces faster than anyone can review them. I keep the speed while making sure a person still checks what ships.',
        caseId: 'design-system',
        evidenceLabel: 'Implementation rules',
    },
];
