import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import {
    CaseStudyListenPlayer,
    type SectionChangeReason,
} from '../../components/case-study/CaseStudyListenPlayer';
import { CaseStudyJumpNav } from '../../components/case-study/CaseStudyJumpNav';
import {
    countWords,
    formatMinutes,
    minutesFor,
    NARRATION_WPM,
    READING_WPM,
} from '../../components/case-study/readingTime';
import {
    SyntheticMetricCard,
    OverloadedCard,
    PrototypeLabel,
} from '../../components/case-study/SyntheticMetricCard';
import {
    BigMetric,
    CaseMeta,
    EvidenceBlock,
    NotProven,
    Panel,
    Points,
    Stages,
    Statement,
} from '../../components/case-study/CaseStudyBeats';
import { NARRATION_SECTIONS } from './dashboardExplainability.narration';
import { ArrowRight } from 'lucide-react';

/**
 * /work/dashboard-explainability — the public case.
 *
 * Built as visual beats rather than as a document. Each section is a diagram,
 * one strong statement, and two to four short points; the prose supports that
 * structure instead of carrying the story alone.
 *
 * The test this is written against: hide every paragraph, and the headings,
 * diagrams and callouts alone should still say what the product is, what was
 * wrong, what was decided, what changed and what is not proven.
 *
 * Section numbering is gone. The jump nav already handles navigation, and
 * "01 ·" on every heading was most of what made the page feel like
 * documentation.
 *
 * NOTHING REAL IS SHOWN. Every figure is a reconstruction on synthetic data —
 * no client value, formula or threshold appears. The operating detail (card
 * hierarchy rules, colour-role model, evidence-to-decision trace,
 * recommendation traceability, implementation status) is named in the closing
 * section and lives nowhere in this file.
 */

/** Hero — an abstract reporting surface, not a product screenshot. Built from
 *  neutral blocks so it reads as a diagram of a dashboard rather than a
 *  replica of one; the accent marks the single card the case is about. */
