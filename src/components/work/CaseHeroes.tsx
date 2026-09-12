/**
 * Card hero visuals.
 *
 * WHY THESE ARE COMPONENTS AND NOT IMAGES.
 *
 * Every visual on this site is already drawn in markup, and there is no image
 * pipeline to hang raster heroes off. Components stay sharp at any density,
 * follow the theme, need no export step per breakpoint, and cost nothing to
 * download. They also cannot accidentally contain a screenshot.
 *
 * WHAT THESE ARE NOT.
 *
 * They are not miniature versions of the diagrams inside the case pages. A
 * card hero has about two seconds and one idea. So: shapes, spacing and
 * hierarchy carry the meaning, text is reduced to a few words, and the orange
 * accent marks the single thing worth noticing. If one of these starts
 * explaining something, it has become a diagram and should be cut back.
 *
 * Each hero echoes the lead visual of its own case page, so a card and the
 * page it opens rhyme rather than introducing two visual vocabularies.
 *
 * All of them are aria-hidden: the card's title and line already say what the
 * case is, and narrating decorative geometry would only add noise.
 */

const FRAME =
    'relative w-full h-full overflow-hidden cl-bg-neutral-surface-level-0 flex items-center justify-center p-5';

/** The short survey, and everything it never answered. */
export function RespondentHero() {
    return (
        <div aria-hidden="true" className={FRAME}>
            <div className="flex items-center gap-3 md:gap-4">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-12 h-14 md:w-14 md:h-16 rounded-lg border cl-border-border-color-strong cl-bg-neutral-surface-level-1 flex flex-col justify-center gap-1.5 px-2"
                    >
                        <span className="block h-1 w-full rounded-full cl-bg-neutral-surface-300" />
                        <span className="block h-1 w-2/3 rounded-full cl-bg-neutral-surface-300" />
                    </div>
                ))}
                <span aria-hidden="true" className="w-6 md:w-10 border-t border-dashed cl-border-border-color-strong" />
                <div
                    style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                    className="w-12 h-14 md:w-14 md:h-16 rounded-lg border-2 border-dashed flex items-center justify-center"
                >
                    <span className="text-2xl md:text-3xl font-bold cl-text-brand-primary-base leading-none">?</span>
                </div>
            </div>
        </div>
    );
}

/** A number that answers nothing. */
export function DashboardHero() {
    return (
        <div aria-hidden="true" className={FRAME}>
            <div className="flex items-center gap-5 md:gap-7">
                <div className="rounded-xl border cl-border-border-color-strong cl-bg-neutral-surface-level-1 px-5 py-4 md:px-7 md:py-5">
                    <span className="block text-4xl md:text-5xl font-bold cl-text-neutral-text-high-contrast tabular-nums leading-none">
                        72
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                            className="flex items-center gap-2 border-l-2 pl-2.5"
                        >
                            <span className="text-lg md:text-xl font-bold cl-text-brand-primary-base leading-none">?</span>
                            <span className="block h-1 w-10 md:w-14 rounded-full cl-bg-neutral-surface-300" />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Three surfaces drifting, then aligned on one shared band. */
export function DesignSystemHero() {
    return (
        <div aria-hidden="true" className={FRAME}>
            <div className="flex items-center gap-5 md:gap-7">
                {/* drifting */}
                <div className="flex flex-col gap-2">
                    {[
                        'w-14 md:w-16 translate-x-2',
                        'w-12 md:w-14 -translate-x-1',
                        'w-16 md:w-20 translate-x-3',
                    ].map((c, i) => (
                        <span
                            key={i}
                            className={`block h-3.5 md:h-4 rounded border cl-border-border-color-default cl-bg-neutral-surface-level-1 ${c}`}
                        />
                    ))}
                </div>

                <span aria-hidden="true" className="text-lg cl-text-neutral-text-low-contrast">→</span>

                {/* governed */}
                <div className="flex flex-col gap-2 items-start">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="block h-3.5 md:h-4 w-16 md:w-20 rounded border cl-border-border-color-strong cl-bg-neutral-surface-level-1"
                        />
                    ))}
                    <span
                        style={{ backgroundColor: 'var(--cl-color-brand-primary-base)' }}
                        className="block h-1.5 w-16 md:w-20 rounded-full mt-0.5"
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * One governed chain, two kinds of consumer.
 *
 * Built now and exported for reuse; the field note is not carded yet.
 */
export function GovernanceHero() {
    return (
        <div aria-hidden="true" className={FRAME}>
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5 md:gap-2">
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="flex items-center gap-1.5 md:gap-2">
                            <span
                                style={
                                    i === 3
                                        ? { backgroundColor: 'var(--cl-color-brand-primary-base)', borderColor: 'transparent' }
                                        : undefined
                                }
                                className={
                                    'block h-3.5 w-9 md:h-4 md:w-11 rounded border ' +
                                    (i === 3
                                        ? ''
                                        : 'cl-border-border-color-strong cl-bg-neutral-surface-level-1')
                                }
                            />
                            {i < 3 && <span className="block w-1.5 h-px cl-bg-neutral-surface-400" />}
                        </span>
                    ))}
                </div>

                <span aria-hidden="true" className="text-base cl-text-neutral-text-low-contrast leading-none">↓</span>

                <div className="flex items-center gap-3">
                    {['Human', 'AI'].map((who) => (
                        <span
                            key={who}
                            className="rounded-full border cl-border-border-color-strong cl-bg-neutral-surface-level-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-medium-contrast"
                        >
                            {who}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
