import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import { ArrowRight } from 'lucide-react';

/**
 * /work/design — public system story, framed around system integrity.
 *
 * The argument is that keeping product and UX decisions intact from design
 * through implementation matters more as AI increases the number of people and
 * tools interpreting a system. It shows what Hari believes and can own, with
 * one worked example as proof — not the operating method itself.
 *
 * Proof, not playbook. The rule anatomy, implementation chain, token
 * architecture, AI context model and review procedures stay private.
 */

const PROSE = 'text-[17px] md:text-lg leading-[1.75] cl-text-neutral-text-medium-contrast max-w-[65ch]';
const LABEL = 'text-xs font-bold uppercase tracking-[0.18em] cl-text-neutral-text-medium-contrast';

const PRINCIPLES = [
    {
        n: '01',
        title: 'Design decisions should survive implementation',
        body: 'The important product and UX decisions should still be visible in the built product, not only in the design files where they were first agreed.',
    },
    {
        n: '02',
        title: 'System language should express intent',
        body: 'Shared naming and components should carry the meaning behind a decision rather than describe a temporary appearance. A name like brand-primary says what something is for; a name describing its current colour only says what it looked like that week.',
    },
    {
        n: '03',
        title: 'Human judgment stays above AI generation',
        body: 'AI-assisted implementation works best inside clear product and design constraints, and stays subject to human review.',
    },
];

const CAN_OWN = [
    ['System definition', 'Turning recurring UX and product decisions into reusable design-system guidance.'],
    ['Implementation alignment', 'Staying close to implementation so the built experience remains connected to the decisions behind it.'],
    ['Design-system review', 'Identifying where production has drifted from shared UX rules, and resolving those gaps with product and engineering.'],
    ['AI-aware governance', 'Defining enough product and design constraint that AI-assisted delivery operates inside the intended experience.'],
];

const DEMONSTRATES = [
    'Design-system thinking beyond Figma organisation',
    'Product decisions carried into implementation',
    'Collaborative control of implementation drift',
    'AI-assisted delivery governed by human-owned decisions',
];

function Section({ id, label, title, children }: {
    id: string; label: string; title: string; children: React.ReactNode;
}) {
    return (
        <section className="pt-20 md:pt-24">
            <p className={`${LABEL} mb-4`}>{label}</p>
            <h2 id={id} className="text-2xl md:text-[2.1rem] font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.2] scroll-mt-28 max-w-[26ch]">
                {title}
            </h2>
            <div className="mt-6">{children}</div>
        </section>
    );
}

