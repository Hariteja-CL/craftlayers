/**
 * Role configurations for /for/:slug.
 *
 * A role page is an interpretation of the evidence library, not a copy of it.
 * It may reorder cases, select which ones lead, and state how a requirement
 * maps to existing work. It may not restate a case, add outcomes, or claim
 * experience the library does not already hold.
 *
 * Adding a role means adding an object here. No component changes.
 *
 * The visible identity stays Senior Product Designer on every role page.
 * `role` describes the position being applied for; it does not re-title Hari.
 */

export interface RequirementMapping {
    /** What the role asks for, in the employer's terms. */
    requirement: string;
    /** Case ids from the evidence library that answer it. */
    evidence: string[];
    /** One line on how the work maps. Optional. */
    note?: string;
}

export interface RoleProfile {
    slug: string;
    /** The role being applied for. Shown as context, under the fixed identity. */
    role: string;
    /** 2–3 lines maximum. */
    positioning: string;
    requirements: RequirementMapping[];
    /**
     * Reading order. First is "Start with this", the rest "Also relevant".
     * Ids must exist in the evidence library.
     */
    featuredEvidence: string[];
    /** Per-case, why it is relevant to *this* role. Keyed by case id. */
    relevanceNotes: Record<string, string>;
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
                evidence: ['respondent-experience', 'dashboard-explainability'],
                note: 'Enterprise SaaS in culture and people analytics — assessments, dashboards and decision-support workflows.',
            },
            {
                requirement: 'Research-led product decisions',
                evidence: ['respondent-experience'],
                note: 'Interviews, communication review and journey analysis used to re-frame the problem before designing.',
            },
            {
                requirement: 'Data-heavy interfaces and information architecture',
                evidence: ['dashboard-explainability'],
                note: 'Explanation principles and a card-level rule for showing deeper detail only when it is needed.',
            },
            {
                requirement: 'Design systems and consistency at scale',
                evidence: ['design-system'],
                note: 'Principles, tokens, component rules and review criteria that survive handover.',
            },
            {
                requirement: 'Collaboration with engineering',
                evidence: ['design-system'],
                note: 'Decisions written as rules a team can build against, rather than as files to interpret.',
            },
        ],
        featuredEvidence: ['respondent-experience', 'dashboard-explainability', 'design-system'],
        relevanceNotes: {
            'respondent-experience':
                'The clearest example of finding the real problem before committing to a solution.',
            'dashboard-explainability':
                'Closest to the day-to-day work of an enterprise analytics product.',
            'design-system':
                'How the decisions in the two cases above stay consistent once a team is building against them.',
        },
        resumeUrl: '/Hariteja-Nandipati-Resume.pdf',
    },
];

export function getRoleProfile(slug: string): RoleProfile | undefined {
    return ROLE_PROFILES.find((r) => r.slug === slug);
}
