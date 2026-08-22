import { Link } from 'react-router-dom';
import { ArrowRight, Download, Mail } from 'lucide-react';

/**
 * Profile — the depth layer behind the homepage positioning.
 *
 * Written to read as a senior product-design profile rather than a biography:
 * what Hari does, what he works on, how he works, what he can own, and how AI
 * and privacy fit into the process.
 *
 * Experience is stated only as "since 2017" — no total-career figure is
 * published, because that number is still unverified.
 */

const TIMELINE = [
    {
        role: 'Senior UX Designer / Senior Product Designer',
        org: 'Enculture, NHR Technologies',
        period: 'Jan 2024 – Present',
        domain: 'B2B SaaS · Culture analytics',
        notes: [
            'Lead UX across culture analytics modules — program creation, respondent flows, dashboards, action planning and role-based reporting.',
            'Created a product-specific UX philosophy and a scalable design system covering tokens, components, interaction states and accessibility rules.',
            'Used product signals and stakeholder evidence to identify friction and recommend evidence-led design changes.',
        ],
    },
    {
        role: 'Product Designer',
        org: 'Clinic Mantra',
        period: 'Jan 2023 – Aug 2023',
        domain: 'Healthcare tech',
        notes: [
            'Redesigned multi-clinic appointment scheduling across web dashboards and mobile flows.',
            'Reduced booking-flow complexity and applied secure UX patterns to sensitive healthcare workflows.',
        ],
    },
    {
        role: 'UX Design Consultant',
        org: 'Estate96',
        period: 'Aug 2022 – Nov 2022',
        domain: 'Smart access',
        notes: [
            'Designed UX architecture for mobile, tablet and wall-panel access-control experiences.',
            'Aligned interface behaviour with hardware access logic within an eight-week engagement.',
        ],
    },
    {
        role: 'UX Designer',
        org: 'Opia Labs',
        period: 'Nov 2019 – Jul 2022',
        domain: 'SaaS platforms',
        notes: [
            'Led product design for an emotion-analytics SaaS platform, structuring emotional data into role-specific dashboards.',
            'Improved design handoff across multiple products through reusable component frameworks.',
        ],
    },
    {
        role: 'UI / UX Designer',
        org: 'Foyr',
        period: 'Apr 2017 – Nov 2019',
        domain: 'Immersive architecture tech',
        notes: [
            'Standardised UX architecture across interconnected 3D visualisation products.',
            'Built reusable UI components for multi-product consistency.',
        ],
    },
];

const DOMAINS = [
    'Enterprise SaaS',
    'Culture and people analytics',
    'Assessments and surveys',
    'Dashboards and decision support',
    'AI-assisted products',
    'Healthcare and access-control workflows',
];

/**
 * What I can own — each entry says what Hari handles, the outcome it supports,
 * and which public case or system story evidences it. Evidence links point
 * only at work already published; nothing here is asserted without a page
 * behind it.
 */
const OWNERSHIP: {
    group: string;
    handles: string;
    outcome: string;
    evidence?: { label: string; href: string };
}[] = [
    {
        group: 'Product discovery and UX research',
        handles: 'Interviews, stakeholder feedback, artifact review and evidence mapping, feeding into product strategy.',
        outcome: 'The team works on the problem that actually matters, not the reported symptom.',
        evidence: { label: 'Three Questions Were Not the Problem', href: '/work/respondent-experience' },
    },
    {
        group: 'Enterprise workflows',
        handles: 'Multi-role flows, permissions, approvals and long-running processes.',
        outcome: 'Complex processes stay usable as roles and rules multiply.',
        evidence: { label: 'Three Questions Were Not the Problem', href: '/work/respondent-experience' },
    },
    {
        group: 'Dashboards and analytics',
        handles: 'Metric explanation, chart meaning, evidence traceability and decision support.',
        outcome: 'People can read a dashboard and act on it without someone explaining it.',
        evidence: { label: 'Designing Dashboards People Can Read, Trust and Act On', href: '/work/dashboard-explainability' },
    },
    {
        group: 'Design systems',
        handles: 'Tokens, components, interaction states, naming and the rules that hold them together.',
        outcome: 'Teams build consistently as the product and the team grow.',
        evidence: { label: 'Turning Design Decisions into Implementation Rules', href: '/work/design' },
    },
    {
        group: 'AI-enabled product workflows',
        handles: 'AI-assisted research, synthesis, documentation and concept development.',
        outcome: 'Delivery speeds up without losing human review of what ships.',
        evidence: { label: 'Turning Design Decisions into Implementation Rules', href: '/work/design' },
    },
    {
        group: 'Accessibility',
        handles: 'Semantic structure, keyboard paths, non-colour cues and readable defaults.',
        outcome: 'The product works for people using it in ways the team did not assume.',
        evidence: { label: 'Designing Dashboards People Can Read, Trust and Act On', href: '/work/dashboard-explainability' },
    },
    {
        group: 'Privacy-aware UX',
        handles: 'Anonymity, minimising personal data, role-aware access and safe data exposure.',
        outcome: 'People can answer honestly because they can see they are protected.',
        evidence: { label: 'Three Questions Were Not the Problem', href: '/work/respondent-experience' },
    },
    {
        group: 'Implementation alignment',
        handles: 'Developer handoff — turning decisions into rules, states and edge cases engineers can build from.',
        outcome: 'What ships matches what was decided.',
        evidence: { label: 'Turning Design Decisions into Implementation Rules', href: '/work/design' },
    },
];

