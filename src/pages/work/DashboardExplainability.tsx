import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import {
    CaseStudyListenPlayer,
    type SectionChangeReason,
} from '../../components/case-study/CaseStudyListenPlayer';
import { CaseStudyJumpNav } from '../../components/case-study/CaseStudyJumpNav';
import { CaseStudyDisclosure } from '../../components/case-study/CaseStudyDisclosure';
import {
    countWords,
    formatMinutes,
    minutesFor,
    NARRATION_WPM,
    READING_WPM,
} from '../../components/case-study/readingTime';
import {
    SyntheticMetricCard,
    ParticipationCard,
    DistributionCard,
    OverloadedCard,
    PrototypeLabel,
    SEGMENTS,
    type CardPanel,
} from '../../components/case-study/SyntheticMetricCard';
import { NARRATION_SECTIONS } from './dashboardExplainability.narration';
import { ArrowRight, ArrowDown } from 'lucide-react';

/** Numbered callouts — each points at a real decision from the concept. */
const CALLOUTS: { title: string; body: string }[] = [
    { title: 'Metric definition on demand', body: 'The info affordance carries stable metric-level context. It opens on click or tap, never on hover, so it cannot fire by accident while someone scans the screen.' },
    { title: 'Calculation context on the score', body: 'The number itself answers “how was this produced?” — contributing dimensions, weighting and the previous period, kept apart from the metric definition.' },
    { title: 'Category context on the bar', body: 'Each segment explains its own band: share, meaning and the action it implies. Three narrow layers instead of one overloaded tooltip.' },
    { title: 'Semantic data colour', body: 'Band colour comes from a semantic scale, not the brand accent. The same colour means the same thing on every metric.' },
    { title: 'Labels beside every colour', body: 'The bar, legend and detail panel all repeat the band name and percentage, so nothing depends on colour perception.' },
    { title: 'Action attached to evidence', body: 'Every band ends in a next step — sustain, review or escalate — so a reader leaves with a decision, not just a number.' },
    { title: 'Width tuned for reading', body: 'The card is sized so labels and summary text never wrap awkwardly; readability was chosen over density.' },
];

/** What a summary card has to answer, in order. */
const CARD_HIERARCHY: { term: string; body: string }[] = [
    { term: 'Metric', body: 'What is being measured?' },
    { term: 'Description', body: 'What is this metric?' },
    { term: 'Primary insight', body: 'What does the current result mean?' },
    { term: 'Supporting context', body: 'Why is that interpretation credible?' },
    { term: 'Action', body: 'What should happen next?' },
];

/** The five colour roles a dashboard has to keep apart. */
const COLOUR_ROLES: { role: string; body: string }[] = [
    { role: 'Brand', body: 'Navigation, actions and product identity. Never analytical status by default.' },
    { role: 'Evaluative status', body: 'Positive, attention and risk — only where a value genuinely is better or worse.' },
    { role: 'Participation state', body: 'Completed, pending, follow-up due, unavailable. Workflow states, not judgements.' },
    { role: 'Categorical', body: 'Groups, segments and response types. Colour distinguishes; it does not rank.' },
    { role: 'Interaction state', body: 'Hover, focus and selection. Never competing with data meaning.' },
];

const STATE_SHOWCASE: { panel: CardPanel; label: string }[] = [
    { panel: 'info', label: 'Metric context — click or tap' },
    { panel: 'score', label: 'Calculation context — hover, focus or tap' },
    { panel: 'segment', label: 'Category context — hover, focus or tap' },
];

/* ------------------------------------------------------------------ *
 * Page-local building blocks. Signature to this case study; kept here
 * rather than generalised prematurely.
 * ------------------------------------------------------------------ */

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
    return (
        <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </div>
            <h2
                id={id}
                className="text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-tight scroll-mt-28"
            >
                {title}
            </h2>
        </div>
    );
}

/** Evidence / status chip. Meaning always carried by text, never colour. */
function StatusTag({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider cl-text-neutral-text-medium-contrast">
            {/* No whitespace-nowrap: several status strings are long enough to
                force document-level horizontal overflow on a 375px screen. */}
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base shrink-0" />
            {label}
        </span>
    );
}

const FRAMEWORK = [
    {
        stage: 'Read',
        question: 'What am I seeing?',
        need: 'Definition, unit, score type and response base',
        risk: 'Unclear metric',
    },
    {
        stage: 'Interpret',
        question: 'What does it mean?',
        need: 'Scale, category boundaries and comparison context',
        risk: 'Ambiguous meaning',
    },
    {
        stage: 'Trust',
        question: 'Can I inspect how this was produced?',
        need: 'Contributing inputs, calculation logic and supporting evidence',
        risk: 'Low confidence',
    },
    {
        stage: 'Act',
        question: 'What should happen next?',
        need: 'Decision implication, next action and ownership',
        risk: 'Insight without action',
    },
];

