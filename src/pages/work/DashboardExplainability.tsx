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
import { NARRATION_SECTIONS } from './dashboardExplainability.narration';
import { ArrowRight, ArrowDown } from 'lucide-react';

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

/** Marks a figure as containing invented data, so no reader mistakes it
 *  for the confidential product. */
function SyntheticLabel() {
    return (
        <p className="mt-4 text-[11px] uppercase tracking-widest cl-text-neutral-text-low-contrast">
            Illustrative data created for portfolio demonstration
        </p>
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
    { item: 'Read → Interpret → Trust → Act framework', status: 'Accepted design direction' },
    { item: 'Philosophy applied across dashboard work', status: 'Implemented design solution' },
    { item: 'Metric explanation approach', status: 'Implemented in recommended direction' },
    { item: 'Chart and summary-card explanation', status: 'Implemented in recommended design' },
    { item: 'Colour semantics improvements', status: 'Implemented or incorporated — verify scope' },
    { item: 'Evidence-linked explanation', status: 'Implemented in recommended design — verify screens' },
    { item: 'Export issue', status: 'Resolved or covered — verify status' },
    { item: 'Client-facing response', status: 'Reported positive response' },
    { item: 'Adoption, trust and decision-quality impact', status: 'Not formally measured' },
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
                            The work combined dashboard and artifact analysis with feedback from a client-facing
                            relationship manager who also used the dashboard operationally. She supported clients
                            through survey participation, reviewed results with them and surfaced the questions
                            and interpretation gaps that arose during those conversations.
                        </p>
                        <p>
                            That gave <strong>direct evidence</strong> from her own product use and{' '}
                            <strong>indirect evidence</strong> from client interactions. It was not a formally
                            moderated client-user study.
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

                    {/* Visual 3 — synthetic composite metric, layered */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-6">
                            <div className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">Surface</div>
                            <div className="mt-2 flex flex-wrap items-baseline gap-3">
                                <span className="text-3xl font-bold cl-text-neutral-text-high-contrast">72</span>
                                <span className="text-base font-semibold cl-text-neutral-text-medium-contrast">Organisational Health Index</span>
                                <span className="rounded-full border cl-border-border-color-strong px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider cl-text-neutral-text-medium-contrast">
                                    Moderate
                                </span>
                            </div>

                            <div className="mt-6 pt-5 border-t cl-border-border-color-default">
                                <div className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Explanation</div>
                                <p className="text-sm cl-text-neutral-text-medium-contrast">
                                    A composite index summarising four organisational dimensions. Index score,
                                    0–100 scale. Based on the responses collected for the selected period.
                                </p>
                            </div>

                            <div className="mt-5 pt-5 border-t cl-border-border-color-default">
                                <div className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-2">Inspectability</div>
                                <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                    <li>· Contributing dimensions: Clarity · Workload · Recognition · Direction</li>
                                    <li>· Calculated from four weighted dimensions using the selected organisational model</li>
                                    <li>· Classified “Moderate” because the index sits in the middle band of the chosen scale</li>
                                    <li>· Compared with the previous period and the selected benchmark</li>
                                    <li>· Changing the model or weighting changes both the score and its classification</li>
                                </ul>
                            </div>

                            <div className="mt-5 pt-5 border-t cl-border-border-color-default">
                                <div className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Decision</div>
                                <p className="text-sm cl-text-neutral-text-medium-contrast">
                                    May indicate uneven experience across dimensions. Suggested next step: review the
                                    lowest-scoring dimension alongside its supporting evidence.
                                </p>
                            </div>
                        </div>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            The same number, progressively inspectable: what it is, how it was produced, and what
                            it implies. No proprietary formula is shown.
                        </figcaption>
                        <SyntheticLabel />
                    </figure>
                </section>

                {/* ── 6. Four design principles ──────────────────── */}
                <section {...narratable('principles')}>
                    <NowReading id="principles" />
                    <SectionHeading eyebrow="05 · Principles" id="principles" title="Four design principles" />
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

                    {/* Visual 4 — brand colour vs data colour */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <p className="text-base font-semibold cl-text-neutral-text-high-contrast mb-6">
                            Brand colour identifies the product. Data colour must explain the data.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">Brand colour</h3>
                                <p className="text-sm cl-text-neutral-text-medium-contrast">
                                    Identity, primary actions and navigation. Carries no analytical meaning — reusing
                                    it inside a chart tells the reader nothing about the data.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-3">Data colour</h3>
                                <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                    <li>· <strong>Status</strong> — positive, attention, risk</li>
                                    <li>· <strong>Category</strong> — distinguishing series, not ranking them</li>
                                    <li>· <strong>Comparison</strong> — current versus previous or benchmark</li>
                                    <li>· <strong>Interaction</strong> — hover, focus and selection states</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 pt-5 border-t cl-border-border-color-default text-sm cl-text-neutral-text-medium-contrast">
                            Each role gets one consistent meaning, reinforced by labels, legends and non-colour
                            cues so nothing depends on colour perception alone. The principle is semantic
                            consistency — not a mandatory palette.
                        </div>
                        <SyntheticLabel />
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
                        <SyntheticLabel />
                    </figure>
                </section>

                {/* ── 8. Implemented design direction ────────────── */}
                <section {...narratable('implemented')}>
                    <NowReading id="implemented" />
                    <SectionHeading eyebrow="07 · What was built on" id="implemented" title="The implemented design direction" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        The philosophy was accepted and applied across the dashboard work — carried into a final
                        recommended design covering metric explanation, chart semantics, colour logic and evidence
                        traceability.
                    </p>

                    {/* Visual 6 — synthetic dashboard fragment */}
                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-6 space-y-5">
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                                <div>
                                    <div className="text-sm font-bold cl-text-neutral-text-high-contrast">Direction &amp; Clarity</div>
                                    <p className="text-xs cl-text-neutral-text-medium-contrast">
                                        Percentage of favourable responses · current period
                                    </p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold cl-text-neutral-text-high-contrast">64%</span>
                                    <span className="rounded-full border cl-border-border-color-strong px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-medium-contrast">
                                        Attention
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs cl-text-neutral-text-medium-contrast border-y cl-border-border-color-default py-3">
                                <span className="inline-flex items-center gap-1.5">
                                    <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm cl-bg-brand-primary-base" />
                                    Current period
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm border cl-border-border-color-strong" />
                                    Previous period
                                </span>
                                <span className="cl-text-neutral-text-low-contrast">Legend explains encoding · labels shown, not colour alone</span>
                            </div>

                            <details className="rounded-lg border cl-border-border-color-default px-4 py-2.5">
                                <summary className="cursor-pointer text-sm font-semibold cl-text-neutral-text-high-contrast cl-focus-ring rounded">
                                    How this is calculated
                                </summary>
                                <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                    Share of favourable responses across the questions mapped to this dimension,
                                    using the selected organisational model. Changing the model changes both the
                                    value and its classification.
                                </p>
                            </details>

                            <div
                                style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                                className="rounded-lg border-l-2 pl-4 py-1"
                            >
                                <div className="text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base mb-1">
                                    Recommendation
                                </div>
                                <p className="text-sm cl-text-neutral-text-high-contrast">
                                    Review priority alignment with team leads.
                                </p>
                                <p className="text-xs cl-text-neutral-text-medium-contrast mt-1">
                                    Based on: this metric · three-period trend · recurring comment theme —
                                    each openable as evidence.
                                </p>
                            </div>
                        </div>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            A reconstructed pattern showing the principles together: an explained metric, a legend
                            that carries meaning, inspectable calculation and an evidence-linked recommendation.
                            Not a reproduction of the confidential product.
                        </figcaption>
                        <SyntheticLabel />
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
