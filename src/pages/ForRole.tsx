import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { getCase } from '../data/evidence';
import type { EvidenceCaseId } from '../data/evidence';
import { getRoleProfile } from '../data/roleProfiles';

/**
 * /for/:slug — a role-specific reading of the existing evidence.
 *
 * This page owns no content. Every case fact comes from the evidence library;
 * every "why this is relevant" line comes from the role config. Adding a role
 * means adding an object to roleProfiles.ts, with no change here.
 *
 * It deliberately does not render case cards. An earlier version reused
 * WorkCard here, which pulled in summary, contribution and method the reader
 * had not asked for. A role page answers "why is this relevant to my job?" —
 * the case study itself answers everything else.
 *
 * A case title still appears once per requirement it answers, plus once in
 * the reading order. Three mentions is normal for a case that satisfies two
 * requirements, and is deliberate: the mapping is only useful if every
 * requirement names its own evidence.
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
                <p className="mt-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                    {intro}
                </p>
            )}
            <div className="mt-8">{children}</div>
        </section>
    );
}

/**
 * One case in the reading order: title, why it is worth reading for this role,
 * and a link out. No case body, no summary, no metadata beyond the label.
 */
function EvidencePointer({ caseId, note }: { caseId: EvidenceCaseId; note?: string }) {
    const c = getCase(caseId);
    if (!c) return null;

    return (
        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-low-contrast mb-2">
                {c.evidenceLabel}
            </p>
            <h3 className="text-xl md:text-2xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-snug max-w-2xl">
                {c.title}
            </h3>
            {note && (
                <p className="mt-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                    {note}
                </p>
            )}
            <Link
                to={c.href}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold cl-text-brand-primary-base hover:underline cl-focus-ring rounded"
            >
                See the evidence
                <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                />
            </Link>
        </div>
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

    const [leadId, ...alsoIds] = profile.featuredEvidence;

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* 1 · Role context. Identity first, role as context. */}
                <header className="pt-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-3">
                        Prepared for {profile.role}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.1]">
                        Senior Product Designer
                    </h1>
                    <p className="mt-6 text-lg md:text-xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-2xl">
                        {profile.positioning}
                    </p>
                </header>

                {/* 2 + 3 · What this role needs, and the comparable experience. */}
                <Section
                    eyebrow="01 · Relevance"
                    title="What this role needs, and where I have done it"
                    intro="Each requirement points at work already published on this site. Nothing here was written for this application, and no case was changed to fit it."
                >
                    <ul className="space-y-4">
                        {profile.requirements.map((r) => (
                            <li
                                key={r.requirement}
                                className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                                    What this role needs
                                </p>
                                <p className="mt-1 text-lg font-bold cl-text-neutral-text-high-contrast leading-snug">
                                    {r.requirement}
                                </p>

                                {/* Reason first, then a compact reference. The title
                                    used to lead this block, which made every mapping
                                    read as another case entry — a case answering two
                                    requirements looked like two pieces of evidence.
                                    Same treatment as the homepage problem → evidence
                                    link, so a repeated reference reads as a pointer
                                    rather than a repeated case. The fuller case
                                    presentation belongs to the reading order below. */}
                                <div className="mt-4 space-y-5 border-t cl-border-border-color-default pt-4">
                                    {r.evidence.map((ref) => {
                                        const c = getCase(ref.caseId);
                                        if (!c) return null;
                                        return (
                                            <div key={ref.caseId}>
                                                <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                                                    {ref.reason}
                                                </p>
                                                <Link
                                                    to={c.href}
                                                    className="group mt-2 inline-flex items-baseline gap-2 cl-focus-ring rounded"
                                                >
                                                    <span className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                                                        Evidence
                                                    </span>{' '}
                                                    <span className="text-sm font-semibold cl-text-brand-primary-base group-hover:underline">
                                                        {c.title}
                                                    </span>
                                                    <ArrowRight
                                                        aria-hidden="true"
                                                        className="w-3.5 h-3.5 shrink-0 self-center cl-text-brand-primary-base transition-transform group-hover:translate-x-0.5"
                                                    />
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* 4 · Start with this */}
                {leadId && (
                    <Section
                        eyebrow="02 · Reading order"
                        title="Start with this"
                        intro="One case first, then the supporting work."
                    >
                        <EvidencePointer caseId={leadId} note={profile.relevanceNotes[leadId]} />

                        {alsoIds.length > 0 && (
                            <>
                                <h3 className="mt-10 text-lg font-bold cl-text-neutral-text-high-contrast">
                                    Also relevant
                                </h3>
                                <div className="mt-5 grid gap-5 md:grid-cols-2">
                                    {alsoIds.map((id) => (
                                        <EvidencePointer
                                            key={id}
                                            caseId={id}
                                            note={profile.relevanceNotes[id]}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </Section>
                )}

                {/* 5 · Résumé + contact */}
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
                            to="/work"
                            className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-default px-5 py-3 text-sm font-semibold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors cl-focus-ring"
                        >
                            All work
                        </Link>
                    </div>
                    <p className="mt-6 text-sm cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                        This page is a reading order over work published across the rest of the site.
                        Nothing here is exclusive to it, and no case study was altered to suit it.
                    </p>
                </Section>
            </div>
        </div>
    );
}
