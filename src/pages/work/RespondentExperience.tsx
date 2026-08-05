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
import { NARRATION_SECTIONS } from './respondentExperience.narration';
import { ArrowRight, ArrowDown } from 'lucide-react';

/* ------------------------------------------------------------------ *
 * Local, page-specific building blocks.
 * Kept inside this file on purpose — they are signature to this one
 * case study and should not be generalised prematurely.
 * ------------------------------------------------------------------ */

/** Compact evidence-classification label. Meaning is carried by text,
 *  never by colour alone (a11y). */
function EvidenceTag({ kind }: { kind: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider cl-text-neutral-text-medium-contrast">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base" />
            {kind}
        </span>
    );
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
    return (
        <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </div>
            {/* scroll-mt clears the fixed site header when jumped to via anchor */}
            <h2
                id={id}
                className="text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-tight scroll-mt-28"
            >
                {title}
            </h2>
        </div>
    );
}

const FIVE_CONDITIONS = [
    { name: 'Relevance', q: 'Why does this matter, and why am I being asked again?' },
    { name: 'Effort', q: 'What does responding require beyond the time spent filling the form?' },
    { name: 'Safety', q: 'Can I answer honestly without being personally exposed?' },
    { name: 'Impact', q: 'What happens after I submit?' },
    { name: 'Ownership', q: 'Who is responsible for acting?' },
];

const JOURNEY = [
    { label: 'Invitation', thought: 'Another workplace email.' },
    { label: 'Reminder', thought: 'What is this about again?' },
    { label: 'Survey', thought: 'Is my answer really anonymous?' },
    { label: 'Submit', thought: 'Who will see this?' },
    { label: 'Silence', thought: 'Did anything happen?' },
    { label: 'Next cycle', thought: 'Why should I answer again?' },
];

const EVIDENCE_CARDS = [
    {
        evidence: 'The reminder became the actual entry point.',
        insight: 'The experience could not depend on the welcome communication being remembered.',
        decision: 'Make every reminder independently understandable.',
    },
    {
        evidence: '“Anonymous” was stated but not explained in practice.',
        insight: 'An abstract privacy claim did not create felt safety.',
        decision: 'Explain grouped reporting, open-text handling and minimum-response protection.',
    },
    {
        evidence: 'Respondents saw no visible impact after submitting.',
        insight: 'A recurring request had not earned the next response.',
        decision: 'Add a visible closure loop.',
    },
    {
        evidence: 'Governance and manager action ownership were blurred.',
        insight: 'No role clearly owned the “what happens next?”',
        decision: 'Separate governance from action ownership.',
    },
];

const OWNERSHIP = [
    { role: 'Respondent', owns: 'Provides honest feedback.' },
    { role: 'Manager / Action Owner', owns: 'Interprets team-level insight, discusses themes, takes action and communicates closure.' },
    { role: 'HR / Governance', owns: 'Governs the program, protects anonymity, monitors organisation-level patterns and enables managers.' },
    { role: 'Leadership', owns: 'Reviews systemic patterns and supports organisation-level action.' },
    { role: 'System', owns: 'Aggregates responses, protects thresholds and supports communication.' },
];

const FUTURE_STATE = [
    'Explain purpose',
    'Invite safely',
    'Make completion easy',
    'Protect and aggregate',
    'Interpret at the right level',
    'Act',
    'Communicate what changed',
    'Earn the next response',
];

const RECOMMENDATIONS = [
    'Self-contained reminder communication',
    'Clearer cadence explanation',
    'Practical anonymity explanation',
    'Visible impact communication',
    'Neutral or “No blocker this week” path',
    'Question-framing review',
    'Grouped reporting explanation',
    'Manager / HR ownership separation',
];

const JUMP_TARGETS = [
    { id: 'overview', label: 'Overview' },
    { id: 'journey', label: 'Respondent journey' },
    { id: 'five-conditions', label: 'Five conditions' },
    { id: 'evidence-insight-decision', label: 'Key decisions' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'limitations', label: 'Limitations' },
];

