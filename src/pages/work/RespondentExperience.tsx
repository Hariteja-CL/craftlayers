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
import { NARRATION_SECTIONS } from './respondentExperience.narration';
import { ArrowRight, ArrowDown } from 'lucide-react';

/**
 * /work/respondent-experience — the public case.
 *
 * Compressed to the pattern set by /work/design: context, problem, role,
 * decision, what changed, evidence, limitations, deeper detail.
 *
 * WHAT LEFT, AND WHY.
 *
 * Fourteen sections was too many for 1,100 words — the page changed subject
 * roughly every eighty words, and several sections restated the one above.
 * "The universal respondent problem" opened with general survey commentary
 * before reaching this survey; the ownership table, the future-state lifecycle
 * and the recommendation list were the operating detail rather than the
 * judgement.
 *
 * THE PILOT FIGURES ARE GONE FROM THE PUBLIC PAGE. Invitation count,
 * participation rate and per-cycle response count were internal analytics from
 * one organisation's pilot. They were doing no work here that the argument
 * needs — the case turns on why a two-minute survey goes unanswered, which is
 * true at any sample size — and they belong to the protected layer.
 *
 * WHAT IS MARKED TO MOVE, NOT DELETED.
 *
 * Named in the closing section, present nowhere in this file: the detailed
 * respondent journey, the welcome and reminder communications, the
 * evidence-to-decision trace, the broken-feedback-loop model, the ownership
 * model, the recommended lifecycle, and the pilot analytics.
 *
 * TWO VISUALS. The small form outweighed by its surrounding experience, and
 * the diagnostic chain from symptom to source. Both carry the argument; the
 * rest were diagrams of the recommendation.
 */

/** The five conditions, by name and the question each one answers. The
 *  detailed evidence behind each is protected-layer content. */
const FIVE_CONDITIONS = [
    { name: 'Relevance', q: 'Why does this matter, and why am I being asked again?' },
    { name: 'Effort', q: 'What does responding require beyond the time spent filling the form?' },
    { name: 'Safety', q: 'Can I answer honestly without being personally exposed?' },
    { name: 'Impact', q: 'What happens after I submit?' },
    { name: 'Ownership', q: 'Who is responsible for acting?' },
];

const OWNED = [
    ['Research', 'Stakeholder interviews, communication review and a walk-through of the respondent journey.'],
    ['Problem diagnosis', 'Establishing that the reported problem was downstream of the real one.'],
    ['Behavioural analytics', 'Supporting signal on where people dropped away, read alongside the qualitative evidence rather than instead of it.'],
    ['Respondent UX & interaction design', 'The experience around the form — invitation, reminder, anonymity explanation and closure.'],
];

