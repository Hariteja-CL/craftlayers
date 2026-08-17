import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import { ArrowRight } from 'lucide-react';

/**
 * /work/design — public system story (teaser).
 *
 * Deliberately a summary, not a playbook. It shows that a structured system
 * exists and what it produces, without publishing the method in enough detail
 * to be reconstructed step by step. The full anatomy of a rule, the complete
 * decision-to-implementation chain, the responsive maps and the AI governance
 * model are reserved for the private walkthrough.
 *
 * Proof, not playbook.
 */

/** Body copy: ~65ch measure, larger base size, generous leading. */
const PROSE = 'text-[17px] md:text-lg leading-[1.75] cl-text-neutral-text-medium-contrast max-w-[65ch]';
/** Section labels: readable rather than fine print. */
const LABEL = 'text-xs font-bold uppercase tracking-[0.18em] cl-text-neutral-text-medium-contrast';

const PRINCIPLES = [
    {
        n: '01',
        title: 'Rules over screenshots',
        body: 'Important design decisions should be written in a form that can be checked and reused, rather than left only inside a screen.',
    },
    {
        n: '02',
        title: 'Meaning over appearance',
        body: 'System language should describe intent rather than a temporary visual treatment, so the decision survives a change of styling.',
    },
    {
        n: '03',
        title: 'Human judgment over AI generation',
        body: 'AI-assisted implementation works inside product and design constraints that a person defines, and every change is reviewed before it lands.',
    },
];

const DEMONSTRATES = [
    'Product decisions translated into reusable design-system guidance',
    'Semantic system thinking rather than screen-by-screen styling',
    'Implementation alignment between design intent and built components',
    'AI-assisted delivery governed by human-defined rules',
];

