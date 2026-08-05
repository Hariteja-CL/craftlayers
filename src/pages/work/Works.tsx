import { useEffect } from 'react';
import { WorkCard, type WorkCardProps } from '../../components/work/WorkCard';

/**
 * Work — three clearly separated categories.
 *
 * The two flagship Product Cases sit alone at the top; earlier work never
 * appears beside them. Governance is listed once, pointing at the stronger
 * public-safe destination — both routes stay alive, but only one is listed.
 */

const PRODUCT_CASES: WorkCardProps[] = [
    {
        title: 'Three Questions Were Not the Problem',
        problem:
            'Found that the real problem was not the dashboard. Too few people understood why the survey mattered, whether it was safe, or what happened after they responded.',
        contribution: 'Diagnosed the cause and set out what would need to change.',
        method: 'Interviews, communication review and a walk-through of the respondent journey.',
        status: 'Public case study',
        confidentiality: 'Public · Anonymised',
        category: 'Respondent Experience · UX Research · Enterprise SaaS',
        readTime: '7 min read',
        href: '/work/respondent-experience',
    },
    {
        title: 'Designing Dashboards People Can Read, Trust and Act On',
        problem:
            'Created a four-step model for making dashboards easier to understand, plus rules for showing deeper detail only when users need it.',
        contribution: 'A dashboard philosophy, four explanation principles and a card-level rule.',
        method: 'Product and artifact review with feedback from an operational user.',
        status: 'Sanitised case study',
        confidentiality: 'Sanitised enterprise case',
        category: 'Analytics UX · Explainability · Design Systems',
        readTime: '7 min read',
        href: '/work/dashboard-explainability',
    },
];

const SYSTEMS: WorkCardProps[] = [
    {
        title: 'Turning Design Decisions into Implementation Rules',
        problem:
            'Design decisions kept being re-litigated because they lived in files and conversations rather than in rules a team could build against.',
        contribution:
            'Principles, tokens, component rules, documentation and review criteria that survive handoff.',
        status: 'System story',
        category: 'Design Systems · Governance · Implementation alignment',
        href: '/work/design',
    },
];

// The Enculture entry is deliberately absent. Its route names the client, and
// the two flagship cases anonymise that same client — so listing it here, even
// under a generic title, would undo the anonymisation. The route stays alive to
// avoid breaking existing links, but is not listed or promoted anywhere.
const EARLIER: WorkCardProps[] = [
    {
        title: 'Inwards',
        problem: 'Emotion-analytics SaaS, structuring emotional data into role-specific views.',
        status: 'Earlier experiment',
        category: 'SaaS · Analytics',
        href: '/work/inwards',
    },
    {
        // Listed once. /work/governance stays reachable but is not listed
        // separately; this points at the stronger public-safe destination.
        title: 'Design-System Governance',
        problem: 'Keeping AI-generated and hand-written UI from drifting apart as a product grows.',
        status: 'Earlier experiment',
        category: 'Design Systems · Governance',
        href: '/work/architecturing-governance',
    },
    {
        title: 'Culture dashboard concept',
        problem: 'An interactive concept exploring how culture signals could be read and acted on.',
        status: 'Concept prototype',
        category: 'Analytics UX · Prototype',
        href: '/dashboard/culture',
    },
];

function Category({
    eyebrow,
    title,
    blurb,
    items,
}: {
    eyebrow: string;
    title: string;
    blurb: string;
    items: WorkCardProps[];
}) {
    return (
        <section className="pt-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight">
                {title}
            </h2>
            <p className="mt-2 text-base cl-text-neutral-text-medium-contrast max-w-2xl">{blurb}</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
                {items.map((c) => (
                    <WorkCard key={c.href} {...c} />
                ))}
            </div>
        </section>
    );
}

export function Works() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <header className="pt-12">
                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.1]">
                        Work
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        Two product cases with the reasoning shown in full, the system work behind them, and
                        earlier explorations kept for context.
                    </p>
                </header>

                <Category
                    eyebrow="01 · Product cases"
                    title="Product cases"
                    blurb="Research, product decisions and the evidence behind them — written up in full."
                    items={PRODUCT_CASES}
                />

                <Category
                    eyebrow="02 · Systems"
                    title="Systems"
                    blurb="How decisions become rules, components and guidance a team can build against."
                    items={SYSTEMS}
                />

                <Category
                    eyebrow="03 · Earlier work"
                    title="Experiments and earlier work"
                    blurb="Kept for context rather than as evidence. Some original outcome claims have been removed because measurement evidence is not available publicly."
                    items={EARLIER}
                />
            </div>
        </div>
    );
}
