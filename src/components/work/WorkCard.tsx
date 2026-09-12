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
    /**
     * The product this work happened in. Rendered directly under the title,
     * because "has he built something like ours?" is the question a card has
     * to answer before anyone clicks it.
     */
    productContext?: string;
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

    /**
     * A card hero. When present the card switches to the compressed anatomy —
     * visual, label, title, one line — because the point of a hero is to be
     * seen before any prose, and nine stacked text blocks underneath it would
     * defeat that.
     *
     * Cards without a hero render exactly as before, which is what keeps
     * /for/:slug and the earlier-experiment entries working untouched.
     */
    hero?: React.ReactNode;
    /**
     * The one sentence a hero card gets. Deliberately not `problem`: that
     * field is two or three sentences written for a page, and shortening it
     * here would mean two versions of the same text drifting apart.
     */
    cardLine?: string;
    /**
     * 'feature' lays the hero beside the content instead of above it, for the
     * card that occupies a full-width grid slot. A 16:10 hero at 976px would
     * be nearly 400px tall and swallow the page.
     */
    variant?: 'default' | 'feature';
}

export function WorkCard({
    title,
    productContext,
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
    hero,
    cardLine,
    variant = 'default',
}: WorkCardProps) {
    const tagline = evidenceLabel ?? category;
    const meta = [status, confidentiality, readTime].filter(Boolean) as string[];

    /* ---------------------------------------------------------------- *
     * Hero cards. A separate return rather than conditionals threaded
     * through the original markup: the two layouts share a title and a CTA
     * and almost nothing else, and interleaving them would make both harder
     * to read than having them side by side.
     * ---------------------------------------------------------------- */
    if (hero) {
        const isFeature = variant === 'feature';
        return (
            <Link
                to={href}
                className={
                    'group rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 ' +
                    'overflow-hidden hover:cl-border-border-color-strong hover:shadow-lg transition-all cl-focus-ring ' +
                    // h-full so cards in a row match height: without it a card
                    // with a one-line title is shorter than its neighbour, and
                    // the hero's share of the card drifts between them.
                    // lg, not md: at 768 a side-by-side feature card gives the hero only
                    // ~290px and squeezes the text beside it. Tablet stacks.
                    (isFeature ? 'flex flex-col lg:flex-row lg:items-stretch' : 'flex flex-col h-full')
                }
            >
                {/* Fixed ratio so cards in a row align regardless of how long
                    a title runs. On the feature card the hero takes a fraction
                    of the width instead, and drops back to 16:10 when stacked. */}
                <div
                    className={
                        // overflow-hidden + min-h-0 are load-bearing, not tidying. In a
                        // column flex container an item's automatic minimum size is its
                        // content, so a hero image at its intrinsic 1.61 ratio pushed this
                        // box past the aspect-ratio it was given — the frame silently became
                        // the image's shape and card heights moved with it.
                        'border-b cl-border-border-color-default overflow-hidden min-h-0 ' +
                        // One ratio now, matched to the source renders (1.61), so nothing
                        // meaningful is cropped at any width. The earlier 4:3 / 16:9 split
                        // existed to keep drawn diagrams legible; these renders carry their
                        // own composition, and cropping into them loses the subject.
                        (isFeature
                            ? 'aspect-[16/10] lg:aspect-auto lg:border-b-0 lg:border-r lg:w-[44%] lg:shrink-0'
                            : 'aspect-[16/10]')
                    }
                >
                    {hero}
                </div>

                <div className={'p-6 flex flex-col ' + (isFeature ? 'lg:flex-1 lg:justify-center lg:p-8' : 'flex-1')}>
                    <p className="text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-low-contrast">
                        {tagline ?? status}
                    </p>

                    <h3 className="mt-2 text-xl md:text-2xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-snug group-hover:cl-text-brand-primary-base transition-colors">
                        {title}
                    </h3>

                    {cardLine && (
                        <p className="mt-3 text-base cl-text-neutral-text-medium-contrast leading-relaxed">
                            {cardLine}
                        </p>
                    )}

                    <div className="mt-5 pt-1 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-auto">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold cl-text-brand-primary-base">
                            {cta ?? 'Read more'}
                            <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        {readTime && (
                            <span className="text-[11px] font-semibold uppercase tracking-wider cl-text-neutral-text-low-contrast">
                                {readTime}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

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

            {productContext && (
                <p className="mt-2 text-sm font-medium cl-text-neutral-text-medium-contrast">
                    {productContext}
                </p>
            )}

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
