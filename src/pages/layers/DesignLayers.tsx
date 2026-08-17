import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import { ArrowRight, ArrowDown } from 'lucide-react';

/**
 * /work/design — the product-systems story.
 *
 * A system story, not a component gallery and not a frontend-engineering case
 * study. Every claim maps to an artifact that exists in this repository:
 * component usage guidance, the semantic token layer, the responsive maps, the
 * utility layer, the machine-readable design system, and the written
 * constraints governing AI-assisted work.
 *
 * Deliberately absent: delivery-speed, defect, rework, consistency, adoption
 * and productivity claims. None is measurable from what exists here, and the
 * limitations section says so in the page itself rather than in a comment.
 */

const RULE_LAYERS = [
    { layer: 'Purpose', asks: 'What is this for, and what is it not for?' },
    { layer: 'Usage patterns', asks: 'When does it apply, and how does it sit alongside everything else?' },
    { layer: 'State rules', asks: 'How does it behave when loading, empty, disabled or in error?' },
    { layer: 'Do / Don’t', asks: 'What has already been decided against, and why?' },
];

/** Paraphrased from craftlayers-ds/Usage — not exact quotations. */
const RULE_EXAMPLES = [
    {
        rule: 'One primary action per view',
        why: 'A decision about attention, not visual styling. If everything is primary, nothing is.',
    },
    {
        rule: 'Loading has both a threshold and a behaviour',
        why: 'The rule sets when loading applies — actions over about a second — and what the control does while it waits: it stops accepting input.',
    },
    {
        rule: 'Disabled states need care',
        why: 'Disabling a control tells someone they cannot continue without telling them why. Where it is workable, allowing the action and explaining the problem leaves a path forward.',
    },
];

const CHAIN = [
    { step: 'Design decision', body: 'The judgement itself, and the reasoning behind it.' },
    { step: 'Rule', body: 'That judgement written down so it can be checked later.' },
    { step: 'Token', body: 'A named value the rule can point at.' },
    { step: 'Utility', body: 'The token in a form someone can apply directly.' },
    { step: 'Component', body: 'The pattern assembled once, to be reused.' },
    { step: 'Page', body: 'Where the original decision finally shows up.' },
];

const AI_FLOW = ['Design rule', 'Structured context', 'Implementation', 'Human review', 'Pull request'];

const DEMONSTRATES = [
    'A token-based design system named by meaning rather than appearance.',
    'Component guidance covering purpose, usage patterns, state rules and do / don’t.',
    'Responsive typography and spacing encoded as reusable system rules.',
    'The system represented in both CSS and machine-readable form.',
    'Portfolio components built from that same system.',
    'AI-assisted implementation constrained by written rules and human review.',
];

const FUTURE_MEASURES = [
    'Implementation review time',
    'Repeated design-rule violations',
    'Component adoption',
    'Exceptions requested',
    'Accessibility regressions',
    'Design-to-build consistency',
    'Human corrections after AI-assisted implementation',
];

function Section({ id, eyebrow, title, intro, children }: {
    id: string; eyebrow: string; title: string; intro?: string; children?: React.ReactNode;
}) {
    return (
        <section className="pt-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </p>
            <h2 id={id} className="text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-tight scroll-mt-28">
                {title}
            </h2>
            {intro && (
                <p className="mt-4 text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">{intro}</p>
            )}
            {children && <div className="mt-8">{children}</div>}
        </section>
    );
}

