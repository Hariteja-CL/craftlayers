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
    NotProven,
    Points,
    Statement,
} from '../../components/case-study/CaseStudyBeats';
import { NARRATION_SECTIONS } from './respondentExperience.narration';
import { ArrowRight } from 'lucide-react';

/**
 * /work/respondent-experience — the public case.
 *
 * Shape: this happened → I looked into it → this is what I found → this changed
 * my understanding → this is what I recommended → this is what was tested →
 * this is what is still unknown. Deliberately not the same template as
 * /work/dashboard-explainability; the two share clarity, not structure.
 *
 * SOURCE. Every statement traces to the respondent-experience knowledge base
 * (Craftlayers V2/Hariteja Knowledge base/case-study-respondent-experience.md)
 * and to the copy approved on 2026-09-12. The author is the source of truth for
 * this story; do not reinterpret it from other material.
 *
 * NO PILOT FIGURES. Invitation count, response count and participation rate are
 * internal analytics and appear neither here nor in the narration. The public
 * statement is qualitative: the response base was too small to support
 * confident interpretation. Do not compute or publish a derived percentage.
 *
 * NO INTERNAL PROGRAMME NAME. The recurring cycle's internal label is not
 * published and is not approved for public use.
 *
 * NOTHING SHIPPED. Every recommendation is a recommendation. None shipped, none
 * has post-change measurement, none is validated — and the page says so in its
 * own section rather than burying it in a caveat.
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

/**
 * The journey, in the respondent's own words.
 *
 * Type, not diagram. These six lines are the most important evidence on the
 * page, so they are set as quotations at reading size and given the room to be
 * read — boxing them into a flow chart would shrink them to labels and lose the
 * thing that makes them land, which is that they sound like a person.
 *
 * The two breaks are marked between the quotes they fall between, because the
 * gap is the finding: it is what happens *between* these moments that failed,
 * not the moments themselves.
 */
const VOICE: { quote: string; breakAfter?: string }[] = [
    { quote: 'Another workplace email.', breakAfter: 'The welcome was often missed' },
    { quote: 'What is this about again?' },
    { quote: 'Is my answer really anonymous?' },
    { quote: 'Who will see this?', breakAfter: 'Nothing visible happened next' },
    { quote: 'Did anything happen?' },
    { quote: 'Why should I answer again?' },
];

function RespondentVoice() {
    return (
        <figure className="border-l-2 cl-border-border-color-strong pl-6 md:pl-8 space-y-6">
            {VOICE.map((v) => (
                <div key={v.quote}>
                    <p className="text-xl md:text-3xl font-medium cl-text-neutral-text-high-contrast leading-[1.4] max-w-[22ch] md:max-w-[26ch]">
                        <span aria-hidden="true" className="cl-text-neutral-text-low-contrast">“</span>
                        {v.quote}
                        <span aria-hidden="true" className="cl-text-neutral-text-low-contrast">”</span>
                    </p>
                    {v.breakAfter && (
                        <p
                            style={{ color: 'var(--cl-color-semantic-error-text)' }}
                            className="mt-5 -ml-6 md:-ml-8 pl-6 md:pl-8 border-l-2 border-transparent text-[11px] font-bold uppercase tracking-[0.18em]"
                        >
                            <span aria-hidden="true">↓ </span>
                            {v.breakAfter}
                        </p>
                    )}
                </div>
            ))}
        </figure>
    );
}

/** The five conditions, as questions rather than as a labelled framework. */
const CONDITIONS: [string, string][] = [
    ['Relevance', 'Why does this matter, and why am I being asked again?'],
    ['Effort', 'What does responding require beyond the time in the form?'],
    ['Safety', 'Can I answer honestly without being personally exposed?'],
    ['Impact', 'What happens after I submit?'],
    ['Ownership', 'Who is responsible for acting?'],
];

/** Evidence → what it meant → decision. The middle column is the work. */
const DECISIONS: [string, string, string][] = [
    [
        'The reminder had become the real entry point',
        'The experience could not depend on the welcome being remembered',
        'Make every reminder independently understandable',
    ],
    [
        '“Anonymous” was stated but not explained',
        'An abstract privacy claim does not create felt safety',
        'Explain grouped reporting, open-text handling and minimum-response protection',
    ],
    [
        'Respondents saw no impact after submitting',
        'A recurring request had not earned the next response',
        'Add a visible closure loop',
    ],
    [
        'Governance and manager ownership were blurred',
        'No role clearly owned “what happens next”',
        'Separate governance from action ownership',
    ],
];

