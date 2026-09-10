import { Link } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { WorkCard } from '../components/work/WorkCard';
import { ArrowRight } from 'lucide-react';
import { START_HERE_IDS, getCases } from '../data/evidence';

/**
 * Home — four sections under the hero, down from seven.
 *
 * The order used to be: problems, evidence, method, systems, capabilities,
 * profile, contact. A reader met four problem statements before a single case,
 * and then three consecutive blocks about how the work gets done — Method,
 * Systems and Capabilities were one idea told three times, each with its own
 * heading and its own grid.
 *
 * What replaced it is not less content in the same shape; it is the same
 * argument in fewer moves. Positioning, then proof, then practice. Selected
 * work now sits immediately under the hero, so evidence arrives before
 * methodology rather than after it.
 *
 * "Problems I help solve" is gone rather than demoted. Its four statements
 * were claims about the kind of work Hari is brought in for, and the three
 * case tensions below make the same point with a case attached to each — a
 * problem statement with evidence behind it beats one without, and running
 * both meant saying it twice.
 *
 * Written plain-language first: the audience includes recruiters and HR
 * professionals who do not read design vocabulary.
 */

/**
 * Three pillars, replacing Method, Systems and Capabilities.
 *
 * The old Method section was a numbered four-step model, which read as a
 * process tutorial — the thing every portfolio has and nobody believes. These
 * say what the practice actually is and what it costs to hold, which is the
 * part a hiring manager cannot get from a job title.
 *
 * What deliberately did not survive the merge: the "AI-enabled delivery" and
 * "Privacy-aware UX" capability cards. Both are real, both are covered on
 * /profile and inside the cases, and neither earns a third of the homepage's
 * practice section next to the two things that define the role.
 */
const PILLARS = [
    {
        name: 'Evidence before opinion',
        body: 'Research, product analytics, stakeholder context and how the product actually behaves decide what the problem is. Where the evidence is thin or a recommendation is untested, I say so rather than presenting a hunch as a finding.',
    },
    {
        name: 'Decisions become systems',
        body: 'A decision that lives in one screen gets re-argued every few months. The work is turning it into principles, patterns and rules that hold across roles, states, workflows and — where there is more than one — products.',
    },
    {
        name: 'Design stays close to implementation',
        body: 'I work alongside product and engineering through delivery and review, so the intent behind a decision survives the handover instead of being reinterpreted in the build.',
    },
];

function Section({
    id,
    eyebrow,
    title,
    intro,
    children,
}: {
    id?: string;
    eyebrow: string;
    title: string;
    intro?: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="pt-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-tight">
                {title}
            </h2>
            {intro && (
                <p className="mt-3 text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                    {intro}
                </p>
            )}
            <div className="mt-8">{children}</div>
        </section>
    );
}

export function Home() {
    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            {/* 1 · Hero and proof strip */}
            <HeroSection />

            <div className="max-w-5xl mx-auto px-6">

                {/* 2 · Selected work — first section under the hero, on purpose.
                    A hiring manager should reach a case before reading anything
                    about how the work is done. */}
                <Section
                    eyebrow="01 · Selected work"
                    title="Start here"
                    intro="Three cases, in reading order: finding the real problem, making complex data readable, and keeping one decision consistent across three products."
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Contribution IS passed here. The card answers "why open
                            this?" and the case answers "what did you do?" — but
                            withholding ownership left a recruiter unable to judge it
                            without committing to a 7-minute read. Method still stays
                            on /work: useful when comparing cases side by side, not
                            when deciding which to open. */}
                        {getCases(START_HERE_IDS).map((c, i, arr) => (
                            /* With an odd number of cards the last one would sit
                               alone at half width, which reads as a gap rather
                               than as a third case. The system story is last and
                               is a different kind of entry — /work already files
                               it under its own heading — so letting it run the
                               full width reads as hierarchy instead. */
                            <div
                                key={c.id}
                                className={
                                    arr.length % 2 === 1 && i === arr.length - 1
                                        ? 'md:col-span-2'
                                        : undefined
                                }
                            >
                                <WorkCard
                                    title={c.title}
                                    productContext={c.productContext}
                                    problem={c.problem}
                                    contribution={c.contribution}
                                    status={c.status}
                                    confidentiality={c.confidentiality}
                                    evidenceLabel={c.evidenceLabel}
                                    evidenceSummary={c.evidenceSummary}
                                    readTime={c.readTime}
                                    cta="See the decision story"
                                    href={c.href}
                                />
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/work"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold cl-text-brand-primary-base hover:underline cl-focus-ring rounded"
                    >
                        See all work
                        <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </Link>
                </Section>

                {/* 3 · How I work — one section where there were three. */}
                <Section
                    eyebrow="02 · Practice"
                    title="How I work"
                    intro="Three things that hold whatever the product is."
                >
                    {/* Three across only from lg. At the md breakpoint the columns
                        come out around 200px, which set this body copy at roughly
                        three words per line — thirteen lines for thirty-seven words.
                        Tablets get one full-width column instead, which is taller and
                        readable rather than shorter and not. */}
                    <dl className="grid gap-6 lg:grid-cols-3">
                        {PILLARS.map((p) => (
                            <div
                                key={p.name}
                                className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6"
                            >
                                <dt className="text-lg font-bold cl-text-neutral-text-high-contrast leading-snug">
                                    {p.name}
                                </dt>
                                <dd className="mt-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                                    {p.body}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Section>

                {/* 4 · Profile — two lines and one link. The hero already names the
                    role, the domains and the current employer; repeating any of it
                    here would cost a scroll and add nothing. What this adds is the
                    span of the career, which the hero deliberately does not carry. */}
                <Section eyebrow="03 · Profile" title="A little more context">
                    <p className="text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        15+ years across design, and 8+ years in product and UX since 2017.
                    </p>
                    <p className="mt-2 text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        Mostly enterprise SaaS: culture and people analytics, assessments, dashboards and
                        decision-support workflows.
                    </p>
                    <Link
                        to="/profile"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                    >
                        Read the full profile
                        <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </Link>
                </Section>

                {/* 5 · Contact */}
                <Section eyebrow="04 · Contact" title="Working on something complex?">
                    <p className="text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        If you are building an enterprise product, an analytics experience or an AI-enabled
                        workflow, I would be glad to talk it through.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            Contact Hari
                        </Link>
                        <a
                            href="https://linkedin.com/in/hariteja-nandipati"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                        >
                            LinkedIn
                        </a>
                    </div>
                </Section>
            </div>
        </div>
    );
}