function DashboardHeroVisual() {
    return (
        <div aria-hidden="true" className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
            <div className="flex gap-2 mb-5">
                <span className="h-2 w-24 rounded-full cl-bg-neutral-surface-level-3" />
                <span className="h-2 w-12 rounded-full cl-bg-neutral-surface-level-2" />
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                    const focus = i === 1;
                    return (
                        <div
                            key={i}
                            style={focus ? { borderColor: 'var(--cl-color-brand-primary-base)' } : undefined}
                            className={
                                'rounded-xl cl-bg-neutral-surface-level-0 p-3 md:p-4 ' +
                                (focus ? 'border-2' : 'border cl-border-border-color-default')
                            }
                        >
                            <span className="block h-1.5 w-2/3 rounded-full cl-bg-neutral-surface-level-3" />
                            <span
                                className={
                                    'block mt-3 h-5 md:h-7 rounded ' +
                                    (focus ? 'w-1/2 cl-bg-brand-primary-base' : 'w-1/3 cl-bg-neutral-surface-level-3')
                                }
                            />
                            <span className="block mt-3 h-1.5 w-full rounded-full cl-bg-neutral-surface-level-2" />
                            <span className="block mt-1.5 h-1.5 w-4/5 rounded-full cl-bg-neutral-surface-level-2" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/** Annotations on the live card. Four, each naming a decision. */
const CALLOUTS = [
    { title: 'Metric definition on demand', body: 'Opens on click or tap, never on hover — so it cannot fire by accident while someone scans.' },
    { title: 'Calculation context on the score', body: 'The number answers “how was this produced?” — inputs, weighting, previous period.' },
    { title: 'Category context on the bar', body: 'Each band explains its own share, meaning and implied action.' },
    { title: 'Colour that means one thing', body: 'A semantic scale, not the brand accent — and every band is labelled, so nothing depends on colour.' },
];

const STAGES = [
    { name: 'Read', line: 'I can see the metric.' },
    { name: 'Interpret', line: 'I understand how it was produced.' },
    { name: 'Trust', line: 'I can inspect the reasoning.', pivot: 'The stage that was missing' },
    { name: 'Act', line: 'I know what I can do next.' },
];

const JUMP_TARGETS = [
    { id: 'problem', label: 'Problem' },
    { id: 'decision', label: 'Decision' },
    { id: 'example', label: 'Example' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'limitations', label: 'Limitations' },
];

/** Narration index → section id. Same order as NARRATION_SECTIONS; the two
 *  files must be edited together. */
const NARRATION_TO_SECTION: string[] = [
    'overview',
    'problem',
    'decision',
    'example',
    'scope',
    'evidence',
    'response',
    'limitations',
];

const NARRATION_WORDS = NARRATION_SECTIONS.reduce(
    (total, s) => total + countWords(`${s.title} ${s.body}`),
    0
);
const LISTEN_MINUTES = minutesFor(NARRATION_WORDS, NARRATION_WPM);

function Heading({ label, title, id }: { label: string; title: string; id: string }) {
    return (
        <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] cl-text-neutral-text-low-contrast mb-3">
                {label}
            </p>
            <h2
                id={id}
                className="text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-tight scroll-mt-28 max-w-[24ch]"
            >
                {title}
            </h2>
        </div>
    );
}

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

    const NowReading = ({ id }: { id: string }) =>
        narratedSectionId === id ? (
            <p className="absolute top-10 left-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base" />
                Now reading
            </p>
        ) : null;

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen font-sans pb-28">

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
                        <Badge variant="secondary">Explainability</Badge>
                        <Badge variant="outline">Sanitised · synthetic examples</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight mb-6">
                        Designing Dashboards People Can Read, Trust and Act On
                    </h1>

                    <p className="text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        Decision-makers could read the numbers, but not the reasoning behind them.
                    </p>

                    <div className="mt-9">
                        <CaseMeta
                            items={[
                                ['Product', 'EnCulture · NHR Technologies'],
                                ['Environment', 'Multi-role dashboards · role-based reporting'],
                                ['Role', 'Analytics UX · Explainability · Information architecture'],
                            ]}
                        />
                    </div>

                    <div className="mt-8">
                        <DashboardHeroVisual />
                    </div>

                    <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
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

                {/* The idea the whole case exists to land */}
                <section aria-labelledby="overview" {...narratable('overview')}>
                    <h2 id="overview" className="sr-only scroll-mt-28">Overview</h2>
                    <NowReading id="overview" />
                    <Statement>
                        A number is not useful if people cannot understand what produced it, what it means, and
                        what they can do next.
                    </Statement>
                </section>

                {/* Beat 1 — the problem, as a number that answers nothing */}
                <section {...narratable('problem')}>
                    <NowReading id="problem" />
                    <Heading label="The problem" id="problem" title="A score with no reasoning attached" />
                    <Panel
                        tone="problem"
                        caption="Three questions the screen did not answer — so a person had to."
                    >
                        <BigMetric
                            value="72"
                            label="Culture metric"
                            questions={[
                                'What produced this number?',
                                'What does this colour mean?',
                                'Why is this action recommended?',
                            ]}
                        />
                    </Panel>
                    <Points
                        items={[
                            'Interpretation depended on someone from the product team explaining it.',
                            'The explanation burden had moved out of the product and into a person\'s workflow.',
                            'The weakest layer was not the layout — it was the reasoning around the number.',
                        ]}
                    />
                </section>

                {/* Beat 2 — the decision, as the central diagram */}
                <section {...narratable('decision')}>
                    <NowReading id="decision" />
                    <Heading label="The decision" id="decision" title="Read, interpret, trust, act" />
                    <Panel caption="Trust sits in the middle because it is what carries someone from understanding a number to being willing to act on it.">
                        <Stages steps={STAGES} />
                    </Panel>
                    <div className="mt-8">
                        <Statement>Trust is created through inspectability.</Statement>
                    </div>
                    <Points
                        items={[
                            'A reader does not trust a score because it is displayed.',
                            'Organisations often already use their own models and rating scales.',
                            'A number that disagrees with an existing method has to show its working.',
                        ]}
                    />
                </section>

                {/* Beat 3 — one concrete example, annotated rather than described */}
                <section {...narratable('example')}>
                    <NowReading id="example" />
                    <Heading label="What changed" id="example" title="The explanation moved into the component" />

                    <Panel caption="The card is live — open the info affordance, focus the score, or move across the bar segments.">
                        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8 items-start">
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
                        <PrototypeLabel />
                    </Panel>

                    <div className="mt-8">
                        <Statement>Clarity is not showing everything. It is showing the right level at the right moment.</Statement>
                    </div>

                    <div className="mt-8">
                        <Panel
                            label="The same card, two dispositions"
                            caption="Nothing was removed between the two. The same detail is present on the right — it simply waits until someone asks for it."
                        >
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] cl-text-neutral-text-low-contrast mb-3">
                                        Everything visible at once
                                    </p>
                                    <OverloadedCard />
                                    <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                        High availability, low hierarchy.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] cl-text-brand-primary-base mb-3">
                                        Layered explanation
                                    </p>
                                    <SyntheticMetricCard forcedPanel="none" />
                                    <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                        Meaning first; the reasoning one layer down.
                                    </p>
                                </div>
                            </div>
                            <PrototypeLabel />
                        </Panel>
                    </div>
                </section>

                {/* Scope */}
                <section {...narratable('scope')}>
                    <NowReading id="scope" />
                    <Heading label="Scope" id="scope" title="What I owned" />
                    <Points
                        columns={2}
                        items={[
                            <><strong className="cl-text-neutral-text-high-contrast">Analytics UX</strong> — what each role sees first, and what they can open.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Explainability</strong> — how a metric, a colour and a recommendation account for themselves.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Information architecture</strong> — what belongs on the summary and what belongs a layer down.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Product reasoning</strong> — connecting a number to the decision it supports.</>,
                        ]}
                    />
                </section>

                {/* Evidence */}
                <section {...narratable('evidence')}>
                    <NowReading id="evidence" />
                    <Heading label="Evidence" id="evidence" title="What this rests on" />
                    <EvidenceBlock
                        items={[
                            'Product review',
                            'Artifact review',
                            'Operational-user feedback',
                            'Client questions, reported second-hand',
                        ]}
                        note="Feedback came from a client-facing relationship manager who used the product daily — direct evidence from her own use, indirect evidence from her client conversations. It was not a formally moderated client-user study, and it is not described as one."
                    />
                </section>

                {/* Response */}
                <section {...narratable('response')}>
                    <NowReading id="response" />
                    <Heading label="Response" id="response" title="What was accepted" />
                    <Points
                        items={[
                            'The dashboard philosophy was accepted as a design direction and informed later dashboard work.',
                            'The recommended direction received positive feedback in demos and client-facing reviews.',
                            'A high-fidelity concept demonstrated the interaction model; production used different data and product-specific logic.',
                        ]}
                    />
                </section>

                {/* Limitations */}
                <section {...narratable('limitations')}>
                    <NowReading id="limitations" />
                    <Heading label="Limitations" id="limitations" title="What this does not prove" />
                    <NotProven
                        headline="No measured business outcome is claimed. This case demonstrates explainability, information hierarchy and decision-support reasoning."
                        items={[
                            'No formally moderated client-user study was conducted.',
                            'Client evidence was mediated rather than gathered directly.',
                            'No post-implementation measurement exists — no claim of increased trust, adoption or decision quality.',
                            'Every public example uses synthetic data.',
                        ]}
                    />
                </section>

                {/* Deeper detail — also the manifest for the protected layer */}
                <section className="pt-20">
                    <Heading label="Going deeper" id="deeper" title="The detailed case study" />
                    <Points
                        columns={2}
                        items={[
                            'Card hierarchy rules',
                            'The colour-role model',
                            'Evidence-to-decision trace',
                            'Recommendation traceability',
                            'Implementation and validation status',
                        ]}
                    />
                    <p className="mt-7 text-[16px] leading-relaxed cl-text-neutral-text-medium-contrast max-w-[60ch]">
                        That material includes internal product context. Detailed project evidence is available
                        for hiring and review conversations.
                    </p>
                    <div className="mt-7">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            Get in touch
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
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