function Section({ id, label, title, children }: {
    id: string; label: string; title: string; children: React.ReactNode;
}) {
    return (
        <section className="pt-20 md:pt-24">
            <p className={`${LABEL} mb-4`}>{label}</p>
            <h2 id={id} className="text-2xl md:text-[2.1rem] font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.2] scroll-mt-28 max-w-[24ch]">
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
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-[1.55] font-medium max-w-[46ch]">
                        How I make product decisions explicit enough to survive beyond individual screens and
                        support consistent implementation.
                    </p>
                    <p className="mt-5 text-sm cl-text-neutral-text-low-contrast">
                        Public summary · deeper walkthrough available privately
                    </p>
                </header>

                {/* 2 · The problem */}
                <Section id="problem" label="01 · The problem" title="A decision that lives only in a screen is fragile">
                    <p className={PROSE}>
                        Screens show an outcome, but they often don’t capture the reasoning behind it — when a
                        pattern applies, what behaviour is expected, or which decisions should stay consistent
                        later. When that reasoning isn’t written down, the same decision can be interpreted
                        differently the next time it comes up.
                    </p>
                </Section>

                {/* 3 · Three public principles */}
                <Section id="principles" label="02 · How I work" title="Three principles behind the system">
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

                    {/* Visual B — semantic naming, illustrative contrast */}
                    <figure className="mt-10 grid sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                            <p className={`${LABEL} mb-3`}>Named for appearance</p>
                            <p className="font-mono text-base cl-text-neutral-text-high-contrast">purple-500</p>
                        </div>
                        <div
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="rounded-2xl border cl-bg-neutral-surface-level-1 p-6"
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.18em] cl-text-brand-primary-base mb-3">Named for meaning</p>
                            <p className="font-mono text-base cl-text-neutral-text-high-contrast">brand-primary-base</p>
                        </div>
                        <figcaption className="sm:col-span-2 text-[15px] leading-relaxed cl-text-neutral-text-medium-contrast">
                            The appearance-based name is an illustrative contrast, not a historical CraftLayers
                            token. Naming for meaning keeps the intent intact when the visual treatment changes.
                        </figcaption>
                    </figure>
                </Section>

                {/* 4 · One real evidence example — Visual A */}
                <Section id="evidence" label="03 · Evidence" title="What one rule looks like">
                    <figure className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <dl className="space-y-5">
                            <div>
                                <dt className={LABEL}>Decision</dt>
                                <dd className="mt-1.5 text-lg cl-text-neutral-text-high-contrast leading-relaxed">
                                    A view should make its main action obvious.
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL}>Rule</dt>
                                <dd className="mt-1.5 text-lg font-semibold cl-text-neutral-text-high-contrast leading-relaxed">
                                    One primary action per view.
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL}>Visible behaviour</dt>
                                <dd className="mt-1.5 text-[17px] cl-text-neutral-text-medium-contrast leading-relaxed">
                                    Alternatives take a secondary treatment, so attention lands in one place rather
                                    than being split between competing calls to action.
                                </dd>
                            </div>
                        </dl>
                    </figure>
                    <p className={`${PROSE} mt-6`}>
                        The rule isn’t about styling. It records a judgement about attention, in a form someone
                        else can apply without needing to ask what was originally meant.
                    </p>
                </Section>

                {/* 5 · System in use — Visual C */}
                <Section id="in-use" label="04 · In use" title="From decision to component">
                    <figure className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <ol className="space-y-4">
                            {[
                                ['Product decision', 'Entries across the portfolio should be comparable on the same terms.'],
                                ['Reusable system rule', 'One card type, with status and category always carried as text.'],
                                ['Implemented component', 'A single work card used across every category on this site.'],
                            ].map(([step, body], i, arr) => (
                                <li key={step}>
                                    <p className={LABEL}>{step}</p>
                                    <p className="mt-1 text-[17px] cl-text-neutral-text-high-contrast leading-relaxed">{body}</p>
                                    {i < arr.length - 1 && (
                                        <span aria-hidden="true" className="block w-px h-5 mt-3 ml-1 cl-bg-neutral-surface-400" />
                                    )}
                                </li>
                            ))}
                        </ol>
                    </figure>
                    <p className={`${PROSE} mt-6`}>
                        Responsive behaviour is encoded as part of the system rather than repeatedly solved screen
                        by screen. CraftLayers is currently the primary consumer of this system, so this story
                        demonstrates system clarity and application rather than measured organisational impact.
                    </p>
                </Section>

                {/* 6 · AI-enabled delivery */}
                <Section id="ai" label="05 · AI-enabled delivery" title="Where AI fits">
                    {/* Kept as a plain inline sequence rather than a fourth
                        evidence card — the page allows three evidence visuals. */}
                    <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
                        {['Rule', 'AI-assisted implementation', 'Human review'].map((s, i, arr) => (
                            <li key={s} className="flex items-center gap-3">
                                <span className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-1 px-4 py-2 text-[15px] font-semibold cl-text-neutral-text-high-contrast">
                                    {s}
                                </span>
                                {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />}
                            </li>
                        ))}
                    </ol>
                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-6 text-lg md:text-xl font-medium cl-text-neutral-text-high-contrast leading-[1.6] max-w-[52ch]"
                    >
                        AI accelerates repetitive production work. Product and design decisions remain
                        human-owned.
                    </p>
                </Section>

                {/* 7 · What this demonstrates */}
                <Section id="demonstrates" label="06 · Summary" title="What this demonstrates">
                    <ul className="space-y-3">
                        {DEMONSTRATES.map((d) => (
                            <li key={d} className="flex gap-3.5 text-[17px] cl-text-neutral-text-medium-contrast leading-relaxed">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-3 shrink-0" />
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                    <p className={`${PROSE} mt-6`}>
                        In a multi-team setting, I would evaluate adoption, implementation consistency and review
                        effort.
                    </p>
                </Section>

                {/* 8 · Private walkthrough CTA */}
                <Section id="walkthrough" label="07 · Going deeper" title="A deeper walkthrough is available privately">
                    <p className={PROSE}>
                        This page shows the public version of the system. Detailed implementation rules, AI
                        constraints and working artifacts are shared selectively during portfolio reviews and
                        interviews.
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

                {/* 9 · Closing */}
                <Section id="closing" label="08 · Closing" title="Decisions that outlast the screen">
                    <p className="text-xl md:text-2xl cl-text-neutral-text-high-contrast font-medium leading-[1.5] max-w-[44ch]">
                        A design system becomes useful when decisions can survive beyond the screen where they
                        were first made.
                    </p>
                    <p className={`${PROSE} mt-6`}>
                        My goal is not to automate design judgment. It is to make good decisions explicit enough
                        that people and tools can apply them consistently.
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