export function DesignLayers() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-3xl mx-auto px-6">

                {/* 1 · Hero */}
                <header className="pt-10">
                    <div className="mb-8">
                        <Breadcrumbs items={[
                            { label: 'Home', path: '/' },
                            { label: 'Work', path: '/work' },
                            { label: 'Turning Design Decisions into Implementation Rules' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">System story</Badge>
                        <Badge variant="secondary">Design Systems</Badge>
                        <Badge variant="secondary">Product Systems</Badge>
                        <Badge variant="secondary">AI-enabled Delivery</Badge>
                    </div>

                    <h1 className="text-[2.5rem] md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.08] tracking-tight">
                        Turning Design Decisions into Implementation Rules
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-[1.55] font-medium max-w-[48ch]">
                        How I keep product and UX decisions intact from design through implementation and
                        AI-assisted delivery.
                    </p>
                    <p className="mt-5 text-sm cl-text-neutral-text-low-contrast">
                        Public summary · deeper walkthrough available privately
                    </p>
                </header>

                {/* 2 · Market context */}
                <Section id="context" label="01 · Context" title="AI makes system maturity more important">
                    <p className={PROSE}>
                        AI can generate interface work quickly, but it also increases the number of people and
                        tools interpreting a product system. That makes clear design decisions, shared system
                        language and implementation alignment more important, not less.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        The challenge is no longer only creating reusable components. It is keeping product
                        decisions consistent across design, implementation and AI-assisted delivery.
                    </p>
                </Section>

                {/* 3 · Handoff is not the finish line */}
                <Section id="handoff" label="02 · The argument" title="Handoff is not the finish line">
                    <p className={PROSE}>
                        A design system is not complete because the Figma library is organised. The decisions
                        that system represents still need to survive into the built product. I stay close to
                        implementation so the product continues to reflect the UX and product decisions behind
                        the system.
                    </p>

                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-6 text-lg md:text-xl font-medium cl-text-neutral-text-high-contrast leading-[1.6] max-w-[46ch]"
                    >
                        We are not maintaining a Figma file. We are maintaining the experience of a product.
                    </p>

                    <div className="mt-10">
                        <h3 className="text-xl font-bold cl-text-neutral-text-high-contrast">No silent drift</h3>
                        <p className={`${PROSE} mt-2`}>
                            Design and engineering can challenge a system decision when technical, accessibility,
                            performance or product constraints require it. What matters is that the result becomes
                            an explicit shared decision rather than an undocumented difference between design and
                            production.
                        </p>
                        <p className={`${PROSE} mt-4`}>
                            Product, design and engineering share responsibility for keeping system decisions
                            intact. My particular part is making the UX intent explicit, staying involved through
                            implementation, and surfacing drift when the built product no longer reflects what was
                            agreed.
                        </p>
                    </div>
                </Section>

                {/* 4 · Three public principles */}
                <Section id="principles" label="03 · Principles" title="Three principles behind the system">
                    <ol className="space-y-8">
                        {PRINCIPLES.map((p) => (
                            <li key={p.n} className="flex gap-5">
                                <span className="text-sm font-mono font-bold cl-text-brand-primary-base pt-1.5 shrink-0">{p.n}</span>
                                <div>
                                    <h3 className="text-xl font-bold cl-text-neutral-text-high-contrast leading-snug">{p.title}</h3>
                                    <p className={`${PROSE} mt-2`}>{p.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-6 text-lg font-medium cl-text-neutral-text-high-contrast leading-[1.6] max-w-[52ch]"
                    >
                        AI accelerates repetitive production work. Product and design decisions remain
                        human-owned.
                    </p>
                </Section>

                {/* 5 · One evidence example — Visual 1 */}
                <Section id="evidence" label="04 · Evidence" title="One decision, expressed in the product">
                    <figure className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <dl className="space-y-5">
                            <div>
                                <dt className={LABEL}>Decision</dt>
                                <dd className="mt-1.5 text-lg cl-text-neutral-text-high-contrast leading-relaxed">
                                    The primary action should remain visually obvious.
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL}>System expression</dt>
                                <dd className="mt-1.5 text-lg font-semibold cl-text-neutral-text-high-contrast leading-relaxed">
                                    One primary action per view.
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL}>Product result</dt>
                                <dd className="mt-1.5 text-[17px] cl-text-neutral-text-medium-contrast leading-relaxed">
                                    Components use a consistent primary and secondary hierarchy, so attention lands
                                    in one place rather than being split between competing calls to action.
                                </dd>
                            </div>
                        </dl>
                    </figure>
                    <p className={`${PROSE} mt-6`}>
                        The decision is not a styling preference. It is a judgement about attention, in a form
                        someone else can apply without having to ask what was originally meant.
                    </p>
                </Section>

                {/* 6 · From design to product — Visual 2 */}
                <Section id="loop" label="05 · The loop" title="From design to product, and back">
                    <figure className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
                            {['Evidence', 'Decision', 'System', 'Product'].map((s, i, arr) => (
                                <li key={s} className="flex items-center gap-3">
                                    <span className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-4 py-2 text-[15px] font-semibold cl-text-neutral-text-high-contrast">
                                        {s}
                                    </span>
                                    {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />}
                                </li>
                            ))}
                        </ol>
                        <figcaption className="mt-5 text-[15px] leading-relaxed cl-text-neutral-text-medium-contrast">
                            The product then becomes evidence again — what people do with it feeds the next
                            decision.
                        </figcaption>
                    </figure>
                    <p className={`${PROSE} mt-6`}>
                        Research, analytics and user feedback inform a product decision. That decision becomes
                        part of the system, and the system should stay visible in the implemented experience.
                    </p>
                </Section>

                {/* 7 · What I can own */}
                <Section id="own" label="06 · Ownership" title="What I can own">
                    <dl className="space-y-6">
                        {CAN_OWN.map(([t, d]) => (
                            <div key={t}>
                                <dt className="text-lg font-bold cl-text-neutral-text-high-contrast">{t}</dt>
                                <dd className={`${PROSE} mt-1.5`}>{d}</dd>
                            </div>
                        ))}
                    </dl>
                </Section>

                {/* 8 · What this demonstrates */}
                <Section id="demonstrates" label="07 · Summary" title="What this demonstrates">
                    <ul className="space-y-3">
                        {DEMONSTRATES.map((d) => (
                            <li key={d} className="flex gap-3.5 text-[17px] cl-text-neutral-text-medium-contrast leading-relaxed">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-3 shrink-0" />
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-7 text-[15px] leading-relaxed cl-text-neutral-text-low-contrast max-w-[65ch]">
                        CraftLayers is currently the primary consumer of this system. This story demonstrates
                        system thinking, implementation alignment and application — not measured organisational
                        impact.
                    </p>
                </Section>

                {/* 9 · Private walkthrough */}
                <Section id="walkthrough" label="08 · Going deeper" title="A deeper walkthrough is available privately">
                    <p className={PROSE}>
                        This page shows the public version of the system. Detailed operating rules,
                        implementation structures, AI constraints and working artifacts are shared selectively
                        during portfolio reviews and interviews.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            Request a private walkthrough
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/profile"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-[15px] font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            View my profile
                        </Link>
                    </div>
                </Section>

                {/* 10 · Closing */}
                <Section id="closing" label="09 · Closing" title="Decisions that outlast the screen">
                    <p className="text-xl md:text-2xl cl-text-neutral-text-high-contrast font-medium leading-[1.5] max-w-[44ch]">
                        A design system becomes useful when decisions can survive beyond the screen where they
                        were first made.
                    </p>
                    <p className={`${PROSE} mt-6`}>
                        My goal is not to automate design judgment. It is to keep product decisions clear enough
                        that people, systems and AI-assisted tools can apply them without losing the original
                        intent.
                    </p>
                </Section>
            </div>

            <footer className="mt-24 pt-16 border-t cl-border-border-color-default">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className={`${LABEL} mb-6`}>More work</p>
                    <Link
                        to="/work"
                        className="group inline-flex items-center gap-3 text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast hover:cl-text-brand-primary-base transition-colors cl-focus-ring rounded-lg px-2"
                    >
                        Return to Work
                        <ArrowRight aria-hidden="true" className="w-7 h-7 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </footer>
        </article>
    );
}
