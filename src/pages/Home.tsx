import { Link } from 'react-router-dom';
import { HeroSection } from '../components/portfolio/HeroSection';
import { WorkCard } from '../components/work/WorkCard';
import { ArrowRight } from 'lucide-react';
import { PROBLEM_AREAS, START_HERE_IDS, getCase, getCases } from '../data/evidence';

/**
 * Home — eight sections, in the approved order.
 *
 * Written plain-language first: the audience includes recruiters and HR
 * professionals who do not read design vocabulary. Specialist terms are used
 * where recruiters search for them, but each is explained on first use rather
 * than assumed.
 *
 * Featured work sits before the process section, so a reader reaches evidence
 * quickly rather than wading through methodology.
 */

/**
 * Four steps, not six. "System" and "Validation" were separate entries, which
 * made this read as a methodology diagram rather than how decisions get made.
 * Both meanings survive inside step 04 and the note beneath the list.
 */
const WORKING_MODEL = [
    { step: 'Evidence', body: 'Gather what users, stakeholders and product data actually show.' },
    { step: 'Interpretation', body: 'Work out what it means and what the real problem is.' },
    { step: 'Decision', body: 'Choose a direction and record why.' },
    { step: 'Implementation', body: 'Turn the decision into something the product team can build and validate.' },
];

