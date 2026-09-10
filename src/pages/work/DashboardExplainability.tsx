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
import { NARRATION_SECTIONS } from './dashboardExplainability.narration';
import { ArrowRight } from 'lucide-react';

/**
 * /work/dashboard-explainability — the public case.
 *
 * Compressed to the pattern set by /work/design: context, problem, role,
 * decision, what changed, response, limitations, deeper detail.
 *
 * WHAT LEFT, AND WHY.
 *
 * The page ran to roughly 3,000 words across seven figures, and most of that
 * was the operating detail rather than the judgement: five colour roles, a
 * five-part card hierarchy, an eleven-row implementation status table, a
 * five-row evidence-to-decision table and a six-step recommendation trace.
 * Read end to end it taught a reader how to build the thing. A public case has
 * to prove the decision was sound, which takes one worked example, not the
 * manual.
 *
 * WHAT IS MARKED TO MOVE, NOT DELETED.
 *
 * Named in the closing section and present nowhere in this file: the card
 * hierarchy rules, the colour-role model, the evidence-to-decision trace, the
 * recommendation traceability chain, and the implementation and validation
 * status list. When the protected layer is built, that is its content.
 *
 * TWO VISUALS, both synthetic. The live summary card is the concrete proof of
 * inspectability, and the overloaded-versus-layered pair is the proof of
 * disclosure. Everything shown is fictional data on a reconstruction — no real
 * value, formula or threshold appears here.
 */

/** Numbered callouts on the live card. Four, not seven: the three explanation
 *  layers plus the colour rule. The rest were styling notes. */
const CALLOUTS: { title: string; body: string }[] = [
    { title: 'Metric definition on demand', body: 'The info affordance carries stable metric-level context. It opens on click or tap, never on hover, so it cannot fire by accident while someone scans the screen.' },
    { title: 'Calculation context on the score', body: 'The number itself answers “how was this produced?” — contributing dimensions, weighting and the previous period, kept apart from the metric definition.' },
    { title: 'Category context on the bar', body: 'Each segment explains its own band: share, meaning and the action it implies. Three narrow layers instead of one overloaded tooltip.' },
    { title: 'Semantic data colour, always labelled', body: 'Band colour comes from a semantic scale rather than the brand accent, and the name and percentage are repeated in the bar, the legend and the detail panel — so nothing depends on colour perception.' },
];

const FRAMEWORK = [
    { stage: 'Read', question: 'What am I seeing?', risk: 'Unclear metric' },
    { stage: 'Interpret', question: 'What does it mean?', risk: 'Ambiguous meaning' },
    { stage: 'Trust', question: 'Can I inspect how this was produced?', risk: 'Low confidence' },
    { stage: 'Act', question: 'What should happen next?', risk: 'Insight without action' },
];

/** Names and one line each. The full rules are protected-layer content. */
const PRINCIPLES = [
    { name: 'Explain the number', body: 'What the metric is, which inputs produced it, and what the result means.' },
    { name: 'Explain the colour', body: 'Brand colour identifies the product; data colour must carry one fixed analytical meaning.' },
    { name: 'Show the evidence', body: 'Scores, summaries and recommendations connect back to what supports them.' },
    { name: 'Support the decision', body: 'What the information implies, what happens next, and who owns it.' },
];

const OWNED = [
    ['Analytics UX', 'The reporting experience across roles — what each reader sees first and what they can open.'],
    ['Explainability', 'The model for how a metric, a colour and a recommendation account for themselves.'],
    ['Information architecture', 'What belongs on the summary, what belongs one layer down, and what belongs elsewhere.'],
    ['Product reasoning', 'Connecting a number to the decision it is supposed to support.'],
];

const JUMP_TARGETS = [
    { id: 'problem', label: 'Problem' },
    { id: 'decision', label: 'Decision' },
    { id: 'changed', label: 'What changed' },
    { id: 'response', label: 'Response' },
    { id: 'limitations', label: 'Limitations' },
];

/** Narration index → visible section id. Same order as NARRATION_SECTIONS;
 *  the two files must be edited together. */
