import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Shared card for every entry on the Work page.
 *
 * One card type across all three categories, so a reader can compare entries
 * on the same terms. Optional fields are omitted entirely rather than
 * rendering an empty row.
 *
 * Accessibility: the whole card is a single link. Nothing is nested inside it
 * that would create an interactive control within an interactive control, and
 * nothing depends on hover — the arrow is decorative, and the status and
 * confidentiality are text, not colour.
 */

export type WorkStatus =
    | 'Public case study'
    | 'Sanitised case study'
    | 'System story'
    | 'Concept prototype'
    | 'Earlier experiment';

export interface WorkCardProps {
    title: string;
    /** What was wrong, in one line. */
    problem: string;
    /** What Hari actually did. */
    contribution?: string;
    /** How it was evidenced. */
    method?: string;
    status: WorkStatus;
    /** e.g. "Public · Anonymised" — omitted when not meaningful. */
    confidentiality?: string;
    /** Tag line, e.g. "Analytics UX · Enterprise SaaS". */
    category?: string;
    /**
     * What this case is evidence *of*, e.g. "Research · Problem diagnosis".
     * Rendered in place of `category` when present — same slot, so cards keep
     * a single shape whichever page they appear on.
     */
    evidenceLabel?: string;
    /**
     * One sentence on what the case proves. Shown under "Why this matters",
     * for readers deciding whether this case answers their question.
     */
    evidenceSummary?: string;
    /** e.g. "7 min read". */
    readTime?: string;
    /** Overrides the default "Read more". */
    cta?: string;
    href: string;
}

export function WorkCard({
    title,
    problem,
    contribution,
    method,
    status,
    confidentiality,
    category,
    evidenceLabel,
    evidenceSummary,
    readTime,
    cta,
    href,
}: WorkCardProps) {
    const tagline = evidenceLabel ?? category;
    const meta = [status, confidentiality, readTime].filter(Boolean) as string[];

    return (
        <Link
            to={href}
            className="group block rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 hover:cl-border-border-color-strong hover:shadow-lg transition-all cl-focus-ring"
        >
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {meta.map((m, i) => (
                    <span
                        key={m}
                        className={
                            'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ' +
                            (i === 0
                                ? 'border cl-border-border-color-strong cl-text-neutral-text-high-contrast'
                                : 'cl-text-neutral-text-low-contrast')
                        }
                    >
                        {m}
                    </span>
                ))}
            </div>

            {tagline && (
                <p className="text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-low-contrast mb-2">
                    {tagline}
                </p>
            )}

            <h3 className="text-xl md:text-2xl font-bold cl-text-neutral-text-high-contrast tracking-tight group-hover:cl-text-brand-primary-base transition-colors">
                {title}
            </h3>

            <p className="mt-2 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                {problem}
            </p>

            {(contribution || method) && (
                <dl className="mt-4 space-y-1.5">
                    {contribution && (
                        <div className="flex flex-col sm:flex-row sm:gap-3">
                            <dt className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast sm:w-28 shrink-0">
                                Contribution
                            </dt>
                            <dd className="text-sm cl-text-neutral-text-medium-contrast">{contribution}</dd>
                        </div>
                    )}
                    {method && (
                        <div className="flex flex-col sm:flex-row sm:gap-3">
                            <dt className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast sm:w-28 shrink-0">
                                Method
                            </dt>
                            <dd className="text-sm cl-text-neutral-text-medium-contrast">{method}</dd>
                        </div>
                    )}
                </dl>
            )}

            {evidenceSummary && (
                <div className="mt-4 border-l-2 cl-border-border-color-strong pl-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                        Why this matters
                    </p>
                    <p className="mt-1 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                        {evidenceSummary}
                    </p>
                </div>
            )}

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold cl-text-brand-primary-base">
                {cta ?? 'Read more'}
                <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
        </Link>
    );
}
