import respondentHero from '../../assets/images/work/respondent-experience.webp';
import dashboardHero from '../../assets/images/work/dashboard-explainability.webp';
import designSystemHero from '../../assets/images/work/design-system-implementation.webp';

/**
 * Card hero visuals.
 *
 * These are the editorial entry layer for the cards, and only for the cards.
 * The case pages keep their flat diagrams — the hierarchy is deliberate:
 * a card earns the click with one rich image, and the page that opens then
 * does the explaining with evidence and reasoning visuals.
 *
 * WHY RASTER HERE AND COMPONENTS EVERYWHERE ELSE.
 *
 * The first pass drew these in markup, partly on the argument that there was
 * no image pipeline. That argument was wrong — src/assets/images has been
 * imported through Vite for a while. A drawn hero is the right tool for a
 * diagram that has to stay legible, theme-aware and readable by a screen
 * reader; it is the wrong tool for a rendered image whose whole job is to look
 * like something. These do the second job.
 *
 * DECORATIVE, DELIBERATELY.
 *
 * alt="" on all of them. The card's title and one-line summary already say
 * what the case is, and an alt that repeated the title would make a screen
 * reader announce the same thing twice. Nothing here carries meaning the
 * adjacent text does not.
 *
 * Each is 1024x637 WebP, between 16KB and 33KB — enough for 2x on the widest
 * card (478px) without shipping a source nobody sees at full size.
 */

/**
 * Shared frame. object-cover with a per-image focal point, because the card
 * crops to several different shapes: 4:3 while narrow, 16:9 from lg, and a
 * tall 44%-width column on the feature card. A single object-position would
 * lose the subject in at least one of them.
 */
function Hero({
    src,
    position = 'center',
}: {
    src: string;
    /** object-position; set per image where the subject is off-centre. */
    position?: string;
}) {
    return (
        <img
            src={src}
            alt=""
            /**
             * Eager, not lazy, and deliberately so.
             *
             * These three files come to 65KB between them and they are the
             * main visual payload of the page — the cards sit directly under
             * the hero, so the first one is what a visitor scrolls to. Lazy
             * saves almost nothing here and risks the hero popping in after
             * the text has already painted.
             *
             * It also could not be verified: in the preview pane the lazy
             * images never loaded even while fully in the viewport, and only
             * switching to eager fetched them. That is most likely a quirk of
             * an offscreen pane rather than a real browser, but "probably
             * fine" is a poor reason to lazy-load the thing the card exists
             * to show.
             */
            loading="eager"
            decoding="async"
            style={{ objectPosition: position }}
            className="w-full h-full object-cover"
        />
    );
}

/** Three question cards, and the experience running behind them. */
export function RespondentHero() {
    return <Hero src={respondentHero} position="center" />;
}

/** The layered object, and the reasoning path leading out of it. */
export function DashboardHero() {
    return <Hero src={dashboardHero} position="center" />;
}

/**
 * Fragments resolving into a governed grid.
 *
 * Held slightly left: the story runs left-to-right and the fragmented half is
 * the half that makes the ordered half mean anything. On the narrow 4:3 crop,
 * centring drops too much of it.
 */
export function DesignSystemHero() {
    return <Hero src={designSystemHero} position="42% center" />;
}

/**
 * One governed chain, two kinds of consumer.
 *
 * Still drawn rather than rendered: the field note is not carded yet, so there
 * is no image for it. Kept because that card is a decision away, and because
 * this is the one hero whose content is a diagram rather than a photograph.
 */
export function GovernanceHero() {
    return (
        <div aria-hidden="true" className="relative w-full h-full overflow-hidden cl-bg-neutral-surface-level-0 flex items-center justify-center p-5">
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
                                    (i === 3 ? '' : 'cl-border-border-color-strong cl-bg-neutral-surface-level-1')
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
