import type { EvidenceCaseId } from './evidence';

/**
 * Role configurations for /for/:slug.
 *
 * A role page is an interpretation of the evidence library, not a copy of it.
 * It may reorder cases, select which ones lead, and say why a case answers a
 * given requirement. It may not restate a case, add outcomes, or claim
 * experience the library does not already hold.
 *
 * Adding a role means adding an object here. No component changes.
 *
 * ── The one rule that matters ────────────────────────────────────────────
 * Canonical copy — what actually happened — lives in the case study and the
 * evidence library. Role-specific copy lives here, and answers only:
 * "why is this case relevant to this job?"
 *
 * A `reason` may re-frame existing evidence for a reader. It may never state
 * an outcome, metric, result or method the case does not already contain.
 * When a case says its findings are directional, a reason must not describe
 * them as validated.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The visible identity stays Senior Product Designer on every role page.
 * `role` describes the position being applied for; it does not re-title Hari.
 */

/** One existing case, plus why it answers this particular requirement. */
export interface EvidenceReference {
    /** Typed against the library, so an unknown id fails at compile time. */
    caseId: EvidenceCaseId;
    /**
     * Role-specific interpretation. Grounded strictly in the canonical case —
     * never an outcome the case does not claim.
     */
    reason: string;
}

export interface RequirementMapping {
    /** What the role asks for, in the employer's terms. */
    requirement: string;
    /** Existing evidence that answers it. */
    evidence: EvidenceReference[];
}

export interface RoleProfile {
    slug: string;
    /** The role being applied for. Shown as context, under the fixed identity. */
    role: string;
    /** 2–3 lines maximum. */
    positioning: string;
    /** Prefer 4–6. Not a reproduction of the job description. */
    requirements: RequirementMapping[];
    /**
     * Reading order. First is "Start with this", the rest "Also relevant".
     * Typed, so ids are checked at build time.
     */
    featuredEvidence: EvidenceCaseId[];
    /** Per-case, why it is worth reading for *this* role. */
    relevanceNotes: Partial<Record<EvidenceCaseId, string>>;
    resumeUrl: string;
}

export const ROLE_PROFILES: RoleProfile[] = [
    {
        slug: 'senior-product-designer-enterprise',
        role: 'Senior Product Designer — Enterprise',
        positioning:
            'Complex B2B workflows, research-led product decisions and the systems that keep an enterprise product coherent as it grows.',
        requirements: [
            {
                requirement: 'Complex B2B product experience',
                evidence: [
                    {
                        caseId: 'respondent-experience',
                        reason: 'An enterprise feedback program with distinct owners — the people who run the program, the people who interpret results and the people who act on them — and a respondent journey that crosses all of them.',
                    },
                    {
                        caseId: 'dashboard-explainability',
                        reason: 'An enterprise analytics surface where the reader has to reach a decision, not just read a number.',
                    },
                ],
            },
            {
                requirement: 'Research-led product decisions',
                evidence: [
                    {
                        caseId: 'respondent-experience',
                        reason: 'Interviews, a review of the welcome and reminder communication, and a walk-through of the respondent journey re-framed the problem from the questions themselves to whether people understood why the survey mattered and whether it was safe to answer.',
                    },
                ],
            },
            {
                requirement: 'Data-heavy interfaces and information architecture',
                evidence: [
                    {
                        caseId: 'dashboard-explainability',
                        reason: 'Four explanation principles and a card-level rule for when deeper detail appears — including an info affordance that opens on click rather than hover, so it cannot fire by accident while someone scans.',
                    },
                ],
            },
            {
                requirement: 'Design systems and consistency at scale',
                evidence: [
                    {
                        caseId: 'design-system',
                        reason: 'Principles, tokens, component rules, documentation and review criteria written so a decision stays visible in the built product, not only in the file where it was agreed.',
                    },
                ],
            },
            {
                requirement: 'Collaboration with engineering',
                evidence: [
                    {
                        caseId: 'design-system',
                        reason: 'Decisions written as rules a team can build against, rather than as files someone has to interpret.',
                    },
                ],
            },
        ],
        featuredEvidence: ['respondent-experience', 'dashboard-explainability', 'design-system'],
        relevanceNotes: {
            'respondent-experience':
                'The clearest example of finding the real problem before committing to a solution. The case is explicit that its findings are directional rather than statistically representative.',
            'dashboard-explainability':
                'Closest to the day-to-day work of an enterprise analytics product.',
            'design-system':
                'How decisions like the two above stay consistent once a team is building against them.',
        },
        resumeUrl: '/Hariteja-Nandipati-Resume.pdf',
    },
];

export function getRoleProfile(slug: string): RoleProfile | undefined {
    return ROLE_PROFILES.find((r) => r.slug === slug);
}
