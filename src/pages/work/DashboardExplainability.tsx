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
    Compare,
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
 * Shape: this happened → who was reading it → what I observed → what that
 * changed → what I designed → what was and was not implemented → what is still
 * unknown. Deliberately not the same structure as /work/respondent-experience;
 * the two share clarity, not a template.
 *
 * HIERARCHY — the thing most likely to erode in a later edit.
 *
 *   1. Read → Interpret → Trust → Act is the primary story model.
 *   2. "Trust is created through inspectability" is the primary insight.
 *   3. The four explanation rules SUPPORT the model. They are deliberately not
 *      numbered, not headed, and not given equal billing — promoting them into
 *      a second framework is the failure mode this comment exists to prevent.
 *      "Disclose detail on demand" cuts across all four rather than being a
 *      fifth of the same kind.
 *   4. "One metric, one insight, one next action" is a component-level rule and
 *      sits inside a paragraph, not on a heading.
 *
 * The two story anchors are the relationship manager and the 72. Everything
 * else is support.
 *
 * SOURCE. The dashboard-explainability knowledge base
 * (Craftlayers V2/Hariteja Knowledge base/case-study-dashboard-explainability.md)
 * and the copy approved on 2026-09-12. The author is the source of truth for
 * this story; do not reinterpret it from other material.
 *
 * NOTHING REAL IS SHOWN. Every figure is a reconstruction on synthetic data —
 * no client value, formula or threshold appears. The 72 is illustrative.
 *
 * STATUS LANGUAGE IS EXACT. The implementation table uses the approved wording:
 * accepted design direction / implemented design solution / not formally
 * measured. Do not soften these into "positive feedback" or "informed later
 * work", and do not add an item whose status the record marks as unverified —
 * the export item is omitted for exactly that reason.
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
    { name: 'Read', line: 'What am I seeing?' },
    { name: 'Interpret', line: 'What does it mean?' },
    { name: 'Trust', line: 'Can I inspect how this was produced?', pivot: 'The stage that was missing' },
    { name: 'Act', line: 'What should happen next?' },
];

/** The four explanation rules. Presented as a definition list under a lowercase
 *  lead-in, never as a numbered manifesto — see the hierarchy note above. */
const RULES: [string, string][] = [
    ['Explain the number', 'What it represents, what contributed, what it means, what action it supports.'],
    ['Explain the colour', 'Brand colour identifies the product; data colour has to explain the data. Semantic consistency, not a mandated palette.'],
    ['Show the evidence', 'Scores and recommendations connect back to contributing metrics, charts and qualitative evidence.'],
    ['Support the decision', 'Why it matters, what to do, who owns it, what makes it defensible.'],
];

/** Who reads the dashboard, and at what depth. The depth difference is the
 *  point — treating every role the same was part of the problem. */
const READERS: [string, string][] = [
    ['Leadership and senior decision-makers', 'The essential signal first.'],
    ['Managers and HR/programme owners', 'The signal, plus enough context to act at their level.'],
    ['Client-facing operational users', 'Metric definitions, calculation context, contributing inputs and supporting evidence — because they have to defend the number out loud.'],
];

/**
 * Implementation status.
 *
 * Wording is fixed by the record and must not be paraphrased. Anything the
 * record marks "verify status" is omitted rather than published at a guess.
 */
const STATUS: [string, string][] = [
    ['Dashboard UX philosophy', 'Accepted design direction'],
    ['Read → Interpret → Trust → Act', 'Accepted design direction'],
    ['Philosophy applied across dashboard work', 'Implemented design solution'],
    ['Metric, chart and summary-card explanation', 'Implemented in the recommended design'],
    ['Colour semantics', 'Implemented or incorporated'],
    ['Adoption, trust, decision quality', 'Not formally measured'],
];