const PRINCIPLES: { rule: string; plain?: string }[] = [
    { rule: 'Evidence before assumption.' },
    { rule: 'Real insight changes the decision.', plain: 'If a finding would not have changed what we did, it was not an insight.' },
    { rule: 'Conversations reveal the truth.', plain: 'The useful detail usually arrives in a sentence someone says in passing.' },
    { rule: 'Simple things get used.' },
    { rule: 'Turn decisions into reusable rules.', plain: 'Otherwise the same argument gets had again in three months.' },
    { rule: 'One card, one primary insight.', plain: 'A screen element should make one point, not compete with itself.' },
    { rule: 'Disclose detail on demand.', plain: 'Show the essential information first and reveal the depth when it is asked for.' },
    { rule: 'Protect the person before the data.' },
    { rule: 'Trust is created through inspectability.', plain: 'People believe a number when they can see how it was produced.' },
    { rule: 'Recommendations remain unvalidated until tested.' },
];

const TOOLS = [
    { purpose: 'Design and systems', items: 'Figma · design tokens · component rules · CSS references · responsive systems' },
    { purpose: 'Research and synthesis', items: 'Interviews · analytics review · journey mapping · product audits · AI-assisted synthesis' },
    { purpose: 'AI-enabled delivery', items: 'ChatGPT · Claude · prompt and context design · AI evaluation · documentation support' },
    { purpose: 'Implementation and handoff', items: 'Cursor · Antigravity · GitHub · Vercel · implementation QA' },
];

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
    return (
        <section className="pt-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mb-6">
                {title}
            </h2>
            {children}
        </section>
    );
}