const PRINCIPLES = [
    {
        name: 'Explain the number',
        body: 'What the metric represents, whether it is a score, percentage, index or count, which inputs contributed, what rating model produced it at an appropriate level, what the result means and what action it supports.',
    },
    {
        name: 'Explain the colour',
        body: 'Brand colour identifies the product; data colour must explain the data. Each colour needs one defined analytical purpose, consistent meaning, supporting labels and accessible non-colour cues.',
    },
    {
        name: 'Show the evidence',
        body: 'Scores, summaries and recommendations connect to their contributing metrics, charts and qualitative evidence — with the originating question or category context preserved.',
    },
    {
        name: 'Support the decision',
        body: 'Why the information matters, what decision it supports, what should happen next, who owns the action, and what evidence makes that action defensible.',
    },
];

const DECISIONS = [
    {
        evidence: 'Composite score appeared without clear calculation context',
        source: 'Artifact review',
        insight: 'A label alone did not create trust',
        decision: 'Add metric definition, inputs, scale and an explanation of the calculation logic',
        status: 'Implemented design direction',
    },
    {
        evidence: 'Readers compared the displayed score with their own rating models',
        source: 'Indirect client feedback',
        insight: 'Trust depended on comparability and inspectability',
        decision: 'Show the methodology and explain how configuration affects the result',
        status: 'Implemented design direction',
    },
    {
        evidence: 'Brand and data colours were mixed across the interface',
        source: 'Artifact review',
        insight: 'Product identity colour did not communicate analytical meaning',
        decision: 'Separate brand colour from semantic data colour, with consistent rules and legends',
        status: 'Implemented or incorporated — verify scope',
    },
    {
        evidence: 'Recommendations appeared without visible supporting evidence',
        source: 'Artifact review',
        insight: 'Unsourced advice was difficult to explain or defend to a client',
        decision: 'Link each recommendation to its metric, chart and qualitative evidence',
        status: 'Implemented in recommended design — verify screens',
    },
    {
        evidence: 'Interpretation frequently required manual explanation',
        source: 'Direct operational-user feedback',
        insight: 'The explanation burden had moved from the product to a person',
        decision: 'Build explanation directly into cards, charts and summaries',
        status: 'Accepted and implemented direction',
    },
];

const IMPLEMENTED = [
    { item: 'Dashboard UX philosophy', status: 'Accepted design direction' },
    { item: 'Read → Interpret → Trust → Act framework', status: 'Incorporated into the dashboard philosophy' },
    { item: 'Philosophy informing subsequent dashboard work', status: 'Accepted design direction' },
    { item: 'Summary-card explanation model', status: 'Demonstrated in prototype' },
    { item: 'Metric, score and segment explanation layers', status: 'Demonstrated in prototype' },
    { item: 'Semantic colour separation', status: 'Demonstrated in prototype' },
    { item: 'Evidence-linked recommendation', status: 'Demonstrated in prototype' },
    { item: 'The HTML concept itself', status: 'High-fidelity concept prototype' },
    { item: 'Shipped product', status: 'Production implementation differed' },
    { item: 'Client-facing response', status: 'Reported positive response' },
    { item: 'Adoption, trust and decision-quality impact', status: 'Effect not formally measured' },
];

const JUMP_TARGETS = [
    { id: 'explanation-burden', label: 'Problem' },
    { id: 'framework', label: 'Framework' },
    { id: 'inspectability', label: 'Inspectability' },
    { id: 'principles', label: 'Principles' },
    { id: 'decisions', label: 'Decisions' },
    { id: 'outcome', label: 'Outcome' },
    { id: 'limitations', label: 'Limitations' },
];

/** Narration section index → visible section id, for the "Now reading" mark. */
const NARRATION_TO_SECTION: string[] = [
    'overview',              // 0 Overview
    'explanation-burden',    // 1 The explanation burden
    'evidence-environment',  // 2 Evidence environment
    'framework',             // 3 Read → Interpret → Trust → Act
    'inspectability',        // 4 Trust through inspectability
    'principles',            // 5 Design principles
    'decisions',             // 6 Key decisions
    'implemented',           // 7 Implemented direction
    'outcome',               // 8 Outcome
    'limitations',           // 9 Limitations and reflection
];

/** Listen estimate from the curated transcript only — a shorter, separate
 *  source from the visible page. Computed at module load, never hardcoded. */
const NARRATION_WORDS = NARRATION_SECTIONS.reduce(
    (total, s) => total + countWords(`${s.title} ${s.body}`),
    0
);
const LISTEN_MINUTES = minutesFor(NARRATION_WORDS, NARRATION_WPM);

