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
 *  - Panels expand inline rather than floating beside the card, so nothing
 *    overflows a 375px screen and reading order stays intact.
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

interface Props {
    /** Which explanation layer is open. Omit for a live, interactive card. */
    forcedPanel?: CardPanel;
    /** Which segment's detail to show when forcedPanel is "segment". */
    forcedSegment?: string;
    /** Compact form used inside the dashboard composition. */
    compact?: boolean;
}

export function SyntheticMetricCard({ forcedPanel, forcedSegment, compact = false }: Props) {
    const uid = useId();
    const controlled = forcedPanel !== undefined;

    const [panel, setPanel] = useState<CardPanel>('none');
    const [segmentKey, setSegmentKey] = useState<string>(SEGMENTS[0].key);

    const openPanel = controlled ? forcedPanel : panel;
    const openSegment = controlled ? (forcedSegment ?? SEGMENTS[0].key) : segmentKey;
    const segment = SEGMENTS.find((s) => s.key === openSegment) ?? SEGMENTS[0];

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
                    Organisational Health Index
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
                    <span className="text-4xl font-bold cl-text-neutral-text-high-contrast leading-none">72</span>
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
                        72
                        <span className="sr-only">, show how this score is calculated</span>
                    </button>
                )}
                <span
                    style={{ backgroundColor: tokenBg('warning'), color: tokenText('warning') }}
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                >
                    Moderate
                </span>
            </div>

            {!compact && (
                <p className="mt-3 text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                    Overall index is steady, with a meaningful share of responses in the middle band —
                    the most movable group.
                </p>
            )}

            {/* Segmented distribution bar */}
            <div className="mt-4">
                <div className="flex h-2.5 rounded-full overflow-hidden" role="img"
                    aria-label={`Distribution: ${SEGMENTS.map(s => `${s.name} ${s.pct} percent`).join(', ')}`}>
                    {SEGMENTS.map((s) =>
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
                    {SEGMENTS.map((s) => (
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
                        {SEGMENTS.map((s) => (
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
