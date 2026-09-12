import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import {
    DecisionLoop,
    Ladder,
    Points,
    QuadMap,
    Statement,
} from '../../components/case-study/CaseStudyBeats';
import { ArrowRight } from 'lucide-react';

import brandInterpretations from '../../assets/images/case/design-one-brand-many-interpretations.webp';
import valueMeanings from '../../assets/images/case/design-one-value-many-meanings.webp';
import governedRules from '../../assets/images/case/design-shared-governed-rules.webp';

/**
 * /work/design — the short design-system case.
 *
 * SOURCE OF TRUTH.
 *
 * This page follows the approved short draft
 * (Craftlayers V2/Case studies/…Editable_Draft shorter.docx) and its seven
 * sections, in its order: Problem, Insight, Solution, System-Gap Governance,
 * Principle-Led Architecture, Organizational Value, What Changed in My
 * Thinking. The earlier long narrative version of this page is superseded and
 * must not be treated as the source any more.
 *
 * Three approved diagrams ship with the draft and sit where the draft puts
 * them: Problem, Insight and Solution. Governance uses the existing
 * DecisionLoop component rather than a fourth image, because the loop is the
 * one diagram on the page whose content is pure text and so reads correctly to
 * a screen reader without needing an alt description to stand in for it.
 *
 * WORDING FIXED ON REVIEW, and these must not drift back:
 *   · "positive analytical state", never "positive financial state"
 *   · governance returns the answer to the shared system, not to one screen
 *   · the AI line is "can work within the same shared rules and constraints"
 *     — it does not promise that AI output complies
 *   · the capabilities note stays as approved: practical capabilities the
 *     architecture enables, not measured ROI or adoption outcomes
 *
 * WHAT THIS PAGE DELIBERATELY IS NOT. No long philosophical section, no
 * repeated pull quotes, no general design-system theory, no speculative future
 * architecture. That material belongs to the field note at
 * /work/design-system-governance and is linked, not restated.
 *
 * TITLE. "From Figma Library to Executable Product Rules", taken from the
 * approved draft and synced on 2026-09-12 across every place the old title
 * appeared: this h1 and breadcrumb, the card title in src/data/evidence.ts,
 * the document title in LayoutShell, and three evidence links on /profile.
 * They are one label for one page and must be renamed together — a page title
 * that disagrees with its own card is the defect corrected on 2026-09-10.
 *
 * PROVENANCE. The product context — EnCulture at NHR Technologies, governing
 * Assessments, Multi-Rater and Culture Intelligence — is the confirmed source
 * of truth and matches the evidence library and the homepage card word for
 * word. An earlier version described a different consumer for this system;
 * that wording was confirmed stale on 2026-09-10. If it resurfaces, it is
 * wrong.
 */

const PROSE = 'text-[17px] md:text-lg leading-[1.75] cl-text-neutral-text-medium-contrast max-w-[65ch]';
const LABEL = 'text-xs font-bold uppercase tracking-[0.18em] cl-text-neutral-text-medium-contrast';

function Section({ id, label, title, children }: {
    id: string; label: string; title: string; children: React.ReactNode;
}) {
    return (
        <section className="pt-20 md:pt-24">
            <p className={`${LABEL} mb-4`}>{label}</p>
            <h2
                id={id}
                className="text-2xl md:text-[2.1rem] font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.2] scroll-mt-28 max-w-[26ch]"
            >
                {title}
            </h2>
            <div className="mt-7">{children}</div>
        </section>
    );
}

/**
 * An approved diagram, framed.
 *
 * These carry meaning — they are the argument, not decoration — so each one
 * gets a real alt description rather than the alt="" used on the card heroes.
 *
 * The white plate is deliberate. All three are drawn on white and the page
 * surface is a light grey, so an unframed image reads as a ragged bright patch
 * rather than as a figure. The plate makes the white the diagram's own paper.
 * It also means these survive a dark theme if one is ever added — the site is
 * currently locked to light in ThemeProvider and has no dark tokens at all.
 */
