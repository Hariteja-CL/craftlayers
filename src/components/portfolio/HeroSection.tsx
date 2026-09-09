import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Hero — the recruiter's first twenty seconds.
 *
 * The previous version stated the role well and then proved nothing: the whole
 * first viewport was five stacked claim blocks, three competing CTAs and a
 * strip of eight keywords. A reader could reach the fold without seeing a
 * single product, case or piece of evidence.
 *
 * Two changes fix that. The supporting line now names the product domains
 * rather than describing them abstractly, and the keyword strip is replaced by
 * three product-context lines that each link to the case proving them — so the
 * first screen answers "has he built something like ours?" and "which one do I
 * open?" at the same time.
 *
 * What is deliberately NOT here: no metrics, no team sizes, no adoption
 * numbers. None of that is evidenced, and the cases below are explicit about
 * being outcome-free.
 */

/** Named products, linked to their case. Employer-level context only —
 *  customers, tenants and pilot data stay out, which is what the anonymised
 *  and sanitised labels on each case refer to. */
const PROOF = [
    {
        domain: 'B2B culture analytics',
        detail: 'Assessment workflows and respondent experience',
        href: '/work/respondent-experience',
    },
    {
        domain: 'Multi-role dashboards',
        detail: 'Role-based reporting and explainability',
        href: '/work/dashboard-explainability',
    },
    {
        domain: 'Design-system governance',
        detail: 'One governed rule across three products',
        href: '/work/design',
    },
];

export function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="pt-36 pb-24 cl-bg-neutral-surface-level-0">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-5xl">

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-8 text-[11px] md:text-xs font-mono uppercase tracking-widest cl-text-brand-primary-base">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full cl-bg-brand-primary-base opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full cl-bg-brand-primary-base" />
                        </span>
                        Available for Q3 2026 Projects
                    </div>

                    {/* The job title stays the H1 and stays alone. It is what a
                        recruiter scans for, and anything sharing the line with it
                        makes the positioning ambiguous. */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.05] mb-5">
                        Senior Product Designer
                    </h1>

                    {/* Named domains, not adjectives. "Complex B2B products,
                        analytics and decision-support experiences" described a
                        category; this names the three things there is evidence for.
                        High-contrast, not brand colour: the brand orange measures
                        2.66:1 here and fails AA. */}
                    <p className="text-xl md:text-2xl font-semibold cl-text-neutral-text-high-contrast mb-6 leading-snug max-w-3xl">
                        Enterprise analytics, assessment workflows and design-system governance
                    </p>

                    <p className="text-lg md:text-xl cl-text-neutral-text-medium-contrast mb-4 leading-relaxed max-w-2xl font-medium">
                        8+ years designing multi-role B2B products, where the hard part is not the screen —
                        it is what the data means, who is allowed to act on it, and whether the decision
                        survives implementation.
                    </p>
                    <p className="text-base cl-text-neutral-text-medium-contrast mb-10">
                        Most recently EnCulture at NHR Technologies. In product and UX since 2017.
                    </p>

                    {/* Two CTAs, not three. "Explore profile" competed with the
                        work link for the same intent and won readers away from the
                        evidence; it is still one section below and in the nav. */}
                    <div className="flex flex-col sm:flex-row items-start gap-3">
                        <button
                            onClick={() => navigate('/work')}
                            className="px-6 py-3 rounded-xl text-sm font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-all cl-focus-ring"
                        >
                            See selected work
                        </button>
                        <a
                            href="/Hariteja-Nandipati-Resume.pdf"
                            download="Hariteja-Nandipati-Resume.pdf"
                            className="px-6 py-3 rounded-xl text-sm font-semibold border cl-border-border-color-default cl-bg-neutral-surface-level-1 cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-all cl-focus-ring"
                        >
                            Download résumé
                        </a>
                    </div>

                    {/* Proof strip — replaces the eight-keyword strip.
                        Keywords asserted capability; these name a product domain and
                        link to the case that evidences it, so the first screen
                        contains proof rather than only claims. */}
                    <div className="mt-16 pt-8 border-t cl-border-border-color-default grid gap-x-8 gap-y-6 sm:grid-cols-3">
                        {PROOF.map((p) => (
                            <Link
                                key={p.domain}
                                to={p.href}
                                className="group block cl-focus-ring rounded"
                            >
                                <span className="block text-sm font-bold cl-text-neutral-text-high-contrast group-hover:cl-text-brand-primary-base transition-colors">
                                    {p.domain}
                                </span>
                                <span className="mt-1 block text-sm cl-text-neutral-text-medium-contrast leading-snug">
                                    {p.detail}
                                </span>
                                <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest cl-text-brand-primary-base">
                                    See the case
                                    <ArrowRight aria-hidden="true" className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
