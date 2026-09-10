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
    CaseMeta,
    Compare,
    EvidenceBlock,
    Flow,
    NotProven,
    Panel,
    Points,
    Statement,
} from '../../components/case-study/CaseStudyBeats';
import { NARRATION_SECTIONS } from './respondentExperience.narration';
import { ArrowRight } from 'lucide-react';

/**
 * /work/respondent-experience — the public case.
 *
 * Built as visual beats rather than as a document, using the same vocabulary
 * as the dashboard case so the two read as one portfolio.
 *
 * The test this is written against: hide every paragraph, and the headings,
 * diagrams and callouts alone should still say what the product is, what was
 * wrong, what was decided, what changed and what is not proven.
 *
 * NO PILOT FIGURES. Invitation count, participation rate and per-cycle
 * response count are internal analytics from one organisation and appear
 * neither here nor in the narration. The argument does not need them: it turns
 * on why a two-minute survey goes unanswered, which holds at any sample size.
 *
 * The detailed journey, the welcome and reminder communications, the
 * evidence-to-decision trace, the feedback-loop model and the ownership model
 * are named in the closing section and live nowhere in this file.
 */

/** Hero — the shape of the respondent's experience, not a product screenshot.
 *  The form is small on purpose; the accent is on what surrounds it. */
function SurveyHeroVisual() {
    const around = ['Why me?', 'Is it safe?', 'What happens after?'];
    return (
        <div aria-hidden="true" className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-10">
            <div className="flex flex-col items-center gap-6">
                <div
                    style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                    className="rounded-xl border-2 cl-bg-neutral-surface-level-0 px-8 py-5 text-center"
                >
                    <span className="block h-1.5 w-24 rounded-full cl-bg-neutral-surface-300 mx-auto" />
                    <span className="block mt-3 h-1.5 w-32 rounded-full cl-bg-neutral-surface-300 mx-auto" />
                    <span className="block mt-3 h-1.5 w-20 rounded-full cl-bg-neutral-surface-300 mx-auto" />
                </div>
                <ul className="flex flex-wrap justify-center gap-3">
                    {around.map((q) => (
                        <li
                            key={q}
                            style={{ borderColor: 'var(--cl-color-semantic-error-border)' }}
                            className="rounded-full border-2 cl-bg-neutral-surface-level-0 px-4 py-2 text-sm font-semibold cl-text-neutral-text-high-contrast"
                        >
                            {q}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const JOURNEY = [
    { name: 'Invitation' },
    { name: 'Understanding', weak: true },
    { name: 'Trust', weak: true },
    { name: 'Questions' },
    { name: 'Response' },
    { name: 'Feedback', weak: true },
];

const JUMP_TARGETS = [
    { id: 'problem', label: 'Problem' },
    { id: 'journey', label: 'Journey' },
    { id: 'decision', label: 'Decision' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'limitations', label: 'Limitations' },
];

/** Narration index → section id. Same order as NARRATION_SECTIONS; the two
 *  files must be edited together. */
const NARRATION_TO_SECTION: string[] = [
    'overview',
    'problem',
    'journey',
    'decision',
    'scope',
    'evidence',
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

export function RespondentExperience() {
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
                            { label: 'Three Questions Were Not the Problem' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">Respondent Experience</Badge>
                        <Badge variant="secondary">UX Research</Badge>
                        <Badge variant="outline">Public · Anonymised</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight mb-6">
                        Three Questions Were Not the Problem
                    </h1>

                    <p className="text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        The survey was short, but respondents still lacked context, trust and a clear reason to
                        participate.
                    </p>

                    <div className="mt-9">
                        <CaseMeta
                            items={[
                                ['Product', 'EnCulture · NHR Technologies'],
                                ['Environment', 'Assessment · respondent experience'],
                                ['Role', 'Research · Problem diagnosis · Behavioural analytics · Interaction design'],
                            ]}
                        />
                    </div>

                    <div className="mt-8">
                        <SurveyHeroVisual />
                    </div>

                    <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Method </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">Early qualitative study</span>
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
                    <Statement>Three questions were not the problem. Trust and communication were.</Statement>
                </section>

                {/* Beat 1 — short does not mean clear */}
                <section {...narratable('problem')}>
                    <NowReading id="problem" />
                    <Heading label="The problem" id="problem" title="Short does not mean clear" />
                    <Panel caption="The interaction was simple. The surrounding experience was not.">
                        <Compare
                            left={{
                                label: 'What the product saw',
                                headline: '3 questions, under 2 minutes',
                                items: ['Low interaction effort', 'Nothing obvious to fix'],
                            }}
                            right={{
                                label: 'What the respondent may ask',
                                headline: 'Three questions of their own',
                                items: [
                                    'Why am I receiving this?',
                                    'Is it anonymous?',
                                    'What happens after I answer?',
                                ],
                                tone: 'problem',
                            }}
                        />
                    </Panel>
                    <Points
                        items={[
                            'Friction was the assumed cause, and the survey had almost none.',
                            'A one-time form can succeed on novelty; a recurring one has to earn each response.',
                            'It competes with the respondent\'s memory of what happened — or didn\'t — last time.',
                        ]}
                    />
                </section>

                {/* Beat 2 — the journey, with the weak points named */}
                <section {...narratable('journey')}>
                    <NowReading id="journey" />
                    <Heading label="The journey" id="journey" title="Where the experience thinned" />
                    <Panel caption="Three of the six stages were carrying no weight — and none of them was the form.">
                        <Flow steps={JOURNEY} weakLabel="weak" />
                    </Panel>
                    <Points
                        items={[
                            <><strong className="cl-text-neutral-text-high-contrast">Understanding</strong> — the reminder had become the real entry point, not the welcome message.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Trust</strong> — anonymity was asserted as a word rather than explained in practice.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Feedback</strong> — nothing visible happened after submitting.</>,
                        ]}
                    />
                </section>

                {/* Beat 3 — the decision, as a reframe */}
                <section {...narratable('decision')}>
                    <NowReading id="decision" />
                    <Heading label="The decision" id="decision" title="A different problem to solve" />
                    <Panel caption="It arrived as a dashboard-value question — the data is thin, so fix the reporting. It left as an upstream respondent-experience problem.">
                        <Compare
                            left={{ label: 'Before', headline: '“Make the survey shorter.”' }}
                            right={{
                                label: 'After',
                                headline: '“Make the purpose, safety and follow-through clearer.”',
                                tone: 'suggestion',
                            }}
                        />
                    </Panel>
                    <Points
                        items={[
                            <><strong className="cl-text-neutral-text-high-contrast">Explain why</strong> — every reminder has to stand on its own.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Establish safety</strong> — show how grouping and thresholds protect an answer.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Close the loop</strong> — a request that shows no consequence has not earned the next one.</>,
                        ]}
                    />
                    <div className="mt-10">
                        <Statement tone="insight">Completion does not automatically equal candour.</Statement>
                    </div>
                </section>

                {/* Scope */}
                <section {...narratable('scope')}>
                    <NowReading id="scope" />
                    <Heading label="Scope" id="scope" title="What I owned" />
                    <Points
                        columns={2}
                        items={[
                            <><strong className="cl-text-neutral-text-high-contrast">Research</strong> — interviews, communication review, journey walk-through.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Problem diagnosis</strong> — establishing the reported problem was downstream of the real one.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Behavioural analytics</strong> — where people dropped away, read alongside the qualitative evidence.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Interaction design</strong> — the experience around the form.</>,
                        ]}
                    />
                </section>

                {/* Evidence */}
                <section {...narratable('evidence')}>
                    <NowReading id="evidence" />
                    <Heading label="Evidence" id="evidence" title="What informed the decision" />
                    <EvidenceBlock
                        label="What informed the decision"
                        items={[
                            'Communication review',
                            'Respondent journey review',
                            'Interviews and stakeholder evidence',
                            'Behavioural analytics',
                        ]}
                        note="Early qualitative research intended to surface hypotheses — not a statistically representative study, and conducted inside one organisation. It does not explain all survey non-response, and it is not presented as if it does."
                    />
                </section>

                {/* Limitations */}
                <section {...narratable('limitations')}>
                    <NowReading id="limitations" />
                    <Heading label="Limitations" id="limitations" title="What this does not prove" />
                    <NotProven
                        headline="This case does not claim that communication changes alone increased participation. It shows how the investigation reframed the problem from questionnaire length to respondent context and trust."
                        items={[
                            'Early and directional, with a small interview sample and no quantitative validation.',
                            'Conducted in one organisation.',
                            'Management input was stakeholder feedback, not a formal interview.',
                            'Everything proposed is a recommendation: none has shipped, none has post-change measurement.',
                        ]}
                    />
                </section>

                {/* Deeper detail — also the manifest for the protected layer */}
                <section className="pt-20">
                    <Heading label="Going deeper" id="deeper" title="The detailed case study" />
                    <Points
                        columns={2}
                        items={[
                            'The detailed respondent journey',
                            'Welcome and reminder communications',
                            'Evidence-to-decision trace',
                            'The feedback-loop model',
                            'The ownership model',
                            'The pilot’s own participation data',
                        ]}
                    />
                    <p className="mt-7 text-[16px] leading-relaxed cl-text-neutral-text-medium-contrast max-w-[60ch]">
                        That material is internal to one organisation. Detailed project evidence is available for
                        hiring and review conversations.
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