function DecisionTable() {
    return (
        <div className="space-y-4">
            {DECISIONS.map(([evidence, meaning, decision]) => (
                <div
                    key={decision}
                    className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-5 md:p-6 grid gap-4 md:grid-cols-3 md:gap-6"
                >
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] cl-text-neutral-text-low-contrast mb-2">
                            Evidence
                        </p>
                        <p className="text-[15px] leading-snug cl-text-neutral-text-high-contrast">{evidence}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] cl-text-neutral-text-low-contrast mb-2">
                            What it meant
                        </p>
                        <p className="text-[15px] leading-snug cl-text-neutral-text-medium-contrast">{meaning}</p>
                    </div>
                    <div>
                        <p
                            style={{ color: 'var(--cl-color-brand-primary-base)' }}
                            className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                        >
                            Decision
                        </p>
                        <p className="text-[15px] font-semibold leading-snug cl-text-neutral-text-high-contrast">{decision}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

const JUMP_TARGETS = [
    { id: 'happened', label: 'What happened' },
    { id: 'found', label: 'What I found' },
    { id: 'conditions', label: 'Five conditions' },
    { id: 'recommended', label: 'Recommendations' },
    { id: 'unknown', label: 'Unknowns' },
];

/** Narration index → section id. Same order as NARRATION_SECTIONS; the two
 *  files must be edited together. */
const NARRATION_TO_SECTION: string[] = [
    'happened',
    'looked',
    'found',
    'conditions',
    'recommended',
    'tested',
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
                        A short survey people had stopped answering, and what the investigation found
                        upstream of it.
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

                {/* 1 — the trigger */}
                <section {...narratable('happened')}>
                    <NowReading id="happened" />
                    <Heading label="What happened" id="happened" title="A dashboard with limited value" />
                    <p className={PROSE}>
                        A recurring feedback cycle was feeding a dashboard, and the dashboard had limited
                        value. The response base was too small to interpret anything with confidence.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        The obvious explanation was that the survey asked too much. It didn't. Three
                        questions, about two minutes — and participation was still falling with each round.
                    </p>
                    <div className="mt-10">
                        <Statement>
                            So I stopped looking at the survey and started looking at everything around it.
                        </Statement>
                    </div>
                </section>

                {/* 2 — the investigation */}
                <section {...narratable('looked')}>
                    <NowReading id="looked" />
                    <Heading label="What I went looking for" id="looked" title="Five questions, none about the form" />
                    <Points
                        ordered
                        items={[
                            'How were people introduced to the cycle?',
                            'Did they understand why they were being asked?',
                            'Did they trust that answers were anonymous?',
                            'Did they know what would happen with what they said?',
                            'Had answering last time visibly changed anything?',
                        ]}
                    />
                </section>

                {/* 3 — findings, led by the respondent's own voice */}
                <section {...narratable('found')}>
                    <NowReading id="found" />
                    <Heading label="What I found" id="found" title="The reminder had become the entry point" />
                    <p className={PROSE}>
                        The welcome communication was often missed. The reminder was becoming the entry
                        point — people were arriving at the survey without having read the thing that
                        explained it.
                    </p>

                    <div className="mt-10">
                        <RespondentVoice />
                    </div>

                    <p className={`${PROSE} mt-10`}>
                        The experience broke in two places: between the invitation and the reminder, and
                        between submitting and seeing any consequence.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Anonymity was stated as a word rather than explained as a practice. In small teams
                        people weren't sure they couldn't be identified, and open text felt personally
                        traceable. After submitting, nothing visible happened.
                    </p>
                </section>

                {/* 4 — the reframe */}
                <section {...narratable('conditions')}>
                    <NowReading id="conditions" />
                    <Heading label="What that changed in my understanding" id="conditions" title="Five conditions, not one problem" />
                    <p className={PROSE}>
                        Participation wasn't one problem. It was five conditions the experience had to
                        answer for the person being asked, and the cycle was weak on most of them.
                    </p>

                    <dl className="mt-8 rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 divide-y cl-divide-border-color-default">
                        {CONDITIONS.map(([name, question]) => (
                            <div key={name} className="p-5 md:px-6 grid gap-1.5 md:grid-cols-[minmax(0,150px)_1fr] md:gap-6 md:items-baseline">
                                <dt className="text-base font-bold cl-text-neutral-text-high-contrast">{name}</dt>
                                <dd className="text-[15px] md:text-base leading-snug cl-text-neutral-text-medium-contrast">
                                    {question}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <p className={`${PROSE} mt-8`}>
                        I didn't bring these with me. They are the questions the experience kept failing to
                        answer, written down.
                    </p>

                    <div className="mt-10">
                        <Statement tone="insight">
                            A recurring survey has to earn the next response.
                        </Statement>
                    </div>
                </section>

                {/* 5 — recommendations, traced */}
                <section {...narratable('recommended')}>
                    <NowReading id="recommended" />
                    <Heading label="What I recommended, and why" id="recommended" title="Four decisions, each with its evidence" />
                    <DecisionTable />
                    <p className={`${PROSE} mt-8`}>
                        Alongside these: a clearer explanation of cadence, a neutral “no blocker this week”
                        path, and a review of repeatedly negative question framing.
                    </p>
                </section>

                {/* 6 — status, stated plainly rather than buried */}
                <section {...narratable('tested')}>
                    <NowReading id="tested" />
                    <Heading label="What was tested" id="tested" title="Nothing" />
                    <p className={PROSE}>
                        Every item above is a recommendation. None shipped, none has post-change
                        measurement, none is validated.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        What they rest on: a respondent interview, an HR/governance interview, management
                        feedback, reviews of the welcome and reminder communications, a walk-through of the
                        respondent journey, and a review of how roles moved through the dashboards.
                    </p>
                </section>

                {/* 7 — limitations */}
                <section {...narratable('unknown')}>
                    <NowReading id="unknown" />
                    <Heading label="What remains unknown" id="unknown" title="What this does not prove" />
                    <NotProven
                        headline="This case does not claim that communication changes alone increased participation. It shows how the investigation reframed the problem from questionnaire length to respondent context and trust."
                        items={[
                            'Early and directional — one respondent interview, no quantitative validation.',
                            'Conducted in one organisation.',
                            'Management input was stakeholder feedback, not a formal interview.',
                            'It does not explain all survey non-response, and is not presented as if it does.',
                            'Whether any recommendation would have worked.',
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