function Diagram({ src, alt, caption, eager = false }: {
    src: string;
    alt: string;
    caption: string;
    /** The opening diagram sits just under the fold and is the first thing a
     *  reader scrolls to, so it is fetched immediately. The two below it are
     *  far enough down to be worth deferring. */
    eager?: boolean;
}) {
    return (
        <figure className="rounded-3xl border cl-border-border-color-default overflow-hidden">
            {/* Scales with the column and never stretches: w-full with h-auto
                keeps each diagram on its own 1400x692 ratio at every width, and
                nothing is cropped or panned.

                The cost is legibility at the small end — on a 375px screen the
                image lands around 253px wide and the labels baked into it are
                too small to read. The alt text carries the same content for
                anyone who cannot read the picture, and the surrounding prose
                states every point the diagrams make, so nothing is lost that
                exists only in the image. A portrait export of each is the real
                fix when there is one. */}
            <div className="bg-white p-3 md:p-5">
                <img
                    src={src}
                    alt={alt}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    className="block w-full h-auto"
                />
            </div>
            <figcaption className="border-t cl-border-border-color-default cl-bg-neutral-surface-level-1 px-5 py-4 text-sm leading-relaxed cl-text-neutral-text-medium-contrast">
                {caption}
            </figcaption>
        </figure>
    );
}