export function DashboardExplainability() {
    const proseRef = useRef<HTMLDivElement>(null);
    const [readMinutes, setReadMinutes] = useState<number | null>(null);

    useEffect(() => {
        if (!proseRef.current) return;
        setReadMinutes(minutesFor(countWords(proseRef.current.innerText || ''), READING_WPM));
    }, []);

    const timingLine = useMemo(() => {
        const listen = `${formatMinutes(LISTEN_MINUTES)} listen`;
        return readMinutes ? `${formatMinutes(readMinutes)} read · ${listen}` : listen;
    }, [readMinutes]);

    const [narratedSectionId, setNarratedSectionId] = useState<string | null>(null);

    const handleSectionChange = useCallback(
        (index: number | null, reason: SectionChangeReason) => {
            if (index === null) {
                setNarratedSectionId(null);
                return;
            }
            const id = NARRATION_TO_SECTION[index] ?? null;
            setNarratedSectionId(id);
            // Scroll only on deliberate Play/Repeat — never on automatic advance.
            if (reason !== 'start' || !id) return;
            const el = document.getElementById(id);
            if (!el) return;
            const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        },
        []
    );

    const narratable = (id: string) => {
        const active = narratedSectionId === id;
        return {
            'aria-current': active ? ('true' as const) : undefined,
            style: active
                ? {
                    backgroundColor:
                        'color-mix(in srgb, var(--cl-color-brand-primary-base) 7%, transparent)',
                    borderColor: 'var(--cl-color-brand-primary-base)',
                }
                : undefined,
            className:
                'relative pt-20 -mx-5 pl-4 pr-5 rounded-2xl border-l-2 border-transparent ' +
                'transition-colors motion-reduce:transition-none',
        };
    };

    /** Absolutely positioned in the section's existing top padding, so
     *  activation causes no layout shift. */
    const NowReading = ({ id }: { id: string }) =>
        narratedSectionId === id ? (
            <p className="absolute top-10 left-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base" />
                Now reading
            </p>
        ) : null;

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen font-sans pb-28">

            {/* ── 1. Hero + confidentiality note ─────────────────── */}
            <header className="pt-10 pb-10 border-b cl-border-border-color-default">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-8">
                        <Breadcrumbs items={[
                            { label: 'Home', path: '/' },
                            { label: 'Work', path: '/work' },
                            { label: 'Designing Dashboards People Can Read, Trust and Act On' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">Analytics UX</Badge>
                        <Badge variant="secondary">Enterprise SaaS</Badge>
                        <Badge variant="secondary">Explainability</Badge>
                        <Badge variant="secondary">Design Systems</Badge>
                        <Badge variant="outline">Sanitised enterprise case study</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight mb-6">
                        Designing Dashboards People Can Read, Trust and Act On
                    </h1>

                    <p className="text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        A confidential enterprise dashboard review showed that both decision-makers and
                        client-facing teams needed clearer explanations of how metrics, colours, evidence and
                        recommendations were produced.
                    </p>

                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-5 text-base cl-text-neutral-text-medium-contrast"
                    >
                        This case study uses synthetic examples and anonymised findings. Full evidence can be
                        discussed privately during interviews.
                    </p>

                    <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Focus </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">Analytics UX &amp; Explainability</span>
                        </span>
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Method </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">Product &amp; artifact review</span>
                        </span>
                        <span className="font-semibold cl-text-neutral-text-high-contrast">{timingLine}</span>
                    </div>

                    <div className="mt-6">
                        <CaseStudyJumpNav items={JUMP_TARGETS} />
                    </div>
                </div>
            </header>

            <CaseStudyListenPlayer
                sections={NARRATION_SECTIONS}
                estimatedDuration={formatMinutes(LISTEN_MINUTES)}
                onSectionChange={handleSectionChange}
            />

            <div ref={proseRef} className="max-w-4xl mx-auto px-6">

                {/* Central question */}
                <section aria-labelledby="overview" {...narratable('overview')}>
                    <h2 id="overview" className="sr-only scroll-mt-28">Overview</h2>
                    <NowReading id="overview" />
                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="text-xl md:text-2xl font-medium cl-text-neutral-text-high-contrast leading-relaxed border-l-2 pl-6"
                    >
                        How can an enterprise dashboard help users read, interpret, trust and act without
                        requiring an expert to explain the screen?
                    </p>
                </section>

                {/* ── 2. The explanation burden ──────────────────── */}
                <section {...narratable('explanation-burden')}>
                    <NowReading id="explanation-burden" />
                    <SectionHeading eyebrow="01 · The problem" id="explanation-burden" title="The explanation burden" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The dashboard had two connected jobs: help decision-makers understand and act on
                            results, and help client-facing teams explain those results consistently and
                            confidently. In practice, interpretation frequently depended on explanation from the
                            product team — the explanation burden had moved out of the product and into a
                            person's workflow.
                        </p>
                        <p>
                            The strongest issues were not primarily visual — not a claim that layout was without
                            problems, but where the clearest signals sat: in the{' '}
                            <strong>explanation layer</strong> around metrics, colours, evidence and action.
                        </p>
                    </div>

                    {/* Visual 1 — two-user explanation model */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <div className="grid md:grid-cols-3 items-center gap-4 text-center">
                            <div className="rounded-xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-4 py-5">
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast">Decision-maker</div>
                                <p className="text-xs cl-text-neutral-text-medium-contrast mt-1">Needs to understand and act</p>
                            </div>
                            <div className="rounded-xl border-2 cl-border-border-color-strong cl-bg-neutral-surface-level-0 px-4 py-5">
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast">Dashboard</div>
                                <p className="text-xs cl-text-neutral-text-medium-contrast mt-1">Metrics · charts · evidence · recommendations</p>
                            </div>
                            <div className="rounded-xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-4 py-5">
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast">Client-facing interpreter</div>
                                <p className="text-xs cl-text-neutral-text-medium-contrast mt-1">Needs to explain results consistently</p>
                            </div>
                        </div>

                        <div
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="mt-5 rounded-xl border border-dashed px-5 py-4"
                        >
                            <div className="text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base mb-2">
                                Shared explanation layer
                            </div>
                            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm cl-text-neutral-text-medium-contrast">
                                <li>· What does this metric mean?</li>
                                <li>· How was it calculated?</li>
                                <li>· Why is this colour shown?</li>
                                <li>· What evidence supports it?</li>
                                <li>· What should happen next?</li>
                            </ul>
                        </div>

                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            Both roles depend on the same explanation layer. When it is thin, the burden lands on
                            whoever is standing closest to the client.
                        </figcaption>
                    </figure>
                </section>

                {/* ── 3. Evidence environment ────────────────────── */}
                <section {...narratable('evidence-environment')}>
                    <NowReading id="evidence-environment" />
                    <SectionHeading eyebrow="02 · Evidence" id="evidence-environment" title="What this is based on" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The work combined dashboard and artifact analysis with feedback from a{' '}
                            <strong>client-facing relationship manager and operational dashboard user</strong>.
                            She supported clients through survey participation, reviewed results with them and
                            surfaced the questions and interpretation gaps that arose during those conversations.
                        </p>
                        <p>
                            That gave <strong>direct evidence</strong> from her own product use and{' '}
                            <strong>indirect evidence</strong> from client interactions. It was not a formally
                            moderated client-user study. Her feedback showed that the dashboard needed to support
                            both concise decision-making and deeper explanation during client conversations.
                        </p>
                    </div>

                    <div className="mt-8">
                        <CaseStudyDisclosure summary="Review methodology and evidence labels">
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-3">What was reviewed</h3>
                                    <ul className="space-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· Dashboard and artifact analysis</li>
                                        <li>· Metric-card, chart and legend review</li>
                                        <li>· Comments and qualitative-insight review</li>
                                        <li>· Recommendation review</li>
                                        <li>· Export and operational-flow review</li>
                                        <li>· Design-system and interaction review</li>
                                        <li>· Implementation review</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-high-contrast mb-3">Evidence labels used</h3>
                                    <ul className="space-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· Observed in artifact review</li>
                                        <li>· Direct operational-user feedback</li>
                                        <li>· Client-facing usability evidence</li>
                                        <li>· Indirect client feedback</li>
                                        <li>· Stakeholder and domain-expert input</li>
                                        <li>· Design interpretation</li>
                                        <li>· Accepted design direction</li>
                                        <li>· Implemented design solution</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-6 text-sm cl-text-neutral-text-low-contrast">
                                Mediated client feedback is never labelled as direct client research, and
                                management or domain input is never described as a formal interview.
                            </p>
                        </CaseStudyDisclosure>
                    </div>
                </section>

                {/* ── 4. Read → Interpret → Trust → Act ──────────── */}
                <section {...narratable('framework')}>
                    <NowReading id="framework" />
                    <SectionHeading eyebrow="03 · The framework" id="framework" title="Read → Interpret → Trust → Act" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Four things a reader needs, in order. <strong>Trust</strong> sits in the middle because it
                        is what carries someone from understanding a number to being willing to act on it.
                    </p>

                    {/* Visual 2 — the framework as one continuous flow */}
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-6">
                        {FRAMEWORK.map((s, i) => {
                            const isTrust = s.stage === 'Trust';
                            return (
                                <li key={s.stage} className="relative">
                                    <span
                                        aria-hidden="true"
                                        style={isTrust ? { borderColor: 'var(--cl-color-brand-primary-base)' } : undefined}
                                        className={
                                            'absolute -left-[1.85rem] top-1.5 w-2.5 h-2.5 rounded-full border-2 cl-bg-neutral-surface-level-0 ' +
                                            (isTrust ? '' : 'cl-border-border-color-default')
                                        }
                                    />
                                    <div className="flex flex-wrap items-baseline gap-x-3">
                                        <span className="text-sm font-mono cl-text-neutral-text-low-contrast">{`0${i + 1}`}</span>
                                        <h3 className={
                                            'text-lg font-bold ' +
                                            (isTrust ? 'cl-text-brand-primary-base' : 'cl-text-neutral-text-high-contrast')
                                        }>
                                            {s.stage}
                                        </h3>
                                        <span className="italic cl-text-neutral-text-medium-contrast">“{s.question}”</span>
                                    </div>
                                    <p className="text-base cl-text-neutral-text-medium-contrast mt-1">{s.need}</p>
                                    <p className="text-sm cl-text-neutral-text-low-contrast mt-0.5">
                                        Risk when missing: {s.risk}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>

                    <p className="mt-8 text-base leading-relaxed cl-text-neutral-text-medium-contrast">
                        When one of these stages is weak, readers are more likely to depend on additional
                        explanation or decide with incomplete context. A working model from this review — not a
                        universal law.
                    </p>
                </section>

                {/* ── 5. Trust through inspectability ────────────── */}
                <section {...narratable('inspectability')}>
                    <NowReading id="inspectability" />
                    <SectionHeading eyebrow="04 · The core idea" id="inspectability" title="Trust is created through inspectability" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            A reader does not trust a score because it is displayed. Trust develops when they can
                            inspect how it was calculated, see which inputs contributed, compare it against their
                            own understanding, and see how configuration changes the result.
                        </p>
                        <p>
                            A composite score cannot rely on its label alone. Organisations may already use their
                            own models and rating scales — so a number that disagrees with an existing method
                            needs to show its working, not just its result.
                        </p>
                    </div>

                    {/* Visual 3 — reconstructed summary card + numbered callouts.
                        Anatomy, layering and action guidance follow the private
                        high-fidelity concept; every value is fictional. */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-8 items-start">
                            <SyntheticMetricCard />
                            <ol className="space-y-4">
                                {CALLOUTS.map((c, i) => (
                                    <li key={c.title} className="flex gap-3">
                                        <span className="shrink-0 w-6 h-6 rounded-full border cl-border-border-color-strong cl-bg-neutral-surface-level-0 flex items-center justify-center text-[11px] font-bold font-mono cl-text-brand-primary-base">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold cl-text-neutral-text-high-contrast">{c.title}</p>
                                            <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">{c.body}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            The card is live — open the info affordance, focus the score, or move across the bar
                            segments to see each explanation layer.
                        </figcaption>
                        <PrototypeLabel />
                    </figure>

                    {/* Visual 3b — the same card in each explanation state */}
                    <figure className="mt-6 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-5">
                            One component, three explanation layers
                        </p>
                        <div className="grid md:grid-cols-3 gap-5">
                            {STATE_SHOWCASE.map((s) => (
                                <div key={s.panel}>
                                    <p className="text-xs font-semibold cl-text-neutral-text-medium-contrast mb-2">{s.label}</p>
                                    <SyntheticMetricCard forcedPanel={s.panel} forcedSegment="watch" />
                                </div>
                            ))}
                        </div>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            Keeping the layers separate is deliberate — one combined tooltip would have to answer
                            three different questions at once.
                        </figcaption>
                        <PrototypeLabel />
                    </figure>
                </section>

                {/* ── 6. Four core principles + disclosure + card rule ── */}
                <section {...narratable('principles')}>
                    <NowReading id="principles" />
                    <SectionHeading eyebrow="05 · Principles" id="principles" title="Four core explanation principles" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Four core explanation principles, supported by one cross-cutting progressive-disclosure
                        principle.
                    </p>
                    <ol className="space-y-6">
                        {PRINCIPLES.map((p, i) => (
                            <li key={p.name} className="flex gap-5">
                                <span className="text-sm font-mono font-bold cl-text-brand-primary-base pt-1 shrink-0">
                                    {`0${i + 1}`}
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{p.name}</h3>
                                    <p className="text-base cl-text-neutral-text-medium-contrast mt-1 leading-relaxed">{p.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    {/* Component-level rule — sits below the four, not beside them */}
                    <div className="mt-10 rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                        <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">
                            Component rule
                        </p>
                        <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-3">
                            One card, one primary insight
                        </h3>
                        <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                            A summary card should not ask the reader to interpret several competing messages. It
                            should surface one primary insight, support it with evidence and make the next action
                            clear.
                        </p>
                        <dl className="mt-5 grid sm:grid-cols-2 gap-x-10 gap-y-3">
                            {CARD_HIERARCHY.map((h) => (
                                <div key={h.term}>
                                    <dt className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">{h.term}</dt>
                                    <dd className="text-sm cl-text-neutral-text-medium-contrast">{h.body}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-5 text-sm cl-text-neutral-text-medium-contrast">
                            The three are easy to blur: a <strong>description</strong> defines the metric, an{' '}
                            <strong>insight</strong> explains what this result means, and a{' '}
                            <strong>recommendation</strong> says what to do next.
                        </p>
                        <p
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="mt-5 border-l-2 pl-5 text-base font-semibold cl-text-neutral-text-high-contrast"
                        >
                            One metric, one insight, one next action.
                        </p>
                    </div>

                    {/* Fifth principle — cross-cutting, not a fifth card */}
                    <div className="mt-10 pt-8 border-t cl-border-border-color-default">
                        <div className="flex items-baseline gap-3 mb-3">
                            <span className="text-sm font-mono font-bold cl-text-brand-primary-base">05</span>
                            <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">
                                Disclose detail on demand
                            </h3>
                        </div>
                        <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                            The first four principles decide <em>what</em> a dashboard has to explain. This one
                            decides <em>when</em> — and it is what keeps the other four from burying the signal.
                            Feedback from a client-facing operational user showed that the dashboard needed to
                            support both concise decision-making and deeper explanation during client
                            conversations.
                        </p>
                        <p
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="mt-5 border-l-2 pl-5 text-base font-medium cl-text-neutral-text-high-contrast"
                        >
                            Clarity does not mean showing everything. It means showing the right level of
                            information at the right moment. The summary stays simple; the reasoning remains
                            available.
                        </p>

                        {/* Two information needs, one screen */}
                        <div className="mt-8 grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">
                                    Senior decision-maker — by default
                                </h4>
                                <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                    <li>· The key metric</li>
                                    <li>· Current status</li>
                                    <li>· A short interpretation</li>
                                    <li>· The primary implication</li>
                                    <li>· The next action</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">
                                    Client-facing operational user — on demand
                                </h4>
                                <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                    <li>· Metric definition</li>
                                    <li>· Calculation context and contributing inputs</li>
                                    <li>· Category meaning</li>
                                    <li>· Supporting evidence</li>
                                    <li>· Explanation usable in a client conversation</li>
                                </ul>
                            </div>
                        </div>
                        <p className="mt-5 text-sm cl-text-neutral-text-low-contrast leading-relaxed">
                            Senior decision-makers needed a concise view of the most important signal, while
                            client-facing operational users needed access to the explanation behind it. One screen,
                            two depths — rather than two products.
                        </p>

                        {/* Visual 5 — before / after disclosure */}
                        <figure className="mt-8 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">
                                        Everything visible at once
                                    </p>
                                    <OverloadedCard />
                                    <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                        High information availability, low information hierarchy.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">
                                        Layered explanation
                                    </p>
                                    <SyntheticMetricCard forcedPanel="none" />
                                    <p className="mt-3 text-xs font-semibold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                                        Available on demand
                                    </p>
                                    <ul className="mt-1.5 space-y-1 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· Metric information</li>
                                        <li>· How this score was calculated</li>
                                        <li>· Segment explanation</li>
                                        <li>· Supporting evidence</li>
                                    </ul>
                                    <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                        Essential meaning first; deeper reasoning on demand.
                                    </p>
                                </div>
                            </div>
                            <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                                Nothing was removed between the two. The same detail is present on the right —
                                it simply waits until someone asks for it.
                            </figcaption>
                            <PrototypeLabel />
                        </figure>
                    </div>

                    {/* Visual 4 — semantic colour shown on the same component */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <p className="text-base font-semibold cl-text-neutral-text-high-contrast mb-5">
                            Brand colour identifies the product. Data colour explains the data.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <SyntheticMetricCard forcedPanel="none" />
                            <div className="space-y-5">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Brand accent</h4>
                                    <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                                        Used only for chrome and actions — the “Explore” link on the card. It carries no
                                        analytical meaning, so it never fills a bar segment.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Semantic data colour</h4>
                                    <ul className="space-y-2">
                                        {SEGMENTS.map((s) => (
                                            <li key={s.key} className="flex items-baseline gap-2 text-sm cl-text-neutral-text-medium-contrast">
                                                <span
                                                    aria-hidden="true"
                                                    style={{ backgroundColor: `var(--cl-color-semantic-${s.token}-500)` }}
                                                    className="w-2.5 h-2.5 rounded-sm shrink-0 translate-y-0.5"
                                                />
                                                <span>
                                                    <strong className="cl-text-neutral-text-high-contrast">{s.name}</strong>
                                                    {' '}— one fixed meaning across every metric, always paired with its label
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-sm cl-text-neutral-text-low-contrast leading-relaxed">
                                    Because each colour is labelled in the bar, the legend and the detail panel, the
                                    component still reads in greyscale. The principle is semantic consistency, not a
                                    mandatory palette.
                                </p>
                            </div>
                        </div>

                        {/* Five colour roles — the evaluative palette is only one of them */}
                        <div className="mt-8 pt-6 border-t cl-border-border-color-default">
                            <p className="text-base font-semibold cl-text-neutral-text-high-contrast mb-4">
                                Different data meanings require different colour systems.
                            </p>
                            <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                                {COLOUR_ROLES.map((r) => (
                                    <div key={r.role}>
                                        <dt className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-1">{r.role}</dt>
                                        <dd className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">{r.body}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Participation semantics — the most common misuse */}
                        <div className="mt-6 rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-6">
                            <p className="text-base font-semibold cl-text-neutral-text-high-contrast">
                                Missing data is not bad data. Pending is a state, not a risk.
                            </p>
                            <p className="mt-2 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                                Reaching for red, amber and green on every metric invents meaning that isn't there.
                                Someone who has not answered yet has not failed — colouring them red makes a neutral
                                workflow state feel punitive, and quietly tells a leader to worry about the wrong thing.
                                Not every incomplete or missing state is negative.
                            </p>
                            <div className="mt-5">
                                <ParticipationCard />
                            </div>
                            <p className="mt-4 text-sm cl-text-neutral-text-low-contrast">
                                Completed reads as done, follow-up uses amber only where a reminder is genuinely due,
                                pending stays neutral, and red is reserved for an actual failure. Every state is
                                labelled, so none of this depends on colour alone.
                            </p>
                        </div>

                        <PrototypeLabel />
                    </figure>
                </section>

                {/* ── 7. Evidence → Insight → Decision ───────────── */}
                <section {...narratable('decisions')}>
                    <NowReading id="decisions" />
                    <SectionHeading eyebrow="06 · Decisions" id="decisions" title="Evidence → insight → decision" />
                    <ol className="space-y-6">
                        {DECISIONS.map((d, i) => (
                            <li key={i} className="border-t cl-border-border-color-default pt-5">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <StatusTag label={d.source} />
                                    <StatusTag label={d.status} />
                                </div>
                                <p className="text-base font-semibold cl-text-neutral-text-high-contrast">{d.evidence}</p>
                                <p className="text-sm cl-text-neutral-text-medium-contrast mt-1">{d.insight}</p>
                                <p className="text-base cl-text-neutral-text-high-contrast mt-2">
                                    <span className="text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base mr-2">Decision</span>
                                    {d.decision}
                                </p>
                            </li>
                        ))}
                    </ol>

                    {/* Visual 5 — recommendation to evidence traceability */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <div className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-5">
                            Making a recommendation defensible
                        </div>
                        <ol className="space-y-3">
                            {[
                                { k: 'Metric', v: 'Team Alignment Score declined' },
                                { k: 'Chart pattern', v: 'Three-period downward trend' },
                                { k: 'Qualitative evidence', v: 'Repeated theme around unclear priorities' },
                                { k: 'Interpretation', v: 'Alignment is weakening, not workload' },
                                { k: 'Recommendation', v: 'Review role and priority alignment' },
                                { k: 'Next action', v: 'Leadership discussion using team-level evidence' },
                            ].map((step, i, arr) => (
                                <li key={step.k}>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                        <span className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast sm:w-44 shrink-0">{step.k}</span>
                                        <span className="text-base font-semibold cl-text-neutral-text-high-contrast">{step.v}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <ArrowDown aria-hidden="true" className="w-4 h-4 my-1 cl-text-brand-primary-base sm:ml-48" />
                                    )}
                                </li>
                            ))}
                        </ol>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            Every step stays inspectable, so the recommendation can be explained to a client
                            rather than taken on faith.
                        </figcaption>
                        <PrototypeLabel />
                    </figure>
                </section>

                {/* ── 8. Implemented design direction ────────────── */}
                <section {...narratable('implemented')}>
                    <NowReading id="implemented" />
                    <SectionHeading eyebrow="07 · What was built on" id="implemented" title="The implemented design direction" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        The design philosophy was accepted and informed subsequent dashboard work. A high-fidelity
                        HTML concept was created to demonstrate the proposed interaction model using illustrative
                        content. The production implementation used different data and product-specific logic.
                    </p>

                    {/* Visual 6 — compact composition built from the same card */}
                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        {/* Three kinds of data, three colour systems — evaluative,
                            participation state, and categorical distribution. */}
                        <div className="grid md:grid-cols-3 gap-5 items-start">
                            <SyntheticMetricCard compact forcedPanel="none" />
                            <ParticipationCard />
                            <DistributionCard />
                        </div>

                        <div
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="mt-5 rounded-xl border-l-2 cl-bg-neutral-surface-level-0 px-5 py-4"
                        >
                            <div className="text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base mb-1">
                                Recommendation
                            </div>
                            <p className="text-sm cl-text-neutral-text-high-contrast">
                                Review priority alignment with team leads.
                            </p>
                            <p className="text-xs cl-text-neutral-text-medium-contrast mt-1">
                                Based on: the index above · its middle-band share · a recurring comment theme —
                                each openable as evidence.
                            </p>
                        </div>

                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            Three kinds of data, three colour systems: an evaluative index, a participation state
                            where pending stays neutral, and a categorical split where colour distinguishes rather
                            than ranks. A reconstruction of the concept, not the production product.
                        </figcaption>
                        <PrototypeLabel />
                    </figure>

                    <div className="mt-8">
                        <CaseStudyDisclosure summary="View implementation and validation status">
                            <ul className="space-y-3">
                                {IMPLEMENTED.map((r) => (
                                    <li key={r.item} className="flex flex-wrap items-center justify-between gap-3 border-b cl-border-border-color-default pb-2.5">
                                        <span className="text-sm cl-text-neutral-text-high-contrast">{r.item}</span>
                                        <StatusTag label={r.status} />
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-5 text-sm cl-text-neutral-text-low-contrast">
                                Items marked “verify” are stated conservatively until the exact implementation
                                scope is confirmed.
                            </p>
                        </CaseStudyDisclosure>
                    </div>
                </section>

                {/* ── 9. Outcome and response ────────────────────── */}
                <section {...narratable('outcome')}>
                    <NowReading id="outcome" />
                    <SectionHeading eyebrow="08 · Outcome" id="outcome" title="Outcome and response" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The dashboard philosophy was accepted and implemented across the dashboard
                            experience. The recommended direction received positive feedback during demos and
                            client-facing reviews. <strong>No formal post-implementation measurement was
                            conducted.</strong>
                        </p>
                    </div>
                    <ul className="mt-6 space-y-2.5 text-base cl-text-neutral-text-medium-contrast">
                        {[
                            'Created a dashboard UX philosophy.',
                            'Created and presented a prioritised UX and product action plan.',
                            'Translated stakeholder feedback and artifact findings into implementation-ready recommendations.',
                            'Produced interaction concepts for metric explanation and evidence traceability.',
                            'Clarified privacy-aware follow-up and drill-down patterns, which also needed to reduce the risk of individual inference.',
                            'Identified areas requiring further validation.',
                        ].map((o) => (
                            <li key={o} className="flex gap-3">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{o}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-base cl-text-neutral-text-low-contrast">
                        Because there was no measurement, this case makes no claim of increased trust, increased
                        adoption, reduced support requests or improved decision quality.
                    </p>
                </section>

                {/* ── 10. Limitations and reflection ─────────────── */}
                <section {...narratable('limitations')}>
                    <NowReading id="limitations" />
                    <SectionHeading eyebrow="09 · Limitations" id="limitations" title="Limitations and reflection" />
                    <ul className="space-y-2.5 text-base cl-text-neutral-text-medium-contrast">
                        {[
                            'No formally moderated client-user study was conducted.',
                            'Client evidence was mediated through the relationship manager rather than gathered directly.',
                            'No formal post-implementation measurement exists.',
                            'The exact implementation scope of some elements still requires verification.',
                            'All public examples use synthetic data; no real values, formulas or thresholds appear.',
                        ].map((l) => (
                            <li key={l} className="flex gap-3">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{l}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The strongest contribution was not a new dashboard layout. It was creating a clearer
                            explanation model for how metrics, charts, evidence and recommendations should help
                            readers move from seeing information to acting on it.
                        </p>
                        <p>
                            That does not establish the previous layout was correct, and it has not been tested in
                            measured use. What it changed is where the explanation lives — moving it from a
                            person's workflow back into the product, where both the decision-maker and the person
                            explaining the data can reach it.
                        </p>
                    </div>
                </section>
            </div>

            <footer className="mt-28 pt-16 border-t cl-border-border-color-default">
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
