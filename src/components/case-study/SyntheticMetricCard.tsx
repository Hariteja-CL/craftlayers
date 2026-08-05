import { useId, useState } from 'react';
import { Info } from 'lucide-react';

/**
 * Public-safe reconstruction of the summary-card pattern from the private
 * high-fidelity HTML concept.
 *
 * WHAT IS PRESERVED (the design reasoning being demonstrated):
 *  - Card anatomy: title + info affordance, prominent score with status chip,
 *    plain-language summary, segmented distribution bar, labelled legend,
 *    explore action.
 *  - Three separate explanation layers rather than one overloaded tooltip:
 *      · info affordance -> stable metric-level context
 *      · score           -> calculation context
 *      · bar segment     -> category-specific context
 *  - Semantic data colour decoupled from the brand accent.
 *  - Every colour paired with a text label (greyscale-safe).
 *  - Action guidance attached to each segment.
 *
 * WHAT IS DELIBERATELY CHANGED (confidentiality):
 *  - Fictional metric name, fictional values, fictional bands.
 *  - Generic calculation sentence; no proprietary formula.
 *  - CraftLayers tokens throughout; none of the original brand tokens.
 *
 * WHAT IS IMPROVED OVER THE SOURCE (approved accessibility deviations):
 *  - The concept revealed the score and segment detail on hover only. Here the
 *    same detail is reachable by hover, keyboard focus and tap.
 *  - The explore action was hover-revealed; here it is always visible.
 *  - Panels open as callouts anchored to the card, never inline, so opening one
 *    never resizes the card or shifts the dashboard around it. They are also
 *    constrained to the card's width so nothing overflows a 375px screen.
 */

type Segment = {
    key: string;
    name: string;
    band: string;
    pct: number;
    meaning: string;
    action: string;
    /** CraftLayers semantic token family — never the source palette. */
    token: 'success' | 'warning' | 'error';
};

export const SEGMENTS: Segment[] = [
    {
        key: 'healthy',
        name: 'Healthy',
        band: '75–100',
        pct: 54,
        meaning: 'Responses in the upper band. Practices here are working and worth protecting.',
        action: 'Sustain and scale what is working',
        token: 'success',
    },
    {
        key: 'watch',
        name: 'Watch',
        band: '45–74',
        pct: 31,
        meaning: 'Responses in the middle band. Targeted attention can move these upward.',
        action: 'Review and prioritise for improvement',
        token: 'warning',
    },
    {
        key: 'at-risk',
        name: 'At risk',
        band: '0–44',
        pct: 15,
        meaning: 'Responses in the lower band. Left unaddressed these can pull the index down.',
        action: 'Escalate and investigate the cause',
        token: 'error',
    },
];

const tokenColor = (t: Segment['token']) => `var(--cl-color-semantic-${t}-500)`;
const tokenText = (t: Segment['token']) => `var(--cl-color-semantic-${t}-text)`;
const tokenBg = (t: Segment['token']) => `var(--cl-color-semantic-${t}-background)`;

export type CardPanel = 'none' | 'info' | 'score' | 'segment';

/**
 * Surface data for a metric variant.
 *
 * The point of the composition is that one card system carries several
 * *different shapes* of metric — an index, a coverage percentage, a tone
 * split — without inventing a new component for each. All fictional.
 */
export interface MetricVariant {
    title: string;
    value: string;
    status: string;
    statusToken: Segment['token'];
    summary: string;
    segments: Segment[];
}

export const METRIC_VARIANTS: MetricVariant[] = [
    {
        title: 'Organisational Health Index',
        value: '72',
        status: 'Moderate',
        statusToken: 'warning',
        summary: 'Steady overall, with a meaningful share in the middle band — the most movable group.',
        segments: SEGMENTS,
    },
];

/* ------------------------------------------------------------------ *
 * Two further card types, deliberately built differently.
 *
 * The point of the composition is that three *kinds* of data need three
 * different colour systems — not that one treatment is repeated three times.
 * Both are static: the case study explains reasoning, it does not need to
 * reproduce every interaction from the concept.
 * ------------------------------------------------------------------ */

const shell =
    'relative rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-5 w-full';
const cardTitle =
    'text-[11px] font-bold uppercase tracking-[0.08em] cl-text-neutral-text-medium-contrast';

/**
 * Participation / completion state.
 *
 * Deliberately avoids evaluative colour: a person who has not answered yet is
 * not a failure. Pending is neutral, amber appears only where an operational
 * follow-up is genuinely due, and red is held back for an actual error.
 */