function StatusTable() {
    return (
        <dl className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 divide-y cl-divide-border-color-default">
            {STATUS.map(([item, status]) => {
                const unmeasured = status === 'Not formally measured';
                return (
                    <div
                        key={item}
                        className="p-5 md:px-6 grid gap-1.5 md:grid-cols-[1fr_minmax(0,260px)] md:gap-6 md:items-baseline"
                    >
                        <dt className="text-[15px] md:text-base cl-text-neutral-text-high-contrast leading-snug">{item}</dt>
                        <dd
                            style={unmeasured ? { color: 'var(--cl-color-semantic-warning-text)' } : undefined}
                            className={
                                'text-[13px] font-bold uppercase tracking-[0.14em] leading-snug ' +
                                (unmeasured ? '' : 'cl-text-neutral-text-medium-contrast')
                            }
                        >
                            {status}
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
}

const JUMP_TARGETS = [
    { id: 'happened', label: 'What happened' },
    { id: 'observed', label: 'What I observed' },
    { id: 'understanding', label: 'The model' },
    { id: 'designed', label: 'What I designed' },
    { id: 'implemented', label: 'Status' },
];

/** Narration index → section id. Same order as NARRATION_SECTIONS; the two
 *  files must be edited together. */
const NARRATION_TO_SECTION: string[] = [
    'happened',
    'readers',
    'observed',
    'understanding',
    'designed',
    'implemented',
    'unknown',
];

const NARRATION_WORDS = NARRATION_SECTIONS.reduce(
    (total, s) => total + countWords(`${s.title} ${s.body}`),
    0
);
const LISTEN_MINUTES = minutesFor(NARRATION_WORDS, NARRATION_WPM);

const PROSE = 'text-[17px] md:text-lg leading-[1.7] cl-text-neutral-text-medium-contrast max-w-[62ch]';

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
                        The numbers were legible. The reasoning behind them was not, so a person had to
                        supply it.
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

                {/* 1 — the trigger, and the two jobs */}
                <section {...narratable('happened')}>
                    <NowReading id="happened" />
                    <Heading label="What happened" id="happened" title="Someone had to explain the screen" />
                    <p className={PROSE}>
                        Interpreting the dashboard frequently depended on somebody from the product team
                        explaining it.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        A client-facing relationship manager who used the dashboard operationally was the
                        one surfacing this. She supported clients through participation, reviewed results
                        with them, and kept bringing back the same questions and interpretation gaps from
                        those conversations.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        So the dashboard had two jobs — and the second was failing, which exposed weaknesses
                        in the first.
                    </p>

                    <div className="mt-8">
                        <Compare
                            left={{
                                label: 'Job one',
                                headline: 'Help decision-makers understand and act',
                                items: ['Leadership, managers, HR and programme owners'],
                            }}
                            right={{
                                label: 'Job two',
                                headline: 'Help client-facing teams explain it consistently',
                                items: ['Operational users, in front of a client'],
                                tone: 'problem',
                            }}
                        />
                    </div>
                </section>

                {/* 2 — readers, and the depth difference */}
                <section {...narratable('readers')}>
                    <NowReading id="readers" />
                    <Heading label="Who was reading it" id="readers" title="Not everyone needed the same depth" />
                    <p className={PROSE}>
                        Treating every reader as if they did was part of the problem.
                    </p>
                    <dl className="mt-8 rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 divide-y cl-divide-border-color-default">
                        {READERS.map(([role, depth]) => (
                            <div key={role} className="p-5 md:px-6 grid gap-1.5 md:grid-cols-[minmax(0,260px)_1fr] md:gap-6 md:items-baseline">
                                <dt className="text-base font-bold cl-text-neutral-text-high-contrast leading-snug">{role}</dt>
                                <dd className="text-[15px] md:text-base leading-snug cl-text-neutral-text-medium-contrast">{depth}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* 3 — the observation, anchored on the number */}
                <section {...narratable('observed')}>
                    <NowReading id="observed" />
                    <Heading label="What I observed" id="observed" title="A score with no reasoning attached" />
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
                            'The explanation burden had moved out of the product and into a person\'s working day.',
                            'The weakest signals were not in the layout — they were in the explanation around the metrics, colours, evidence and actions.',
                        ]}
                    />
                </section>

                {/* 4 — the model, and the insight under it */}
                <section {...narratable('understanding')}>
                    <NowReading id="understanding" />
                    <Heading label="What that changed in my understanding" id="understanding" title="Four things have to happen before someone can act" />
                    <p className={PROSE}>
                        A reader doesn't trust a score because it's displayed. Organisations often already
                        use their own models, weightings and rating scales, and a number that disagrees with
                        one has to show its working.
                    </p>
                    <div className="mt-8">
                        <Panel caption="When one stage is weak, readers lean on someone else's explanation or decide with incomplete context. This is a working model from this review, not a general law.">
                            <Stages steps={STAGES} />
                        </Panel>
                    </div>
                    <div className="mt-10">
                        <Statement>Trust is created through inspectability.</Statement>
                    </div>
                </section>

                {/* 5 — what was designed. The four rules support the model above;
                    they are not a second framework. */}
                <section {...narratable('designed')}>
                    <NowReading id="designed" />
                    <Heading label="What I designed" id="designed" title="Four rules for making a stage hold" />
                    <dl className="space-y-5 max-w-[62ch]">
                        {RULES.map(([name, body]) => (
                            <div key={name}>
                                <dt className="text-lg font-bold cl-text-neutral-text-high-contrast">{name}</dt>
                                <dd className="mt-1 text-[16px] leading-relaxed cl-text-neutral-text-medium-contrast">{body}</dd>
                            </div>
                        ))}
                    </dl>

                    <p className={`${PROSE} mt-8`}>
                        And one that cuts across all four: <strong className="cl-text-neutral-text-high-contrast">disclose detail on
                        demand.</strong> The default view stays concise; the reasoning stays available.
                    </p>

                    <div className="mt-10">
                        <Statement tone="insight">
                            Clarity does not mean showing everything. It means showing the right level at the
                            right moment.
                        </Statement>
                    </div>

                    <div className="mt-10">
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

                    <p className={`${PROSE} mt-8`}>
                        At card level the rule is one metric, one insight, one next action. The same logic
                        applies to colour: an evaluative index, a participation state and a categorical
                        distribution aren't the same kind of thing, and one universal card treatment would
                        create false meaning. Pending is a state, not a risk.
                    </p>
                </section>

                {/* 6 — status, in the exact approved language */}
                <section {...narratable('implemented')}>
                    <NowReading id="implemented" />
                    <Heading label="What was implemented" id="implemented" title="And what was not" />
                    <StatusTable />
                    <p className={`${PROSE} mt-8`}>
                        The direction received positive response in demos and client-facing reviews. No
                        formal post-implementation measurement was conducted.
                    </p>
                </section>

                {/* 7 — limitations */}
                <section {...narratable('unknown')}>
                    <NowReading id="unknown" />
                    <Heading label="What remains unknown" id="unknown" title="What this does not prove" />
                    <NotProven
                        headline="No measured business outcome is claimed. This case demonstrates explainability, information hierarchy and decision-support reasoning."
                        items={[
                            'No formally moderated client-user study was conducted.',
                            'Client evidence was mediated through the relationship manager, not gathered directly.',
                            'No post-implementation measurement exists — no claim of improved trust, adoption or decision quality.',
                            'The exact implementation scope of some elements still needs verification.',
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