export function DesignLayers() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-3xl mx-auto px-6">

                <header className="pt-10">
                    <div className="mb-8">
                        <Breadcrumbs items={[
                            { label: 'Home', path: '/' },
                            { label: 'Work', path: '/work' },
                            { label: 'From Figma Library to Executable Product Rules' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">System story</Badge>
                        <Badge variant="secondary">Design Systems</Badge>
                        <Badge variant="secondary">Product Systems</Badge>
                        <Badge variant="secondary">AI-enabled Delivery</Badge>
                    </div>

                    <h1 className="text-[2.5rem] md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.08] tracking-tight">
                        From Figma Library to Executable Product Rules
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-[1.55] font-medium max-w-[48ch]">
                        Making design decisions portable across product, engineering and AI tools.
                    </p>

                    <div className="mt-6 border-t cl-border-border-color-default pt-5 space-y-1.5">
                        <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                            Public summary · EnCulture at NHR Technologies · Assessments, Multi-Rater and
                            Culture Intelligence
                        </p>
                        <p className="text-sm cl-text-neutral-text-low-contrast leading-relaxed">
                            Role: product and UX principles, product patterns, design-system governance,
                            implementation review.
                        </p>
                    </div>
                </header>

                {/* 1 · Problem */}
                <Section id="problem" label="01 · Problem" title="One brand, many interpretations">
                    <p className={PROSE}>
                        As AI-assisted coding tools became accessible, leadership, sales and product
                        managers began building working POCs directly to test ideas and demo concepts.
                    </p>

                    <div className="mt-8">
                        <Diagram
                            src={brandInterpretations}
                            eager
                            alt="Core brand assets — logo and colours — passing through a prism labelled algorithmic interpretation and emerging as three different interface styles: retro with rounded components, angular and high-contrast, and minimal flat design."
                            caption="The same brand assets, interpreted three different ways."
                        />
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        This sped up early exploration and created friction behind it. Teams used the
                        official logo and primary colours, and the outputs still looked like completely
                        different products — from flat minimal UIs to heavy retro interfaces.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        UX started receiving subjective feedback and approval questions late in the cycle.
                        Engineering later had to reconcile inconsistent tokens, ad-hoc components and
                        conflicting styling assumptions.
                    </p>

                    <div className="mt-10">
                        <Statement tone="problem">
                            Everyone could create an interface, but everyone was interpreting the product
                            differently.
                        </Statement>
                    </div>
                </Section>

                {/* 2 · Insight */}
                <Section id="insight" label="02 · Insight" title="Access was not the same as understanding">
                    <p className={PROSE}>
                        Giving AI access to the design system was not enough. The design system needed to
                        explain its decisions.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        My first attempt connected AI workflows directly to our existing Figma components.
                        That exposed a fundamental limitation: a visual design system can contain decisions
                        that are obvious to the people who built it, but unclear to someone — or something
                        — encountering it without that context.
                    </p>

                    <div className="mt-8">
                        <Diagram
                            src={valueMeanings}
                            alt="A single green colour value fanning out to three different meanings: brand emphasis on a primary action button, analytical meaning on a positive metric chart, and system state on a completed progress indicator."
                            caption="One visual value, three legitimate meanings — and nothing in the value itself says which is intended."
                        />
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        A raw hex code or a generic visual token does not explain whether a green container
                        represents a positive analytical state, a system success toast, or a primary brand
                        action.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Figma remains our core visual design surface, collaboration space and component
                        construction environment. But visual files alone do not capture contextual
                        reasoning when non-designers or AI tools generate code directly.
                    </p>
                </Section>

                {/* 3 · Solution */}
                <Section id="solution" label="03 · Solution" title="The same rules, in the formats each role reads">
                    <p className={PROSE}>
                        To make design rules accessible outside Figma, I structured the system into
                        complementary formats, matched to how different roles consume design information.
                    </p>

                    <div className="mt-8">
                        <Diagram
                            src={governedRules}
                            alt="One shared set of governed rules at the centre, feeding outward to five consumers: Figma, CSS, Markdown, an HTML reference, and AI-assisted tools."
                            caption="One governed set of rules, expressed in five places rather than re-decided in each."
                        />
                    </div>

                    <div className="mt-8">
                        <QuadMap
                            items={[
                                {
                                    name: 'Figma',
                                    role: 'Visual design, component construction and visual collaboration.',
                                },
                                {
                                    name: 'CSS',
                                    role: 'Executable rules, semantic token mapping and layout constraints, consumed by developers and AI tools.',
                                },
                                {
                                    name: 'Markdown',
                                    role: 'Plain-language guidance explaining intent, UX rationale and usage boundaries.',
                                },
                                {
                                    name: 'HTML reference',
                                    role: 'A lightweight visual reference non-technical stakeholders can open in a browser.',
                                },
                            ]}
                        />
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        The goal was not to replace Figma. It was to make the same underlying design
                        decisions portable across UX, product, engineering, leadership and AI-assisted
                        tools.
                    </p>
                </Section>

                {/* 4 · System-Gap Governance */}
                <Section id="governance" label="04 · System-Gap Governance" title="What happens when the rule does not exist">
                    <p className={PROSE}>
                        When teams hit edge cases or missing components, ad-hoc UI patterns creep back in
                        quickly. To handle that practically, I used a straightforward loop.
                    </p>

                    <div className="mt-8">
                        <DecisionLoop
                            need="A team hits an edge case or a missing component."
                            question="Does a rule already exist?"
                            yesPath={{
                                label: 'Rule exists',
                                steps: ['Use the established pattern directly.'],
                            }}
                            noPath={{
                                label: 'Rule missing',
                                steps: [
                                    'Log the gap instead of writing a local workaround.',
                                    'Review whether it is a one-off edge case or a broader system need.',
                                    'Extend the shared rules if justified.',
                                ],
                            }}
                            returns="The answer returns to the shared system, rather than staying inside one screen."
                        />
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        This kept the system open to real product needs without losing visual coherence.
                    </p>
                </Section>

                {/* 5 · Principle-Led Architecture */}
                <Section id="architecture" label="05 · Principle-Led Architecture" title="Decisions that trace back to a business goal">
                    <p className={PROSE}>
                        To keep design decisions grounded in business goals rather than personal
                        preference, I structured the hierarchy as a chain.
                    </p>

                    <div className="mt-8">
                        <Ladder
                            steps={[
                                { name: 'Business goal' },
                                { name: 'Product principle' },
                                { name: 'UX principle' },
                                { name: 'Design-system rule' },
                                { name: 'Implementation' },
                            ]}
                        />
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        If the product direction changes, the principle changes first, then the shared
                        rule, then the implementation across the products that depend on it. That keeps
                        visual rules aligned with strategy as the product evolves.
                    </p>
                </Section>

                {/* 6 · Organizational Value */}
                <Section id="value" label="06 · Organizational Value" title="What it made possible, team by team">
                    <Points
                        items={[
                            <><strong className="cl-text-neutral-text-high-contrast">Leadership and sales</strong> — can explore ideas and show quick POCs without introducing a completely new UI language.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Product managers</strong> — can iterate on early concepts using a common structural foundation.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">UX designers</strong> — spend less time answering routine layout questions, and more on deeper user problems, accessibility and validation.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Engineering</strong> — receives clearer, more consistent implementation rules and semantic tokens.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">AI tools</strong> — can work within the same shared rules and constraints.</>,
                        ]}
                    />

                    <p className="mt-8 text-base leading-relaxed cl-text-neutral-text-low-contrast max-w-[65ch]">
                        Note: these are practical capabilities the architecture enables, not measured ROI or
                        adoption outcomes.
                    </p>
                </Section>

                {/* 7 · What Changed in My Thinking */}
                <Section id="thinking" label="07 · What changed" title="What changed in my thinking">
                    <p className={PROSE}>
                        I started by asking how AI could fit into the product workflow. I ended up changing
                        how I thought about the design system itself.
                    </p>

                    <div className="mt-8">
                        <Statement>
                            The system was no longer only a place to find components. It became a shared set
                            of rules that could move across Figma, code, product conversations and
                            AI-assisted workflows.
                        </Statement>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            to="/work/design-system-governance"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            Read the long field note
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-[15px] font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            Get in touch
                        </Link>
                    </div>
                </Section>
            </div>
        </article>
    );
}