const LAYERS = [
    {
        name: 'Design',
        plain: 'Product framing, UX research, enterprise workflows, dashboards and accessibility.',
    },
    {
        name: 'AI-enabled delivery',
        plain: 'Using AI to accelerate research, documentation and implementation while keeping decisions human-reviewed.',
    },
    {
        name: 'Privacy-aware UX',
        plain: 'Designing experiences that minimise unnecessary data exposure and protect anonymity.',
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
            {/* 1 · Hero */}
            <HeroSection />

            <div className="max-w-5xl mx-auto px-6">

                {/* 2 · Problems I help solve — each one now carries a link to the
                    case that evidences it. A problem statement with no proof
                    behind it is a claim; the link is what makes it evidence. */}
                <Section
                    eyebrow="01 · The problems"
                    title="Problems I help solve"
                    intro="Four situations I am usually brought in for, and the work that shows each one."
                >
                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                        {PROBLEM_AREAS.map((p) => {
                            const evidence = getCase(p.caseId);
                            return (
                                <div key={p.title}>
                                    <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{p.title}</h3>
                                    <p className="mt-2 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                                        {p.body}
                                    </p>
                                    {/* A hairline rule turns the link from a trailing
                                        afterthought into the second half of the block,
                                        so Problem → evidence reads as structure rather
                                        than a stray link. Structural, not colour. */}
                                    {evidence && (
                                        <div className="mt-4 pt-3 border-t cl-border-border-color-default">
                                            <Link
                                                to={evidence.href}
                                                className="group inline-flex items-baseline gap-2 cl-focus-ring rounded"
                                            >
                                                <span className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                                                    Evidence
                                                </span>{' '}
                                                <span className="text-sm font-semibold cl-text-brand-primary-base group-hover:underline">
                                                    {p.evidenceLabel}
                                                </span>
                                                <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 shrink-0 self-center cl-text-brand-primary-base transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Section>

                {/* 3 · Evidence — before the process section, on purpose. A hiring
                    manager should not have to decide what to open first. */}
                <Section
                    eyebrow="02 · Selected evidence"
                    title="Start here"
                    intro="If you want to understand how I approach complex product problems, start with these two cases. Both are written up in full, including what the evidence did and did not support."
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Contribution and Method are deliberately not passed here.
                            The homepage card answers "why should I open this?" — the
                            case study itself answers "what exactly did you do?".
                            Both fields stay in the evidence library and still render
                            on /work and /for/:slug. */}
                        {getCases(START_HERE_IDS).map((c) => (
                            <WorkCard
                                key={c.id}
                                title={c.title}
                                problem={c.problem}
                                status={c.status}
                                confidentiality={c.confidentiality}
                                evidenceLabel={c.evidenceLabel}
                                evidenceSummary={c.evidenceSummary}
                                readTime={c.readTime}
                                cta="See the decision story"
                                href={c.href}
                            />
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

                {/* 4 · How I work */}
                <Section
                    eyebrow="03 · Method"
                    title="How I make product decisions"
                    intro="The same four steps, whatever the product."
                >
                    <ol className="border-l cl-border-border-color-default pl-6 space-y-5">
                        {WORKING_MODEL.map((m, i) => (
                            <li key={m.step} className="relative">
                                <span aria-hidden="true" className="absolute -left-[1.85rem] top-2 w-2.5 h-2.5 rounded-full border-2 cl-border-border-color-strong cl-bg-neutral-surface-level-0" />
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm font-mono cl-text-neutral-text-low-contrast">{`0${i + 1}`}</span>
                                    <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast">{m.step}</h3>
                                </div>
                                <p className="mt-1 text-base cl-text-neutral-text-medium-contrast leading-relaxed">{m.body}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-6 text-base cl-text-neutral-text-medium-contrast max-w-3xl">
                        Not every engagement reached formal validation. Recommendations remain unvalidated until
                        tested, and I say which is which.
                    </p>
                </Section>

                {/* 5 · Product systems */}
                <Section
                    eyebrow="04 · Systems"
                    title="Turning design decisions into implementation rules"
                    intro="Product systems are reusable principles, components and implementation guidance that help teams build consistently."
                >
                    <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                        <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                            A decision that only exists in a design file gets re-argued every few months. The work
                            is converting it into something durable — principles, tokens, component rules,
                            documentation and review criteria that survive handover.
                        </p>
                        <dl className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            {[
                                ['Design governance', 'Creating reusable rules that help design and engineering stay consistent.'],
                                ['Implementation alignment', 'Making sure design decisions are carried through accurately into the built product.'],
                            ].map(([term, plain]) => (
                                <div key={term}>
                                    <dt className="text-sm font-bold cl-text-neutral-text-high-contrast">{term}</dt>
                                    <dd className="text-sm cl-text-neutral-text-medium-contrast mt-0.5">{plain}</dd>
                                </div>
                            ))}
                        </dl>
                        <Link
                            to="/work/design"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold cl-text-brand-primary-base hover:underline cl-focus-ring rounded"
                        >
                            Read the system story
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                    </div>
                </Section>

                {/* 6 · Design · AI-enabled Delivery · Privacy-aware UX */}
                <Section
                    eyebrow="05 · Capabilities"
                    title="Capabilities I bring into product work"
                    intro="Three supporting capabilities, not three separate professions."
                >
                    <dl className="grid md:grid-cols-3 gap-6">
                        {LAYERS.map((l) => (
                            <div key={l.name} className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                                <dt className="text-lg font-bold cl-text-neutral-text-high-contrast">{l.name}</dt>
                                <dd className="mt-2 text-base cl-text-neutral-text-medium-contrast leading-relaxed">{l.plain}</dd>
                            </div>
                        ))}
                    </dl>
                </Section>

                {/* 7 · Profile preview */}
                <Section
                    eyebrow="06 · Profile"
                    title="A little more context"
                    intro="8+ years in UX and product design since 2017, mostly in enterprise SaaS — culture and people analytics, assessments, dashboards and decision-support workflows."
                >
                    <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                        I work comfortably across technical, AI and privacy-sensitive product areas, while
                        partnering with specialists for backend architecture, cybersecurity engineering,
                        penetration testing, data science and frontend engineering leadership.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            to="/profile"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            Explore profile
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                        <a
                            href="/Hariteja-Nandipati-Resume.pdf"
                            download="Hariteja-Nandipati-Resume.pdf"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                        >
                            Download résumé
                        </a>
                    </div>
                </Section>

                {/* 8 · Contact CTA */}
                <Section eyebrow="07 · Contact" title="Working on something complex?">
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