const JUMP_TARGETS = [
    { id: 'problem', label: 'Problem' },
    { id: 'decision', label: 'Five conditions' },
    { id: 'changed', label: 'What changed' },
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
    'evidence',
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
                            { label: 'Three Questions Were Not the Problem' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">Respondent Experience</Badge>
                        <Badge variant="secondary">UX Research</Badge>
                        <Badge variant="secondary">Problem diagnosis</Badge>
                        <Badge variant="outline">Public · Anonymised</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.1] tracking-tight mb-6">
                        Three Questions Were Not the Problem
                    </h1>

                    <p className="text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        Why were people dropping out when the survey itself was already short?
                    </p>

                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-8 border-l-2 pl-5 text-base cl-text-neutral-text-medium-contrast"
                    >
                        Public summary · EnCulture at NHR Technologies. Findings are anonymised; participation
                        figures and internal communications are not shown.
                    </p>

                    <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
                        <span className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-low-contrast">Focus </span>
                            <span className="font-semibold cl-text-neutral-text-high-contrast">UX Research &amp; Product Design</span>
                        </span>
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

                {/* Central question + visual 1 */}
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

                    {/* Visual 1 — a tiny form outweighed by the surrounding experience.
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

                {/* 1 · Context */}
                <section {...narratable('context')}>
                    <NowReading id="context" />
                    <SectionHeading eyebrow="01 · Context" id="context" title="Where the data comes from" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            EnCulture at NHR Technologies is a B2B culture analytics platform, and the assessment
                            experience is where its data originates. Everything downstream — the dashboards, the
                            insight, the recommendations — depends on people answering, and answering honestly.
                        </p>
                        <p>
                            That makes the respondent experience an upstream product problem rather than a
                            survey-design detail, which is the constraint that decided how this was worked on.
                        </p>
                    </div>
                </section>

                {/* 2 · The problem + visual 2 */}
                <section {...narratable('problem')}>
                    <NowReading id="problem" />
                    <SectionHeading eyebrow="02 · The problem" id="problem" title="Three questions were not the problem" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The instinct was to treat low participation as survey friction — too long, too
                            complex, too frequent. The survey was three questions and took about two minutes, so
                            friction was not what was stopping people.
                        </p>
                        <p>
                            <em>Repeatedly</em> and <em>honest</em> are the demanding words in that question. A
                            one-time form can succeed on novelty. A recurring one has to earn each response, and
                            it competes with the respondent's memory of what happened — or didn't — last time.
                        </p>
                    </div>

                    {/* Visual 2 — the diagnostic chain */}
                    <figure className="mt-10 rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-8">
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
                </section>

                {/* 4 · The decision */}
                <section {...narratable('decision')}>
                    <NowReading id="decision" />
                    <SectionHeading eyebrow="04 · The decision" id="decision" title="Five conditions, not one" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast mb-8">
                        Five things decide whether someone answers again. Effort was the only one anybody had
                        been designing for — and the only one that was not broken.
                    </p>
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-5">
                        {FIVE_CONDITIONS.map((c) => (
                            <li key={c.name} className="relative">
                                <span aria-hidden="true" className="absolute -left-[1.85rem] top-2 w-2.5 h-2.5 rounded-full border-2 cl-border-border-color-default cl-bg-neutral-surface-level-0" />
                                <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{c.name}</h3>
                                <p className="text-base cl-text-neutral-text-medium-contrast mt-0.5 italic">“{c.q}”</p>
                            </li>
                        ))}
                    </ol>

                    <p
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="mt-10 border-l-2 pl-6 text-lg md:text-xl font-medium cl-text-neutral-text-high-contrast leading-[1.6] max-w-[48ch]"
                    >
                        Completion does not automatically equal candour.
                    </p>
                    <p className="mt-5 text-base leading-relaxed cl-text-neutral-text-medium-contrast">
                        Submission count is not the complete measure of survey quality. Participation, honesty,
                        representation and actionability move independently — a survey can be fully completed and
                        still be worth very little.
                    </p>
                </section>

                {/* 5 · What changed */}
                <section {...narratable('changed')}>
                    <NowReading id="changed" />
                    <SectionHeading eyebrow="05 · What changed" id="changed" title="A dashboard problem became a respondent problem" />
                    <div className="space-y-5 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        <p>
                            The work arrived as a dashboard-value question — the data is thin, so fix the
                            reporting. It left as an upstream respondent-experience problem, and that changed what
                            got worked on.
                        </p>
                        <p>
                            The reminder had become the real entry point rather than the welcome message, so every
                            reminder had to stand on its own. Anonymity had to be explained in practice rather
                            than asserted as a word. And the loop had to close visibly: a recurring request that
                            shows no consequence has not earned the next response.
                        </p>
                    </div>
                </section>

                {/* 6 · Evidence */}
                <section {...narratable('evidence')}>
                    <NowReading id="evidence" />
                    <SectionHeading eyebrow="06 · Evidence" id="evidence" title="What this is based on" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        Early qualitative research intended to surface hypotheses, not a statistically
                        representative study: a small number of interviews, stakeholder feedback, and a review of
                        the communications and the respondent journey inside one organisation — with behavioural
                        analytics as supporting signal rather than proof. It does not explain all survey
                        non-response, and it is not presented as if it does.
                    </p>
                </section>

                {/* 7 · Limitations */}
                <section {...narratable('limitations')}>
                    <NowReading id="limitations" />
                    <SectionHeading eyebrow="07 · Limitations" id="limitations" title="What this does not prove" />
                    <ul className="space-y-2.5 text-base cl-text-neutral-text-medium-contrast">
                        {[
                            'The study was early and directional, with a small interview sample and no broad quantitative validation.',
                            'It was conducted in one organisation.',
                            'Management input was stakeholder feedback, not a formal interview.',
                            'Findings are directional hypotheses, not statistically representative.',
                            'Everything proposed is a recommendation: none has shipped, none has post-change measurement, and so none is validated.',
                        ].map((l) => (
                            <li key={l} className="flex gap-3">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{l}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        The most useful contribution was diagnostic: reframing a dashboard-value problem as an
                        upstream respondent-experience problem — and staying honest about the line between what
                        the evidence confirmed and what it only suggested.
                    </p>
                </section>

                {/* 8 · Deeper detail. The list doubles as the manifest for the
                    protected layer; none of it lives in this file. The CTA points
                    at /contact, a route that exists — there is no access flow and
                    this page does not pretend otherwise. */}
                <section className="pt-20">
                    <SectionHeading eyebrow="08 · Going deeper" id="deeper" title="The detailed case study" />
                    <p className="text-lg leading-relaxed cl-text-neutral-text-medium-contrast">
                        The rest of this work — the detailed respondent journey, the welcome and reminder
                        communications, the evidence-to-decision trace, the feedback-loop model, the ownership
                        model and the pilot's own participation data — is internal material from one
                        organisation. Detailed project evidence is available for hiring and review conversations.
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