export function ParticipationCard() {
    const states = [
        { name: 'Completed', pct: 68, colour: 'var(--cl-color-accents-emerald-500)', note: 'Submitted and included in every metric' },
        { name: 'Follow-up due', pct: 12, colour: 'var(--cl-color-accents-amber-500)', note: 'Reminder window has passed' },
        { name: 'Pending', pct: 18, colour: 'var(--cl-color-neutral-surface-400)', note: 'Still open — a state, not a risk' },
        { name: 'Failed to send', pct: 2, colour: 'var(--cl-color-semantic-error-500)', note: 'Delivery error — the only red here' },
    ];
    return (
        <div className={shell}>
            <h4 className={cardTitle}>Response Completion</h4>
            <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold cl-text-neutral-text-high-contrast leading-none">68</span>
                <span className="text-sm cl-text-neutral-text-medium-contrast">of 100 invited</span>
            </div>
            <div className="mt-4 flex h-2.5 rounded-full overflow-hidden" role="img"
                aria-label={`Completion: ${states.map(s => `${s.name} ${s.pct} percent`).join(', ')}`}>
                {states.map((s) => (
                    <span key={s.name} style={{ backgroundColor: s.colour, width: `${s.pct}%` }} />
                ))}
            </div>
            <ul className="mt-3 space-y-1.5">
                {states.map((s) => (
                    <li key={s.name} className="flex items-baseline gap-2 text-xs cl-text-neutral-text-medium-contrast">
                        <span aria-hidden="true" style={{ backgroundColor: s.colour }} className="w-2 h-2 rounded-full shrink-0 translate-y-0.5" />
                        <span><span className="font-semibold cl-text-neutral-text-high-contrast">{s.name} {s.pct}%</span> — {s.note}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * Categorical distribution.
 *
 * No score, no status chip, no valence: these are groups, not grades. Colours
 * distinguish rather than rank, so nothing here should read as good or bad.
 */
export function DistributionCard() {
    /**
     * Categorical palette: distinguishes without ranking.
     *
     * Note that semantic-info-500 and accents-violet-500 are the same hex in
     * this design system, so they cannot both appear in one chart. These three
     * are separated by hue *and* lightness, and the bar carries gaps so
     * adjacent categories stay legible even if colour perception differs.
     */
    const groups = [
        { name: 'Product', pct: 41, colour: 'var(--cl-color-accents-violet-500)' },
        { name: 'Operations', pct: 34, colour: 'var(--cl-color-neutral-surface-700)' },
        { name: 'Enablement', pct: 25, colour: 'var(--cl-color-accents-violet-300)' },
    ];
    return (
        <div className={shell}>
            <h4 className={cardTitle}>Team Alignment Distribution</h4>
            <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                Share of responses by team group. Categories, not grades — no group is better than another.
            </p>
            {/* Gaps between categories — separation never depends on hue alone */}
            <div className="mt-4 flex h-2.5 gap-1" role="img"
                aria-label={`Distribution by group: ${groups.map(g => `${g.name} ${g.pct} percent`).join(', ')}`}>
                {groups.map((g) => (
                    <span key={g.name} style={{ backgroundColor: g.colour, width: `${g.pct}%` }} className="rounded-full" />
                ))}
            </div>
            <ul className="mt-3 space-y-1.5">
                {groups.map((g) => (
                    <li key={g.name} className="flex items-baseline gap-2 text-xs cl-text-neutral-text-medium-contrast">
                        <span aria-hidden="true" style={{ backgroundColor: g.colour }} className="w-2 h-2 rounded-sm shrink-0 translate-y-0.5" />
                        <span className="font-semibold cl-text-neutral-text-high-contrast">{g.name} {g.pct}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

interface Props {
    /** Which explanation layer is open. Omit for a live, interactive card. */
    forcedPanel?: CardPanel;
    /** Which segment's detail to show when forcedPanel is "segment". */
    forcedSegment?: string;
    /** Compact form used inside the dashboard composition. */
    compact?: boolean;
    /** Metric variant to render. Defaults to the primary index. */
    metric?: MetricVariant;
}

export function SyntheticMetricCard({ forcedPanel, forcedSegment, compact = false, metric }: Props) {
    const uid = useId();
    const controlled = forcedPanel !== undefined;
    const m = metric ?? METRIC_VARIANTS[0];
    const bands = m.segments;

    const [panel, setPanel] = useState<CardPanel>('none');
    const [segmentKey, setSegmentKey] = useState<string>(bands[0].key);

    const openPanel = controlled ? forcedPanel : panel;
    const openSegment = controlled ? (forcedSegment ?? bands[0].key) : segmentKey;
    const segment = bands.find((s) => s.key === openSegment) ?? bands[0];

    const showSegment = (key: string) => {
        if (controlled) return;
        setSegmentKey(key);
        setPanel('segment');
    };

    /**
     * Explanation panels are callouts, never inline.
     *
     * In the live card they are absolutely positioned, so opening one never
     * resizes the card or shifts anything around it — the same decision the
     * original concept made (every panel there was position:absolute). Inline
     * panels would push the surrounding dashboard about every time a reader
     * moved across a segment.
     *
     * In the static state showcase the panel sits in flow beneath its card, so
     * three cards can be compared side by side without overlapping each other.
     */
    const panelBase = controlled
        ? 'mt-3 rounded-xl border cl-border-border-color-strong cl-bg-neutral-surface-level-0 p-4 shadow-lg'
        : 'absolute left-0 right-0 top-full mt-2 z-30 rounded-xl border cl-border-border-color-strong cl-bg-neutral-surface-level-0 p-4 shadow-xl';

    return (
        <div className="relative rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-5 w-full">
            {/* Header: title + info affordance (click / tap, never hover) */}
            <div className="flex items-center gap-2 mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] cl-text-neutral-text-medium-contrast">
                    {m.title}
                </h4>
                {!controlled && (
                    <button
                        type="button"
                        aria-expanded={openPanel === 'info'}
                        aria-controls={`${uid}-info`}
                        onClick={() => setPanel(openPanel === 'info' ? 'none' : 'info')}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full border cl-border-border-color-strong cl-text-neutral-text-medium-contrast hover:cl-text-brand-primary-base transition-colors cl-focus-ring"
                    >
                        <Info aria-hidden="true" className="w-3 h-3" />
                        <span className="sr-only">About this metric</span>
                    </button>
                )}
            </div>

            {/* Score + status chip. Inspectable by hover, focus and tap. */}
            <div className="flex items-center gap-3 flex-wrap">
                {controlled ? (
                    <span className="text-4xl font-bold cl-text-neutral-text-high-contrast leading-none">{m.value}</span>
                ) : (
                    <button
                        type="button"
                        aria-expanded={openPanel === 'score'}
                        aria-controls={`${uid}-score`}
                        // Open rather than toggle: a pointer click fires focus first,
                        // so a toggle here would immediately close what focus opened.
                        onClick={() => setPanel('score')}
                        onMouseEnter={() => setPanel('score')}
                        onFocus={() => setPanel('score')}
                        className="text-4xl font-bold cl-text-neutral-text-high-contrast leading-none rounded cl-focus-ring"
                    >
                        {m.value}
                        <span className="sr-only">, show how this score is calculated</span>
                    </button>
                )}
                <span
                    style={{ backgroundColor: tokenBg(m.statusToken), color: tokenText(m.statusToken) }}
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                >
                    {m.status}
                </span>
            </div>

            {!compact && (
                <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                    {m.summary}
                </p>
            )}

            {/* Segmented distribution bar */}
            <div className="mt-4">
                <div className="flex h-2.5 rounded-full overflow-hidden" role="img"
                    aria-label={`Distribution: ${bands.map(s => `${s.name} ${s.pct} percent`).join(', ')}`}>
                    {bands.map((s) =>
                        controlled ? (
                            <span
                                key={s.key}
                                style={{
                                    backgroundColor: tokenColor(s.token),
                                    width: `${s.pct}%`,
                                    filter: openPanel === 'segment' && s.key === openSegment ? 'brightness(1.15)' : undefined,
                                }}
                            />
                        ) : (
                            <button
                                key={s.key}
                                type="button"
                                style={{ backgroundColor: tokenColor(s.token), width: `${s.pct}%` }}
                                onMouseEnter={() => showSegment(s.key)}
                                onFocus={() => showSegment(s.key)}
                                onClick={() => showSegment(s.key)}
                                aria-label={`${s.name}, ${s.pct} percent — show detail`}
                                className="cl-focus-ring"
                            />
                        )
                    )}
                </div>

                {/* Legend — colour is never the only carrier of meaning */}
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {bands.map((s) => (
                        <li key={s.key} className="inline-flex items-center gap-1.5 text-xs cl-text-neutral-text-medium-contrast">
                            <span aria-hidden="true" style={{ backgroundColor: tokenColor(s.token) }} className="w-2 h-2 rounded-full" />
                            {s.name} {s.pct}%
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Explanation layer 1: metric-level context ── */}
            {openPanel === 'info' && (
                <div id={`${uid}-info`} className={panelBase}>
                    <p className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1">About this metric</p>
                    <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                        A composite index summarising four organisational dimensions, so leaders can see overall
                        health in one number. Index score on a 0–100 scale.
                    </p>
                    <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast">
                        Calculated from four weighted dimensions using the selected organisational model.
                    </p>
                    <ul className="mt-3 space-y-1.5">
                        {bands.map((s) => (
                            <li key={s.key} className="flex items-baseline gap-2 text-sm">
                                <span aria-hidden="true" style={{ backgroundColor: tokenColor(s.token) }} className="w-2 h-2 rounded-full shrink-0 translate-y-1" />
                                <span className="font-semibold cl-text-neutral-text-high-contrast">{s.name}</span>
                                <span style={{ backgroundColor: tokenBg(s.token), color: tokenText(s.token) }} className="rounded-full px-2 py-0.5 text-[10px] font-bold">
                                    {s.band}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-xs cl-text-neutral-text-low-contrast">
                        Band percentages are shown in the bar — not repeated here.
                    </p>
                </div>
            )}

            {/* ── Explanation layer 2: calculation context ── */}
            {openPanel === 'score' && (
                <div id={`${uid}-score`} className={panelBase}>
                    <p className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1">How this score is produced</p>
                    <p className="text-sm cl-text-neutral-text-medium-contrast">
                        Calculated from four weighted dimensions using the selected organisational model.
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm cl-text-neutral-text-medium-contrast">
                        <li className="flex justify-between gap-4"><span>Clarity</span><span className="font-semibold cl-text-neutral-text-high-contrast">78</span></li>
                        <li className="flex justify-between gap-4"><span>Workload</span><span className="font-semibold cl-text-neutral-text-high-contrast">61</span></li>
                        <li className="flex justify-between gap-4"><span>Recognition</span><span className="font-semibold cl-text-neutral-text-high-contrast">69</span></li>
                        <li className="flex justify-between gap-4"><span>Direction</span><span className="font-semibold cl-text-neutral-text-high-contrast">80</span></li>
                    </ul>
                    <div className="mt-3 pt-3 border-t cl-border-border-color-default flex justify-between text-sm font-bold cl-text-neutral-text-high-contrast">
                        <span>Weighted index</span><span>72</span>
                    </div>
                    <p className="mt-3 text-xs cl-text-neutral-text-low-contrast">
                        Previous period 69 · changing the model changes both the value and its band.
                    </p>
                </div>
            )}

            {/* ── Explanation layer 3: category-specific context ── */}
            {openPanel === 'segment' && (
                <div className={panelBase}>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span aria-hidden="true" style={{ backgroundColor: tokenColor(segment.token) }} className="w-2 h-2 rounded-full" />
                        <span className="text-sm font-bold cl-text-neutral-text-high-contrast">{segment.name}</span>
                        <span style={{ backgroundColor: tokenBg(segment.token), color: tokenText(segment.token) }} className="rounded-full px-2 py-0.5 text-[10px] font-bold">
                            {segment.band}
                        </span>
                    </div>
                    <p style={{ color: tokenText(segment.token) }} className="mt-2 text-2xl font-bold leading-none">{segment.pct}%</p>
                    <p className="text-xs cl-text-neutral-text-low-contrast mt-1">of responses in this band</p>
                    <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">{segment.meaning}</p>
                    <p style={{ color: tokenText(segment.token) }} className="mt-2 text-sm font-semibold">→ {segment.action}</p>
                </div>
            )}

            {/* Explore action — always visible, never hover-revealed */}
            {!compact && (
                <p className="mt-4 text-sm font-semibold cl-text-brand-primary-base">Explore →</p>
            )}
        </div>
    );
}

/** Caption required on every reconstructed visual. */
export function PrototypeLabel() {
    return (
        <p className="mt-4 text-[11px] uppercase tracking-widest cl-text-neutral-text-low-contrast">
            Concept prototype using illustrative data
        </p>
    );
}