export function Profile() {
    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* 1 · Professional summary */}
                <header className="pt-12">
                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.1]">
                        Senior Product Designer &amp; Product Systems Builder
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        I turn research, analytics and complex product constraints into clear product decisions,
                        scalable experience rules and implementation-ready systems.
                    </p>
                    <p className="mt-6 text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        8+ years in UX and product design since 2017, mostly in enterprise SaaS — culture and
                        people analytics, assessments, dashboards and decision-support workflows. I work at the
                        point where research meets implementation: diagnosing why a product behaviour is
                        happening, deciding what to change, and turning that into rules a team can build against.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="/Hariteja-Nandipati-Resume.pdf"
                            download="Hariteja-Nandipati-Resume.pdf"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            <Download aria-hidden="true" className="w-4 h-4" />
                            Download résumé
                        </a>
                        <Link
                            to="/work"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            View selected work
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                {/* 2 · Experience timeline */}
                <Section eyebrow="01 · Experience" title="Where I have worked">
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-8">
                        {TIMELINE.map((t) => (
                            <li key={t.org} className="relative">
                                <span aria-hidden="true" className="absolute -left-[1.85rem] top-2 w-2.5 h-2.5 rounded-full border-2 cl-border-border-color-strong cl-bg-neutral-surface-level-0" />
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                    <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">
                                        {t.role} <span className="font-medium cl-text-neutral-text-medium-contrast">· {t.org}</span>
                                    </h3>
                                    <span className="text-sm font-mono cl-text-neutral-text-low-contrast">{t.period}</span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mt-1">{t.domain}</p>
                                <ul className="mt-3 space-y-1.5">
                                    {t.notes.map((n) => (
                                        <li key={n} className="flex gap-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                                            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                            <span>{n}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-6 text-sm cl-text-neutral-text-low-contrast">
                        Earlier career in graphic design and design training, which is where the typography and
                        visual-systems grounding comes from.
                    </p>
                </Section>

                {/* 3 · Product domains */}
                <Section eyebrow="02 · Domains" title="Products I work on">
                    <ul className="flex flex-wrap gap-2">
                        {DOMAINS.map((d) => (
                            <li key={d} className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-1 px-4 py-2 text-sm font-medium cl-text-neutral-text-high-contrast">
                                {d}
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* 4 · Capabilities */}
                <Section eyebrow="03 · Capabilities" title="What I can own">
                    <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl mb-8">
                        What I handle, the outcome it supports, and where you can see the evidence.
                    </p>
                    <ul className="space-y-6">
                        {OWNERSHIP.map((o) => (
                            <li key={o.group} className="border-t cl-border-border-color-default pt-5">
                                <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{o.group}</h3>
                                <p className="mt-1 text-base cl-text-neutral-text-medium-contrast leading-relaxed">{o.handles}</p>
                                <p className="mt-1 text-sm cl-text-neutral-text-low-contrast">
                                    <span className="font-semibold">Supports:</span> {o.outcome}
                                </p>
                                {o.evidence && (
                                    <Link
                                        to={o.evidence.href}
                                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold cl-text-brand-primary-base hover:underline cl-focus-ring rounded"
                                    >
                                        Evidence: {o.evidence.label}
                                        <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Ownership boundaries — what Hari partners on rather than owns */}
                    <p className="mt-8 rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                        I work comfortably across technical, AI and privacy-sensitive product areas, while
                        partnering with specialists for backend architecture, cybersecurity engineering,
                        penetration testing, data science and frontend engineering leadership.
                    </p>
                </Section>

                {/* 5 · Product-system approach */}
                <Section eyebrow="04 · Approach" title="How decisions become systems">
                    <p className="text-lg cl-text-neutral-text-medium-contrast leading-relaxed">
                        Research findings, stakeholder input, analytics and product constraints are only useful
                        once they become something a team can act on repeatedly. That conversion is most of the
                        job.
                    </p>
                    <div className="mt-6 grid sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Inputs</h3>
                            <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                <li>· Research findings and interviews</li>
                                <li>· Stakeholder and domain input</li>
                                <li>· Product and usage analytics</li>
                                <li>· Technical and delivery constraints</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-2">Outputs</h3>
                            <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                <li>· UX principles and decision rules</li>
                                <li>· Components and design-system guidance</li>
                                <li>· Implementation documentation</li>
                                <li>· Testable product directions, with the untested parts named</li>
                            </ul>
                        </div>
                    </div>
                </Section>

                {/* 6 · AI-enabled workflow */}
                <Section eyebrow="05 · AI-enabled delivery" title="Where AI fits">
                    <p className="text-lg cl-text-neutral-text-medium-contrast leading-relaxed">
                        AI accelerates synthesis, documentation, concept development and implementation. It does
                        not make the product decisions.
                    </p>
                    <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {['Research', 'Synthesis', 'UX framing', 'System rules', 'Concepts', 'Implementation guidance', 'Review'].map((step, i, arr) => (
                            <li key={step} className="flex items-center gap-3">
                                <span className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-1 px-3.5 py-1.5 text-sm font-semibold cl-text-neutral-text-high-contrast">
                                    {step}
                                </span>
                                {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />}
                            </li>
                        ))}
                    </ol>
                    <p className="mt-5 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                        Every step ends in human review. Anything AI-assisted is still checked against evidence
                        before it reaches a product decision.
                    </p>
                </Section>

                {/* 7 · Collaboration model */}
                <Section eyebrow="06 · Collaboration" title="Who I work with">
                    <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        {[
                            { who: 'Product managers', how: 'Framing the problem and agreeing what evidence would change the decision.' },
                            { who: 'Engineers', how: 'Design decisions expressed as rules, states and edge cases — not just screens.' },
                            { who: 'Leadership', how: 'Trade-offs and what remains unvalidated, stated plainly.' },
                            { who: 'Client-facing teams', how: 'The people who have to explain the product; their questions surface real gaps.' },
                            { who: 'Researchers and domain experts', how: 'Interpreting findings without over-claiming them.' },
                            { who: 'Data and analytics', how: 'Agreeing what a metric means before designing around it.' },
                        ].map((c) => (
                            <div key={c.who}>
                                <dt className="text-sm font-bold cl-text-neutral-text-high-contrast">{c.who}</dt>
                                <dd className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed mt-0.5">{c.how}</dd>
                            </div>
                        ))}
                    </dl>
                </Section>

                {/* 8 · Working principles */}
                <Section eyebrow="07 · Principles" title="How I work">
                    <ol className="space-y-3">
                        {PRINCIPLES.map((p, i) => (
                            <li key={p.rule} className="flex gap-4">
                                <span className="text-sm font-mono cl-text-neutral-text-low-contrast pt-1 shrink-0">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <p className="text-lg cl-text-neutral-text-high-contrast font-medium leading-relaxed">{p.rule}</p>
                                    {p.plain && (
                                        <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed mt-0.5">{p.plain}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </Section>

                {/* 9 · Tools by purpose */}
                <Section eyebrow="08 · Tools" title="Tools, by what they are for">
                    <dl className="space-y-4">
                        {TOOLS.map((t) => (
                            <div key={t.purpose} className="flex flex-col sm:flex-row sm:gap-6">
                                <dt className="text-sm font-bold cl-text-neutral-text-high-contrast sm:w-56 shrink-0">{t.purpose}</dt>
                                <dd className="text-sm cl-text-neutral-text-medium-contrast">{t.items}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-5 text-sm cl-text-neutral-text-low-contrast">
                        Tools change; the reasoning does not. These are listed by purpose because that is the only
                        part worth evaluating.
                    </p>
                </Section>

                {/* 10 · Résumé and contact */}
                <Section eyebrow="09 · Next" title="Résumé and contact">
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="/Hariteja-Nandipati-Resume.pdf"
                            download="Hariteja-Nandipati-Resume.pdf"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            <Download aria-hidden="true" className="w-4 h-4" />
                            Download résumé
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            <Mail aria-hidden="true" className="w-4 h-4" />
                            Get in touch
                        </Link>
                        <a
                            href="https://linkedin.com/in/hariteja-nandipati"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                        >
                            LinkedIn
                        </a>
                    </div>
                </Section>
            </div>
        </div>
    );
}