/**
 * Maps each curated narration section (by index) to the id of the visible page
 * section it corresponds to, so the page can show which part is being read.
 *
 * The narration is a condensed summary, so this is a best-fit mapping to the
 * section whose content dominates that passage — not a literal 1:1 transcript
 * of the page.
 */
const NARRATION_TO_SECTION: string[] = [
    'overview',                    // 0  Overview
    'evidence-environment',        // 1  The problem
    'journey',                     // 2  Respondent journey
    'five-conditions',             // 3  Five conditions
    'evidence-insight-decision',   // 4  Key decisions
    'feedback-loop',               // 5  Feedback loop
    'ownership',                   // 6  Ownership
    'future-state',                // 7  Future direction
    'limitations',                 // 8  Limitations
    'reflection',                  // 9  Reflection
];

/**
 * Listen time is derived from the curated narration transcript only — a
 * different, shorter source than the visible page. Computed once at module
 * load rather than hardcoded.
 */
const NARRATION_WORDS = NARRATION_SECTIONS.reduce(
    (total, s) => total + countWords(`${s.title} ${s.body}`),
    0
);
const LISTEN_MINUTES = minutesFor(NARRATION_WORDS, NARRATION_WPM);

export function RespondentExperience() {
    /** Measured from the rendered article prose so the read estimate reflects
     *  what is actually visible (collapsed <details> content is excluded by
     *  innerText, which is exactly the reading burden we want to report). */
    const proseRef = useRef<HTMLDivElement>(null);
    const [readMinutes, setReadMinutes] = useState<number | null>(null);

    useEffect(() => {
        if (!proseRef.current) return;
        const words = countWords(proseRef.current.innerText || '');
        setReadMinutes(minutesFor(words, READING_WPM));
    }, []);

    const timingLine = useMemo(() => {
        const listen = `${formatMinutes(LISTEN_MINUTES)} listen`;
        return readMinutes ? `${formatMinutes(readMinutes)} read · ${listen}` : listen;
    }, [readMinutes]);

    /** Id of the section currently being narrated, or null when idle. */
    const [narratedSectionId, setNarratedSectionId] = useState<string | null>(null);

    const handleSectionChange = useCallback(
        (index: number | null, reason: SectionChangeReason) => {
            if (index === null) {
                setNarratedSectionId(null);
                return;
            }
            const id = NARRATION_TO_SECTION[index] ?? null;
            setNarratedSectionId(id);

            // Scroll only when the listener deliberately started or repeated —
            // never on automatic section advance, which would yank the page
            // away from someone reading ahead.
            if (reason !== 'start' || !id) return;
            const el = document.getElementById(id);
            if (!el) return;
            const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        },
        []
    );

    /**
     * Props applied to a narratable <section>. The highlight is a soft
     * brand-tinted wash plus a thin accent bar, and is always accompanied by
     * the visible "Now reading" label — never colour alone.
     *
     * The bar is always rendered (transparent when inactive) so activating a
     * section never shifts the layout. A surface token is deliberately not
     * used for the tint: surface-level-1 (#ffffff) is only two points from the
     * page background (#f8f9fa) and reads as no highlight at all.
     */
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

    /**
     * "Now reading" marker for the active section.
     *
     * Absolutely positioned inside the section's existing top padding, so
     * activating a section adds no height and never reflows the content below
     * it — important on mobile, where a 35px insert is a visible jump.
     */
    const NowReading = ({ id }: { id: string }) =>
        narratedSectionId === id ? (
            <p className="absolute top-10 left-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base" />
                Now reading
            </p>
        ) : null;

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen font-sans pb-28">

            {/* ── Header ─────────────────────────────────────────── */}
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
                        <Badge variant="secondary">Enterprise SaaS</Badge>
                        <Badge variant="outline">Public · Anonymised</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight mb-6">
                        Three Questions Were Not the Problem
                    </h1>

                    <p className="text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        An internal low-participation workplace-survey pilot revealed that respondent experience
                        depends on more than survey length. People also need relevance, manageable effort,
                        practical safety, visible impact and confidence that someone will act.
                    </p>

                    {/* Meta strip — role / method / confidentiality / timing */}
                    <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Focus </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">UX Research &amp; Product Design</span>
                        </span>
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Method </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">Early qualitative study</span>
                        </span>
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Confidentiality </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">Public · Anonymised</span>
                        </span>
                        <span className="font-semibold cl-text-neutral-text-high-contrast">{timingLine}</span>
                    </div>

                    <div className="mt-6">
                        <CaseStudyJumpNav items={JUMP_TARGETS} />
                    </div>
                </div>
            </header>

            {/* Compact floating narration chip, docked beside the chat launcher */}
            <CaseStudyListenPlayer
                sections={NARRATION_SECTIONS}
                estimatedDuration={formatMinutes(LISTEN_MINUTES)}
                onSectionChange={handleSectionChange}
            />

            <div ref={proseRef} className="max-w-4xl mx-auto px-6">

                {/* ── Central question + hero visual ─────────────── */}
                <section aria-labelledby="overview" {...narratable('overview')}>
                    <h2 id="overview" className="sr-only scroll-mt-28">Overview</h2>
                    <NowReading id="overview" />
                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="text-xl md:text-2xl font-medium cl-text-neutral-text-high-contrast leading-relaxed border-l-2 pl-6"
                    >
                        What prevents people from repeatedly providing honest feedback, even when a survey is
                        short and easy to complete?
                    </p>

                    {/* Hero visual: a tiny form outweighed by the surrounding experience.
                        Built from real text nodes so it reads in order for screen readers. */}
                    <figure className="mt-12 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8 md:p-12">
                        <div className="flex flex-col items-center gap-8">
                            <div className="rounded-xl border cl-border-border-color-strong cl-bg-neutral-surface-level-0 px-5 py-3 text-center">
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast">3 questions</div>
                                <div className="text-xs cl-text-neutral-text-medium-contrast">under ~2 minutes</div>
                            </div>
                            <div aria-hidden="true" className="text-xs uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast">
                                surrounded by
                            </div>
                            <ul className="flex flex-wrap justify-center gap-3">
                                {['Purpose', 'Anonymity', 'Visibility', 'Impact', 'Action ownership'].map((c) => (
                                    <li
                                        key={c}
                                        className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-4 py-2 text-sm font-semibold cl-text-neutral-text-high-contrast"
                                    >
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <figcaption className="mt-8 text-center text-sm cl-text-neutral-text-medium-contrast italic">
                            The interaction was simple. The surrounding experience was not.
                        </figcaption>
                    </figure>
                </section>

                {/* ── 1. Universal respondent problem ────────────── */}
                <section className="pt-20">
                    <SectionHeading eyebrow="01 · The problem" id="universal" title="The universal respondent problem" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            Recurring feedback surveys are everywhere. The common design belief is that friction
                            is the enemy, so shorter is better. Yet plenty of short surveys still go unanswered —
                            and, more quietly, some that <em>are</em> answered aren't answered honestly.
                        </p>
                        <p>
                            “Repeatedly” and “honest” are the demanding words. A one-time form can succeed on
                            novelty. A recurring one has to earn each response, and it competes with the
                            respondent's memory of what happened — or didn't — last time.
                        </p>
                    </div>
                </section>

                {/* ── 2. Internal evidence environment ───────────── */}
                <section {...narratable('evidence-environment')}>
                    <NowReading id="evidence-environment" />
                    <SectionHeading eyebrow="02 · Evidence environment" id="evidence-environment" title="The internal evidence environment" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            To investigate this respondent problem, I studied an internal recurring
                            workplace-survey pilot. Approximately 98 employees were invited, the survey
                            contained three short questions, and participation remained around 11% during the
                            research period. In one observed cycle roughly 8 people responded, and participation
                            declined across repeated iterations. These figures are approximate and kept separate.
                        </p>
                    </div>

                    <div className="mt-8">
                        <CaseStudyDisclosure summary="Research methods and evidence boundaries">
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-3">Evidence base</h3>
                                    <ul className="space-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· One employee / respondent interview</li>
                                        <li>· One HR / governance stakeholder interview</li>
                                        <li>· Management / lead feedback</li>
                                        <li>· Welcome &amp; reminder communication review</li>
                                        <li>· Respondent journey &amp; role-flow review</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-high-contrast mb-3">Methods</h3>
                                    <ul className="space-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· Qualitative interviews</li>
                                        <li>· Stakeholder feedback synthesis</li>
                                        <li>· Communication / artifact review</li>
                                        <li>· Respondent journey mapping</li>
                                        <li>· Evidence → insight → decision mapping</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-6 text-sm cl-text-neutral-text-low-contrast">
                                This was early qualitative research to surface hypotheses — not a statistically
                                representative study, and it does not explain all survey non-response.
                            </p>
                        </CaseStudyDisclosure>
                    </div>
                </section>

                {/* ── 3. Symptom → source ────────────────────────── */}
                <section className="pt-20">
                    <SectionHeading eyebrow="03 · Diagnosis" id="symptom-source" title="Three questions were not the problem" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        The instinct was to treat low participation as survey friction. The evidence pointed
                        elsewhere — from a surface symptom to an underlying respondent contract.
                    </p>

                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <ol className="space-y-4">
                            {[
                                { k: 'Symptom', v: 'Low, declining participation' },
                                { k: 'Initial assumption', v: 'Survey friction — too long or too complex' },
                                { k: 'Evidence', v: 'Three questions, under ~2 minutes' },
                                { k: 'Underlying issue', v: 'The respondent contract' },
                            ].map((step, i, arr) => (
                                <li key={step.k}>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                        <span className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast sm:w-40 shrink-0">{step.k}</span>
                                        <span className="text-base font-semibold cl-text-neutral-text-high-contrast">{step.v}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <ArrowDown aria-hidden="true" className="w-4 h-4 my-2 cl-text-brand-primary-base sm:ml-44" />
                                    )}
                                </li>
                            ))}
                        </ol>
                        <figcaption className="sr-only">
                            Diagnostic chain: low participation led to an initial assumption of survey friction;
                            evidence of a three-question, two-minute survey ruled that out; the underlying issue
                            was the respondent contract.
                        </figcaption>
                    </figure>
                </section>

                {/* ── 4. Respondent journey ──────────────────────── */}
                <section {...narratable('journey')}>
                    <NowReading id="journey" />
                    <SectionHeading eyebrow="04 · The journey" id="journey" title="The respondent journey" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Following one respondent through a single cycle showed where the experience thinned —
                        with two primary breaks: between <strong>invitation and reminder</strong>, and between
                        <strong> submission and any visible impact</strong>.
                    </p>

                    {/* Plain editorial timeline (a rule, not six bordered cards) */}
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-6">
                        {JOURNEY.map((step) => {
                            const isBreakAfter = step.label === 'Invitation' || step.label === 'Submit';
                            const isSilence = step.label === 'Silence';
                            return (
                                <li key={step.label} className="relative">
                                    <span
                                        aria-hidden="true"
                                        className={
                                            'absolute -left-[1.85rem] top-1.5 w-2.5 h-2.5 rounded-full border-2 cl-bg-neutral-surface-level-0 ' +
                                            (isSilence ? 'cl-border-border-color-strong' : 'cl-border-border-color-default')
                                        }
                                    />
                                    <div className={isSilence ? 'font-bold' : 'font-semibold'}>
                                        <span className="text-sm uppercase tracking-wider cl-text-neutral-text-high-contrast">
                                            {step.label}
                                        </span>
                                    </div>
                                    <p className={
                                        'italic mt-0.5 ' +
                                        (isSilence
                                            ? 'text-lg cl-text-neutral-text-high-contrast'
                                            : 'text-base cl-text-neutral-text-medium-contrast')
                                    }>
                                        “{step.thought}”
                                    </p>
                                    {isBreakAfter && (
                                        <p className="mt-3 text-xs font-bold uppercase tracking-widest cl-text-semantic-warning-text">
                                            ↓ Experience break
                                        </p>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </section>

                {/* ── 5. Five respondent conditions ──────────────── */}
                <section {...narratable('five-conditions')}>
                    <NowReading id="five-conditions" />
                    <SectionHeading eyebrow="05 · The framework" id="five-conditions" title="The five respondent conditions" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Together, these five conditions form the <strong>respondent contract</strong>. The pilot
                        was weak on most of them.
                    </p>

                    <ol className="grid sm:grid-cols-2 gap-4">
                        {FIVE_CONDITIONS.map((c, i) => (
                            <li key={c.name} className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-8 rounded-lg cl-bg-neutral-surface-level-0 border cl-border-border-color-default flex items-center justify-center text-sm font-bold font-mono cl-text-brand-primary-base">
                                        {i + 1}
                                    </span>
                                    <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{c.name}</h3>
                                </div>
                                <p className="text-base cl-text-neutral-text-medium-contrast">{c.q}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* ── Supporting evidence (disclosures) ──────────── */}
                <section className="pt-20">
                    <SectionHeading eyebrow="Supporting evidence" id="supporting-evidence" title="How the conditions showed up" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Two areas carried most of the detail. They are summarised here and expandable in full.
                    </p>

                    <div className="space-y-3">
                        <CaseStudyDisclosure summary="Compare the invitation and reminder communication">
                            <p className="text-base cl-text-neutral-text-medium-contrast mb-6">
                                The reminder became the real entry point, but carried less of the context
                                respondents needed. This is analysis of the existing communications, not a
                                redesign that shipped.
                            </p>
                            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-high-contrast mb-3">Welcome contained</h3>
                                    <ul className="space-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· Three quick questions</li>
                                        <li>· Under two minutes</li>
                                        <li>· An anonymity statement</li>
                                        <li>· Broad purpose</li>
                                        <li>· A request for candid responses</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-high-contrast mb-3">Reminder contained</h3>
                                    <ul className="space-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· The survey still open</li>
                                        <li>· Under two minutes</li>
                                        <li>· Three simple questions</li>
                                        <li>· A participation call to action</li>
                                        <li>· A broad “better decisions” statement</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-6 pt-5 border-t cl-border-border-color-default">
                                <h3 className="text-xs font-bold uppercase tracking-widest cl-text-semantic-warning-text mb-3">Context missing from the reminder</h3>
                                <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                    <li>· Why the survey repeats</li>
                                    <li>· Practical anonymity</li>
                                    <li>· How open-text responses are processed</li>
                                    <li>· Who sees results</li>
                                    <li>· What happened after previous responses</li>
                                    <li>· Visible impact or closure</li>
                                </ul>
                            </div>
                        </CaseStudyDisclosure>

                        <CaseStudyDisclosure summary="How respondents interpreted anonymity">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Stated</h3>
                                    <p className="text-base font-medium cl-text-neutral-text-high-contrast">“Your response is anonymous.”</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-2">Respondent questions</h3>
                                    <ul className="space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                                        <li>· Can my manager infer it was me?</li>
                                        <li>· What happens in a small team?</li>
                                        <li>· Is my written response shown directly?</li>
                                        <li>· Who sees raw answers?</li>
                                        <li>· When are results hidden?</li>
                                    </ul>
                                </div>
                                <div className="pt-5 border-t cl-border-border-color-default">
                                    <h3 className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-2">Improved explanation direction</h3>
                                    <p className="text-sm cl-text-neutral-text-medium-contrast">
                                        Responses are combined into group-level patterns. Individual feedback is not
                                        shown as a named response. Reporting appears only when privacy conditions are
                                        met — a minimum group threshold applies. Framed as a direction, not a
                                        guarantee of anonymity, and no numeric threshold is published.
                                    </p>
                                </div>
                            </div>
                        </CaseStudyDisclosure>
                    </div>
                </section>

                {/* ── Participation vs honesty ───────────────────── */}
                <section className="pt-20">
                    <SectionHeading eyebrow="Interpretation" id="participation-honesty" title="Completion does not automatically equal candour" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        Submission count is not the complete measure of survey quality. Four factors matter
                        together — a way of thinking, not a literal formula:
                        {' '}
                        <strong className="cl-text-neutral-text-high-contrast">participation</strong>,{' '}
                        <strong className="cl-text-neutral-text-high-contrast">honesty</strong>,{' '}
                        <strong className="cl-text-neutral-text-high-contrast">representation</strong> and{' '}
                        <strong className="cl-text-neutral-text-high-contrast">actionability</strong>.
                    </p>
                </section>

                {/* ── 6. Evidence → insight → decision ───────────── */}
                <section {...narratable('evidence-insight-decision')}>
                    <NowReading id="evidence-insight-decision" />
                    <SectionHeading eyebrow="06 · Decisions" id="evidence-insight-decision" title="Evidence → insight → decision" />
                    <div className="grid md:grid-cols-2 gap-4">
                        {EVIDENCE_CARDS.map((c, i) => (
                            <div key={i} className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 flex flex-col gap-4">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-1">Evidence</div>
                                    <p className="text-base font-semibold cl-text-neutral-text-high-contrast">{c.evidence}</p>
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-1">Insight</div>
                                    <p className="text-sm cl-text-neutral-text-medium-contrast">{c.insight}</p>
                                </div>
                                <div className="pt-3 border-t cl-border-border-color-default">
                                    <div className="text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base mb-1">Decision</div>
                                    <p className="text-sm font-medium cl-text-neutral-text-high-contrast">{c.decision}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 7. Broken feedback loop ────────────────────── */}
                <section {...narratable('feedback-loop')}>
                    <NowReading id="feedback-loop" />
                    <SectionHeading eyebrow="07 · The loop" id="feedback-loop" title="The broken feedback loop" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        A recurring survey is a loop. When one step is missing, the whole loop weakens.
                    </p>

                    <figure className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
                        <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
                            {['Ask', 'Respond', 'Protect and aggregate', 'Interpret', 'Act', 'Communicate impact', 'Ask again'].map((step, i, arr) => {
                                const highlight = step === 'Communicate impact';
                                return (
                                    <li key={step} className="flex items-center gap-3">
                                        <span
                                            style={highlight ? { borderColor: 'var(--cl-color-brand-primary-base)' } : undefined}
                                            className={
                                                'rounded-full px-3.5 py-1.5 text-sm font-semibold border cl-bg-neutral-surface-level-0 ' +
                                                (highlight
                                                    ? 'cl-text-brand-primary-base'
                                                    : 'cl-border-border-color-default cl-text-neutral-text-high-contrast')
                                            }>
                                            {step}
                                            {highlight && <span className="ml-2 text-[10px] uppercase tracking-wider">← often missing</span>}
                                        </span>
                                        {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />}
                                    </li>
                                );
                            })}
                        </ol>

                        <div className="mt-8 pt-6 border-t cl-border-border-color-default">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm font-semibold">
                                <span className="cl-text-semantic-warning-text">No visible action</span>
                                <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast hidden sm:block" />
                                <span className="cl-text-semantic-warning-text">lower trust</span>
                                <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast hidden sm:block" />
                                <span className="cl-text-semantic-warning-text">weaker future participation</span>
                            </div>
                        </div>
                        <figcaption className="mt-6 text-base font-semibold cl-text-neutral-text-high-contrast">
                            A recurring survey must earn the next response.
                        </figcaption>
                    </figure>
                </section>

                {/* ── 8. Recommended future-state journey ────────── */}
                <section {...narratable('future-state')}>
                    <NowReading id="future-state" />
                    <SectionHeading eyebrow="08 · The system" id="future-state" title="The recommended respondent-experience system" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Strengthening all five conditions together turns a one-off ask into a lifecycle that
                        earns the next response.
                    </p>
                    {/* Plain numbered lifecycle — no repeated card chrome */}
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-3">
                        {FUTURE_STATE.map((step, i) => (
                            <li key={step} className="flex items-baseline gap-4">
                                <span className="text-sm font-mono font-bold cl-text-brand-primary-base w-6 shrink-0">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-base font-semibold cl-text-neutral-text-high-contrast">{step}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-8 text-base leading-relaxed cl-text-neutral-text-medium-contrast">
                        Shorter surveys reduce interaction effort, and conversational formats may improve
                        engagement — but neither creates relevance, safety, impact or ownership on its own. Any
                        format still depends on a credible respondent contract.
                    </p>
                </section>

                {/* ── 9. Ownership model ─────────────────────────── */}
                <section {...narratable('ownership')}>
                    <NowReading id="ownership" />
                    <SectionHeading eyebrow="09 · Ownership" id="ownership" title="The ownership model" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[520px]">
                            <caption className="sr-only">Roles and what each one owns in the feedback program.</caption>
                            <thead>
                                <tr className="border-b cl-border-border-color-default">
                                    <th scope="col" className="py-3 pr-6 text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">Role</th>
                                    <th scope="col" className="py-3 text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">Owns</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OWNERSHIP.map((o) => (
                                    <tr key={o.role} className="border-b cl-border-border-color-default align-top">
                                        <th scope="row" className="py-4 pr-6 text-sm font-bold cl-text-neutral-text-high-contrast whitespace-nowrap">{o.role}</th>
                                        <td className="py-4 text-sm cl-text-neutral-text-medium-contrast">{o.owns}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-6 text-base italic cl-text-neutral-text-medium-contrast border-l-2 pl-5"
                    >
                        When governance owns the entire activity, it risks becoming an HR survey. When managers
                        own follow-up, it becomes a management practice.
                    </p>
                </section>

                {/* ── 10. Limitations ────────────────────────────── */}
                <section {...narratable('limitations')}>
                    <NowReading id="limitations" />
                    <SectionHeading eyebrow="10 · Limitations" id="limitations" title="Limitations" />
                    <ul className="space-y-2.5 text-base cl-text-neutral-text-medium-contrast">
                        {[
                            'Small, early qualitative study in one internal organisation.',
                            'One employee interview and one governance stakeholder interview.',
                            'Management input was stakeholder feedback, not a formal interview.',
                            'Findings are directional hypotheses, not statistically representative.',
                            'No post-recommendation measurement exists.',
                        ].map((l) => (
                            <li key={l} className="flex gap-3">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{l}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        Everything proposed in this case study is a <strong>recommendation</strong>. None has
                        shipped and none has post-change measurement, so none is yet validated.
                    </p>

                    <div className="mt-6">
                        <CaseStudyDisclosure summary="View recommendation and validation status">
                            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2 text-sm cl-text-neutral-text-medium-contrast">
                                {RECOMMENDATIONS.map((r) => (
                                    <li key={r}>· {r}</li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-5 border-t cl-border-border-color-default flex flex-wrap gap-2">
                                <span className="text-xs cl-text-neutral-text-low-contrast mr-2 self-center">Evidence key used in this case:</span>
                                {['Confirmed evidence', 'Participant perspective', 'Stakeholder feedback', 'Research interpretation', 'Recommendation', 'Not validated'].map((k) => (
                                    <EvidenceTag key={k} kind={k} />
                                ))}
                            </div>
                        </CaseStudyDisclosure>
                    </div>
                </section>

                {/* ── 11. Reflection ─────────────────────────────── */}
                <section {...narratable('reflection')}>
                    <NowReading id="reflection" />
                    <SectionHeading eyebrow="11 · Reflection" id="reflection" title="What I learned" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            Participation was the visible symptom. Underneath it sat a system of purpose, trust,
                            honesty, visible impact and ownership. A three-question form can be effortless to
                            complete and still fail if people don't know why it repeats, whether it's genuinely
                            safe, or whether anything happens afterward.
                        </p>
                        <p>
                            The most useful contribution was diagnostic: reframing a dashboard-value problem as an
                            upstream respondent-experience problem — and staying honest about the line between
                            what the evidence confirmed and what it only suggested.
                        </p>
                    </div>
                </section>
            </div>

            {/* ── Footer nav ─────────────────────────────────────── */}
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