const NARRATION_TO_SECTION: string[] = [
    'overview',
    'context',
    'problem',
    'role',
    'decision',
    'changed',
    'response',
    'limitations',
];

const NARRATION_WORDS = NARRATION_SECTIONS.reduce(
    (total, s) => total + countWords(`${s.title} ${s.body}`),
    0
);
const LISTEN_MINUTES = minutesFor(NARRATION_WORDS, NARRATION_WPM);

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
                        <Badge variant="secondary">Information architecture</Badge>
                        <Badge variant="outline">Sanitised enterprise case study</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight mb-6">
                        Designing Dashboards People Can Read, Trust and Act On
                    </h1>

                    <p className="text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        How do you help people interpret complex culture data without making the dashboard look
                        more certain than the evidence actually is?
                    </p>

                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-5 text-base cl-text-neutral-text-medium-contrast"
                    >
                        Public summary · EnCulture at NHR Technologies. Every example below is a reconstruction
                        using synthetic data — no real value, formula or threshold appears.
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

                {/* 1 · Context, and the constraint that follows from it */}
                <section {...narratable('context')}>
                    <NowReading id="context" />
                    <SectionHeading eyebrow="01 · Context" id="context" title="Two readers, one screen" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            EnCulture at NHR Technologies is a B2B culture analytics platform, and its dashboards
                            are multi-role by design. The same reporting has to serve a senior decision-maker who
                            needs a conclusion, and a client-facing operational user who has to explain that
                            conclusion to somebody else.
                        </p>
                        <p>
                            That is the constraint the work turns on. Two readers want different depths of the
                            same screen, and the answer could not be two products.
                        </p>
                    </div>
                </section>

                {/* 2 · The problem */}
                <section {...narratable('problem')}>
                    <NowReading id="problem" />
                    <SectionHeading eyebrow="02 · The problem" id="problem" title="The explanation burden" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            In practice, interpretation frequently depended on explanation from the product team.
                            The explanation burden had moved out of the product and into a person's workflow —
                            usually whoever was standing closest to the client.
                        </p>
                        <p>
                            The strongest issues were not primarily visual. That is not a claim that the layout
                            was faultless; it is where the clearest signals sat — in the{' '}
                            <strong>explanation layer</strong> around metrics, colours, evidence and action. A
                            number can be perfectly legible and still not tell you whether to believe it.
                        </p>
                    </div>
                </section>

                {/* 3 · Role */}
                <section {...narratable('role')}>
                    <NowReading id="role" />
                    <SectionHeading eyebrow="03 · My role" id="role" title="What I owned" />
                    <dl className="space-y-6">
                        {OWNED.map(([t, d]) => (
                            <div key={t}>
                                <dt className="text-lg font-bold cl-text-neutral-text-high-contrast">{t}</dt>
                                <dd className="text-base cl-text-neutral-text-medium-contrast mt-1.5 leading-relaxed">{d}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-8 text-base leading-relaxed cl-text-neutral-text-low-contrast">
                        Evidence came from dashboard and artifact review together with feedback from a
                        client-facing relationship manager who used the product daily — direct evidence from her
                        own use, indirect evidence from her client conversations. It was not a formally moderated
                        client-user study, and it is not described as one.
                    </p>
                </section>

                {/* 4 · The decision */}
                <section {...narratable('decision')}>
                    <NowReading id="decision" />
                    <SectionHeading eyebrow="04 · The decision" id="decision" title="Trust is created through inspectability" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            A reader does not trust a score because it is displayed. Trust develops when they can
                            inspect how it was calculated, see which inputs contributed, and compare it against
                            their own understanding. Organisations often already use their own models and rating
                            scales, so a number that disagrees with an existing method has to show its working.
                        </p>
                    </div>

                    <ol className="mt-8 border-l cl-border-border-color-default pl-6 space-y-5">
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
                                    <p className="text-sm cl-text-neutral-text-low-contrast mt-0.5">
                                        Risk when missing: {s.risk}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>

                    <p className="mt-8 text-base leading-relaxed cl-text-neutral-text-medium-contrast">
                        Trust sits in the middle because it is what carries someone from understanding a number
                        to being willing to act on it. A working model from this review — not a universal law.
                    </p>
                </section>

                {/* 5 · What changed — the two public visuals */}
                <section {...narratable('changed')}>
                    <NowReading id="changed" />
                    <SectionHeading eyebrow="05 · What changed" id="changed" title="The explanation moved into the component" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        A summary card carries three separate layers of context: what the metric is, how the
                        score was produced, and what a category band means. Keeping them apart is deliberate —
                        one combined tooltip would have to answer three different questions at once.
                    </p>

                    {/* Visual 1 — the live card, with what each layer is for */}
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

                    <div className="mt-12">
                        <h3 className="text-xl font-bold cl-text-neutral-text-high-contrast mb-4">
                            Four principles, and the one that governs them
                        </h3>
                        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                            {PRINCIPLES.map((p) => (
                                <div key={p.name}>
                                    <dt className="text-base font-bold cl-text-neutral-text-high-contrast">{p.name}</dt>
                                    <dd className="text-sm cl-text-neutral-text-medium-contrast mt-1 leading-relaxed">{p.body}</dd>
                                </div>
                            ))}
                        </dl>
                        <p
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="mt-7 border-l-2 pl-5 text-base font-medium cl-text-neutral-text-high-contrast leading-relaxed"
                        >
                            Disclose detail on demand. Clarity is not showing everything — it is showing the
                            right level at the right moment. The summary stays simple; the reasoning stays
                            available.
                        </p>
                    </div>

                    {/* Visual 2 — the disclosure decision, shown rather than asserted */}
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
                                <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                                    Essential meaning first; the metric definition, calculation, segment
                                    explanation and supporting evidence all still reachable.
                                </p>
                            </div>
                        </div>
                        <figcaption className="mt-6 text-sm cl-text-neutral-text-medium-contrast">
                            Nothing was removed between the two. The same detail is present on the right — it
                            simply waits until someone asks for it.
                        </figcaption>
                        <PrototypeLabel />
                    </figure>
                </section>

                {/* 6 · Response */}
                <section {...narratable('response')}>
                    <NowReading id="response" />
                    <SectionHeading eyebrow="06 · Response" id="response" title="What was accepted" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The dashboard philosophy was accepted as a design direction and informed subsequent
                            dashboard work. The recommended direction received positive feedback during demos and
                            client-facing reviews.
                        </p>
                        <p>
                            A high-fidelity concept demonstrated the interaction model using illustrative
                            content. The production implementation used different data and product-specific
                            logic. <strong>No formal post-implementation measurement was conducted.</strong>
                        </p>
                    </div>
                </section>

                {/* 7 · Limitations */}
                <section {...narratable('limitations')}>
                    <NowReading id="limitations" />
                    <SectionHeading eyebrow="07 · Limitations" id="limitations" title="What this does not prove" />
                    <ul className="space-y-2.5 text-base cl-text-neutral-text-medium-contrast">
                        {[
                            'No formally moderated client-user study was conducted.',
                            'Client evidence was mediated through the relationship manager rather than gathered directly.',
                            'No formal post-implementation measurement exists, so no claim is made of increased trust, increased adoption, reduced support requests or improved decision quality.',
                            'The exact implementation scope of some elements still requires verification.',
                            'Every public example uses synthetic data; no real values, formulas or thresholds appear.',
                        ].map((l) => (
                            <li key={l} className="flex gap-3">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{l}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        The strongest contribution was not a new layout. It was moving the explanation from a
                        person's workflow back into the product, where both the decision-maker and the person
                        explaining the data can reach it.
                    </p>
                </section>

                {/* 8 · Deeper detail. The list is also the manifest for the
                    protected layer when it is built; none of it lives in this
                    file. The CTA points at /contact, a route that exists — there
                    is no access flow and this page does not pretend otherwise. */}
                <section className="pt-20">
                    <SectionHeading eyebrow="08 · Going deeper" id="deeper" title="The detailed case study" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        The rest of this work — the card hierarchy rules, the colour-role model, the
                        evidence-to-decision trace, the recommendation traceability chain and the implementation
                        status of each element — includes internal product material. Detailed project evidence is
                        available for hiring and review conversations.
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
