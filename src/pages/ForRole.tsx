import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { WorkCard } from '../components/work/WorkCard';
import { getCases } from '../data/evidence';
import { getRoleProfile } from '../data/roleProfiles';

/**
 * /for/:slug — a role-specific reading of the existing evidence.
 *
 * This page owns no content. Everything it shows comes from the evidence
 * library or a role config; adding a role means adding an object to
 * roleProfiles.ts, with no change here. That is the point: one evidence
 * library, many lightweight interpretations, rather than a duplicated
 * portfolio per application.
 *
 * The visible identity stays Senior Product Designer. The role being applied
 * for is context above it, not a re-titling.
 *
 * Not linked from the main navigation. These are pages you send someone.
 */

function Section({
    eyebrow,
    title,
    intro,
    children,
}: {
    eyebrow: string;
    title: string;
    intro?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="pt-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                {eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight">
                {title}
            </h2>
            {intro && (
                <p className="mt-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-3xl">
                    {intro}
                </p>
            )}
            <div className="mt-8">{children}</div>
        </section>
    );
}

function NotFound() {
    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <h1 className="text-4xl md:text-5xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.1]">
                    That role page does not exist
                </h1>
                <p className="mt-6 text-lg cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                    The link may be out of date. The full portfolio covers the same work.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        to="/work"
                        className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                    >
                        See all work
                        <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                    >
                        Go to the homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function ForRole() {
    const { slug } = useParams<{ slug: string }>();
    const profile = slug ? getRoleProfile(slug) : undefined;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!profile) return <NotFound />;

    const featured = getCases(profile.featuredEvidence);
    const [lead, ...alsoRelevant] = featured;

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* 1 · Role header. Identity first, role as context. */}
                <header className="pt-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                        Prepared for {profile.role}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.1]">
                        Senior Product Designer
                    </h1>
                    <p className="mt-6 text-lg md:text-xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        {profile.positioning}
                    </p>
                </header>

                {/* 2 · Requirement → evidence mapping */}
                <Section
                    eyebrow="01 · Relevance"
                    title="Why my experience maps to this role"
                    intro="Each requirement below links to work that already exists on this site. Nothing here was written for this application."
                >
                    <ul className="space-y-5">
                        {profile.requirements.map((r) => {
                            const cases = getCases(r.evidence);
                            return (
                                <li
                                    key={r.requirement}
                                    className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-5"
                                >
                                    <div className="grid md:grid-cols-[1fr_1.3fr] gap-x-8 gap-y-3">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-1">
                                                What this role needs
                                            </p>
                                            <p className="text-base font-bold cl-text-neutral-text-high-contrast leading-snug">
                                                {r.requirement}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-1">
                                                Comparable experience
                                            </p>
                                            {r.note && (
                                                <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                                                    {r.note}
                                                </p>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                                {cases.map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        to={c.href}
                                                        className="inline-flex items-center gap-1.5 text-sm font-semibold cl-text-brand-primary-base hover:underline cl-focus-ring rounded"
                                                    >
                                                        {c.title}
                                                        <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Section>

                {/* 3 · Recommended reading order */}
                {lead && (
                    <Section
                        eyebrow="02 · Evidence"
                        title="Start with this"
                        intro={profile.relevanceNotes[lead.id]}
                    >
                        <WorkCard
                            title={lead.title}
                            problem={lead.problem}
                            contribution={lead.contribution}
                            method={lead.method}
                            status={lead.status}
                            confidentiality={lead.confidentiality}
                            evidenceLabel={lead.evidenceLabel}
                            evidenceSummary={lead.evidenceSummary}
                            readTime={lead.readTime}
                            cta="See the decision story"
                            href={lead.href}
                        />

                        {alsoRelevant.length > 0 && (
                            <>
                                <h3 className="mt-12 text-lg font-bold cl-text-neutral-text-high-contrast">
                                    Also relevant
                                </h3>
                                <div className="mt-5 grid gap-5 md:grid-cols-2">
                                    {alsoRelevant.map((c) => (
                                        <div key={c.id}>
                                            <WorkCard
                                                title={c.title}
                                                problem={c.problem}
                                                contribution={c.contribution}
                                                method={c.method}
                                                status={c.status}
                                                confidentiality={c.confidentiality}
                                                evidenceLabel={c.evidenceLabel}
                                                evidenceSummary={c.evidenceSummary}
                                                readTime={c.readTime}
                                                cta="See the decision story"
                                                href={c.href}
                                            />
                                            {profile.relevanceNotes[c.id] && (
                                                <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                                                    {profile.relevanceNotes[c.id]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Section>
                )}

                {/* 4 · Résumé + contact */}
                <Section eyebrow="03 · Next" title="Résumé and contact">
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={profile.resumeUrl}
                            download
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            <Download aria-hidden="true" className="w-4 h-4" />
                            Download résumé
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                        >
                            Get in touch
                        </Link>
                        <Link
                            to="/profile"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                        >
                            Full profile
                        </Link>
                    </div>
                    <p className="mt-6 text-sm cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                        This page is a reading order over the same work published across the rest of the
                        site. Nothing here is exclusive to it.
                    </p>
                </Section>
            </div>
        </div>
    );
}