export function DesignLayers() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-6">

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
                        <Badge variant="outline">Self-initiated · public-safe</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight">
                        Turning Design Decisions into Implementation Rules
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        A system for expressing product decisions as reusable guidance for designers, engineers
                        and AI-assisted delivery.
                    </p>
                </header>

                {/* 2 · The problem */}
                <Section
                    id="problem"
                    eyebrow="01 · The problem"
                    title="A decision that lives only in a screen is fragile"
                >
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            A design file shows what something looks like once. It rarely carries when the
                            pattern applies, when it should not be used, how it behaves while loading or in
                            error, what changes on a small screen, or what an implementation has to preserve to
                            keep the intent intact.
                        </p>
                        <p className="cl-text-neutral-text-high-contrast font-medium">
                            When the reasoning is not written down, the same design decision can be interpreted
                            differently later.
                        </p>
                        <p>
                            That gap widens once AI-assisted implementation is involved. A model can produce a
                            plausible interface very quickly. Without explicit constraints, it can produce
                            inconsistency just as quickly.
                        </p>
                    </div>

                    {/* Visual 1 — synthetic: screen-only vs reusable rule */}
                    <figure className="mt-10 grid md:grid-cols-2 gap-5">
                        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                            <p className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">
                                Decision held in a screen
                            </p>
                            <p className="text-base cl-text-neutral-text-medium-contrast">“This button is the main one.”</p>
                            <ul className="mt-4 space-y-1.5 text-sm cl-text-neutral-text-low-contrast">
                                <li>· Applies when?</li>
                                <li>· What about the second button?</li>
                                <li>· What happens while it is working?</li>
                                <li>· What on a small screen?</li>
                            </ul>
                        </div>
                        <div
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="rounded-2xl border cl-bg-neutral-surface-level-1 p-6"
                        >
                            <p className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-3">
                                Same decision as a rule
                            </p>
                            <p className="text-base cl-text-neutral-text-high-contrast font-medium">
                                One primary action per view.
                            </p>
                            <ul className="mt-4 space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                <li>· Purpose — direct attention to the single most important action</li>
                                <li>· Alternatives use the secondary treatment</li>
                                <li>· Loading state defined separately</li>
                                <li>· Responsive behaviour inherited from the system</li>
                            </ul>
                        </div>
                        <figcaption className="md:col-span-2 text-sm cl-text-neutral-text-medium-contrast">
                            The same judgement. Only one of them survives being handed to someone else.
                        </figcaption>
                    </figure>
                </Section>

                {/* 3 · What a reusable rule looks like — centrepiece */}
                <Section
                    id="rules"
                    eyebrow="02 · The core idea"
                    title="What a reusable rule looks like"
                    intro="A useful rule answers four questions. Together they describe behaviour and applicability — the parts a screen cannot carry on its own."
                >
                    {/* Visual 2 — real structure from the usage guidance */}
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-5">
                        {RULE_LAYERS.map((l, i) => (
                            <li key={l.layer} className="relative">
                                <span aria-hidden="true" className="absolute -left-[1.85rem] top-2 w-2.5 h-2.5 rounded-full border-2 cl-border-border-color-strong cl-bg-neutral-surface-level-0" />
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm font-mono cl-text-neutral-text-low-contrast">{`0${i + 1}`}</span>
                                    <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{l.layer}</h3>
                                </div>
                                <p className="mt-1 text-base cl-text-neutral-text-medium-contrast">{l.asks}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-10 space-y-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                            Three rules from the system, paraphrased
                        </p>
                        {RULE_EXAMPLES.map((r) => (
                            <div key={r.rule} className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                                <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{r.rule}</h3>
                                <p className="mt-2 text-base cl-text-neutral-text-medium-contrast leading-relaxed">{r.why}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        None of these describes appearance. The system does not only say how a component looks —
                        it says how it should behave and when it should be used.
                    </p>
                </Section>

                {/* 4 · Naming by meaning */}
                <Section
                    id="naming"
                    eyebrow="03 · Naming"
                    title="Naming decisions by meaning"
                    intro="A name is the smallest piece of documentation a system has. It is worth spending on."
                >
                    {/* Visual 3 — synthetic contrast + real tokens */}
                    <figure className="grid md:grid-cols-2 gap-5">
                        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                            <p className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">
                                Named for appearance — illustrative example
                            </p>
                            <p className="font-mono text-base cl-text-neutral-text-high-contrast">purple-500</p>
                            <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                Records what a colour looked like on the day it was chosen. Change the brand and
                                the name starts lying.
                            </p>
                        </div>
                        <div
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="rounded-2xl border cl-bg-neutral-surface-level-1 p-6"
                        >
                            <p className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-3">
                                Named for meaning — from this system
                            </p>
                            <ul className="space-y-1.5 font-mono text-sm cl-text-neutral-text-high-contrast">
                                <li>brand-primary-base</li>
                                <li>semantic-success-background</li>
                                <li>semantic-warning-text</li>
                                <li>neutral-text-high-contrast</li>
                                <li>neutral-surface-level-1</li>
                            </ul>
                            <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                Records what the value is for.
                            </p>
                        </div>
                        <figcaption className="md:col-span-2 text-sm cl-text-neutral-text-medium-contrast">
                            The left-hand example is illustrative, not a description of an earlier CraftLayers
                            convention. Semantic naming preserves intent even when the visual treatment changes.
                        </figcaption>
                    </figure>
                </Section>

                {/* 5 · Responsive as a system rule */}
                <Section
                    id="responsive"
                    eyebrow="04 · Responsiveness"
                    title="Responsive behaviour, decided once"
                    intro="Typography and spacing shift through shared responsive rules rather than being solved again inside every component."
                >
                    {/* Visual 4 — synthetic */}
                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <ul className="flex flex-wrap justify-center gap-3">
                            {['Desktop', 'Tablet', 'Mobile'].map((v) => (
                                <li key={v} className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-4 py-2 text-sm font-semibold cl-text-neutral-text-high-contrast">
                                    {v}
                                </li>
                            ))}
                        </ul>
                        <ArrowDown aria-hidden="true" className="w-5 h-5 mx-auto my-4 cl-text-brand-primary-base" />
                        <p className="text-center text-base font-semibold cl-text-neutral-text-high-contrast">
                            Shared responsive rules
                        </p>
                        <ArrowDown aria-hidden="true" className="w-5 h-5 mx-auto my-4 cl-text-brand-primary-base" />
                        <p className="text-center text-base cl-text-neutral-text-medium-contrast">
                            Components inherit the behaviour
                        </p>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast text-center">
                            Density is decided in one place, so a component behaves correctly on a small screen
                            because the system does — not because someone remembered.
                        </figcaption>
                    </figure>
                </Section>

                {/* 6 · From decision to implementation */}
                <Section
                    id="chain"
                    eyebrow="05 · The chain"
                    title="From decision to implementation"
                    intro="Each step narrows the room for reinterpretation."
                >
                    {/* Visual 5 — synthetic */}
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-4">
                        {CHAIN.map((c, i) => (
                            <li key={c.step} className="relative">
                                <span aria-hidden="true" className="absolute -left-[1.85rem] top-2 w-2.5 h-2.5 rounded-full border-2 cl-border-border-color-strong cl-bg-neutral-surface-level-0" />
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm font-mono cl-text-neutral-text-low-contrast">{`0${i + 1}`}</span>
                                    <h3 className="text-base font-bold cl-text-neutral-text-high-contrast">{c.step}</h3>
                                </div>
                                <p className="mt-0.5 text-base cl-text-neutral-text-medium-contrast">{c.body}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-8 text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        I define the product and design decisions, convert them into reusable system guidance,
                        and work close to implementation through components, documentation and review.
                    </p>
                    <p className="mt-3 text-base cl-text-neutral-text-low-contrast max-w-3xl">
                        The system also exists in machine-readable form, so tooling can consume the same
                        definitions the guidance describes.
                    </p>
                </Section>

                {/* 7 · Rules that AI can follow */}
                <Section
                    id="ai"
                    eyebrow="06 · AI-enabled delivery"
                    title="Rules that AI can follow"
                    intro="AI can generate interface code quickly, but speed without constraints can create inconsistency just as quickly."
                >
                    {/* Visual 6 — synthetic */}
                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
                            {AI_FLOW.map((s, i, arr) => (
                                <li key={s} className="flex items-center gap-3">
                                    <span className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-3.5 py-1.5 text-sm font-semibold cl-text-neutral-text-high-contrast">
                                        {s}
                                    </span>
                                    {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />}
                                </li>
                            ))}
                        </ol>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            Written constraints govern the AI-assisted work: follow the design system, treat the
                            established template as the single source of truth, and keep the tone consistent.
                            Every change goes through a pull request before it lands.
                        </figcaption>
                    </figure>

                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-6 text-lg font-medium cl-text-neutral-text-high-contrast leading-relaxed"
                    >
                        AI accelerates repetitive production work. Product and design decisions remain
                        human-owned.
                    </p>
                </Section>

                {/* 8 · The system in use */}
                <Section
                    id="in-use"
                    eyebrow="07 · Evidence"
                    title="The system in use"
                    intro="This portfolio is built from its own system. Case-study components, work cards and layout all draw on the shared tokens, utilities, usage guidance and responsive rules."
                >
                    {/* Visual 7 — a real component annotated with the layers it uses */}
                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-6">
                            <p className="text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-low-contrast mb-2">
                                System story · Design Systems
                            </p>
                            <p className="text-xl font-bold cl-text-neutral-text-high-contrast">A work card</p>
                            <p className="mt-2 text-base cl-text-neutral-text-medium-contrast">
                                One card type across every category, so entries can be compared on the same terms.
                            </p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold cl-text-brand-primary-base">
                                Read more <ArrowRight aria-hidden="true" className="w-4 h-4" />
                            </span>
                        </div>
                        <dl className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-3">
                            {[
                                ['Tokens', 'Surface, border and text colours by role, never raw values'],
                                ['Utilities', 'The token layer applied directly in markup'],
                                ['Usage guidance', 'Status shown as text, so meaning never depends on colour'],
                                ['Responsive rules', 'Type and spacing inherited, not re-specified'],
                            ].map(([t, d]) => (
                                <div key={t}>
                                    <dt className="text-sm font-bold cl-text-neutral-text-high-contrast">{t}</dt>
                                    <dd className="text-sm cl-text-neutral-text-medium-contrast">{d}</dd>
                                </div>
                            ))}
                        </dl>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            A component from this site, annotated with the system layers it draws on.
                        </figcaption>
                    </figure>

                    <p className="mt-6 text-base cl-text-neutral-text-high-contrast font-medium max-w-3xl">
                        CraftLayers is currently the primary consumer of this system. It has not yet been adopted
                        by another team.
                    </p>
                </Section>

                {/* 9 · What this demonstrates */}
                <Section id="demonstrates" eyebrow="08 · Summary" title="What this demonstrates">
                    <ul className="space-y-2.5">
                        {DEMONSTRATES.map((d) => (
                            <li key={d} className="flex gap-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* 10 · Limitations */}
                <Section id="limits" eyebrow="09 · Limits" title="Limits of this story">
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            This is one system with one primary consumer. There is no measured team adoption,
                            quantified delivery improvement, defect-reduction data or proven organisational
                            impact.
                        </p>
                        <p className="cl-text-neutral-text-high-contrast font-medium">
                            The value demonstrated here is system clarity and repeatability, not measured
                            organisational impact.
                        </p>
                    </div>
                </Section>

                {/* 11 · What I would measure next */}
                <Section
                    id="measure-next"
                    eyebrow="10 · Next"
                    title="What I would measure next"
                    intro="Future measures, not existing outcomes."
                >
                    <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
                        {FUTURE_MEASURES.map((m) => (
                            <li key={m} className="flex gap-3 text-base cl-text-neutral-text-medium-contrast">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-neutral-text-medium-contrast mt-2.5 shrink-0 opacity-50" />
                                <span>{m}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* 12 · Closing */}
                <Section id="closing" eyebrow="11 · Closing" title="Decisions that outlast the screen">
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast max-w-3xl">
                        <p className="text-xl cl-text-neutral-text-high-contrast font-medium">
                            A design system becomes useful when decisions can survive beyond the screen where
                            they were first made.
                        </p>
                        <p>
                            My goal is not to automate design judgment. It is to make good decisions explicit
                            enough that people and tools can apply them consistently.
                        </p>
                    </div>
                </Section>
            </div>

            <footer className="mt-24 pt-16 border-t cl-border-border-color-default">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-6">More work</h2>
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
