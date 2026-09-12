/**
 * The shared visual vocabulary for public case studies.
 *
 * WHY THIS EXISTS.
 *
 * The compressed cases were shorter but still read as documents: heading,
 * hundred-word paragraph, heading, hundred-word paragraph. A reader scanning
 * for whether the work is relevant got nothing to hold onto between headings.
 *
 * These primitives make the other shape cheap to build — a visual, one strong
 * statement, and two to four short points — so prose supports the structure
 * instead of carrying the story alone. Both case studies use the same set, so
 * they read as one portfolio rather than two designs.
 *
 * RULES THESE ENCODE.
 *
 * Meaning is never carried by colour alone: every toned element also has a
 * text label or a heading, and the diagrams read in order for a screen reader
 * because they are built from real text nodes rather than drawn.
 *
 * Tone is used sparingly and semantically — problem, insight, suggestion —
 * never decoratively. The brand accent marks the one element that matters most
 * in a beat, not everything that could be emphasised.
 */

export type Tone = 'neutral' | 'problem' | 'insight' | 'suggestion';

const TONE_VAR: Record<Exclude<Tone, 'neutral'>, string> = {
    problem: '--cl-color-semantic-error-border',
    insight: '--cl-color-semantic-info-border',
    suggestion: '--cl-color-semantic-success-border',
};

function toneBorder(tone: Tone): React.CSSProperties | undefined {
    if (tone === 'neutral') return undefined;
    return { borderColor: `var(${TONE_VAR[tone]})` };
}

const MICRO = 'text-[11px] font-bold uppercase tracking-[0.18em]';

/* ------------------------------------------------------------------ *
 * Metadata — who, where, what role. Scannable before any prose.
 * ------------------------------------------------------------------ */

export function CaseMeta({ items }: { items: [string, string][] }) {
    return (
        <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-3 border-y cl-border-border-color-default py-6">
            {items.map(([term, value]) => (
                <div key={term}>
                    <dt className={`${MICRO} cl-text-neutral-text-low-contrast mb-1.5`}>{term}</dt>
                    <dd className="text-[15px] font-semibold cl-text-neutral-text-high-contrast leading-snug">
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

/* ------------------------------------------------------------------ *
 * Statement — the one line a beat exists to land.
 * ------------------------------------------------------------------ */

export function Statement({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
    return (
        <p
            style={toneBorder(tone) ?? { borderColor: 'var(--cl-color-brand-primary-base)' }}
            className="border-l-2 pl-6 text-xl md:text-2xl font-medium cl-text-neutral-text-high-contrast leading-[1.5] max-w-[44ch]"
        >
            {children}
        </p>
    );
}

/* ------------------------------------------------------------------ *
 * Points — two to four short supporting lines. Never a paragraph.
 * ------------------------------------------------------------------ */

export function Points({
    items,
    columns = 1,
    ordered = false,
}: {
    items: React.ReactNode[];
    columns?: 1 | 2;
    /** Numbers instead of bullets, for a sequence where the order is the point. */
    ordered?: boolean;
}) {
    const List = ordered ? 'ol' : 'ul';
    return (
        <List className={`mt-7 grid gap-x-10 gap-y-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[16px] leading-relaxed cl-text-neutral-text-medium-contrast">
                    {ordered ? (
                        <span aria-hidden="true" className="shrink-0 font-mono text-sm font-bold cl-text-brand-primary-base pt-0.5 w-5">
                            {i + 1}
                        </span>
                    ) : (
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                    )}
                    <span>{item}</span>
                </li>
            ))}
        </List>
    );
}

/* ------------------------------------------------------------------ *
 * Panel — the standard diagram surface.
 * ------------------------------------------------------------------ */

export function Panel({
    label,
    caption,
    children,
    tone = 'neutral',
}: {
    label?: string;
    caption?: React.ReactNode;
    children: React.ReactNode;
    tone?: Tone;
}) {
    return (
        <figure
            style={toneBorder(tone)}
            className="rounded-3xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8"
        >
            {label && <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-5`}>{label}</p>}
            {children}
            {caption && (
                <figcaption className="mt-6 text-sm leading-relaxed cl-text-neutral-text-medium-contrast">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

/* ------------------------------------------------------------------ *
 * BigMetric — a number, and the questions it fails to answer.
 * ------------------------------------------------------------------ */

export function BigMetric({
    value,
    label,
    questions,
}: {
    value: string;
    label: string;
    questions: string[];
}) {
    return (
        <div className="grid md:grid-cols-[minmax(0,200px)_1fr] gap-8 md:gap-10 items-center">
            <div className="rounded-2xl border cl-border-border-color-strong cl-bg-neutral-surface-level-0 px-6 py-8 text-center">
                <div className="text-6xl md:text-7xl font-bold cl-text-neutral-text-high-contrast tabular-nums leading-none">
                    {value}
                </div>
                <div className={`${MICRO} cl-text-neutral-text-low-contrast mt-3`}>{label}</div>
            </div>
            <ul className="space-y-3">
                {questions.map((q) => (
                    <li
                        key={q}
                        style={{ borderColor: 'var(--cl-color-semantic-error-border)' }}
                        className="border-l-2 pl-4 text-lg md:text-xl cl-text-neutral-text-high-contrast leading-snug"
                    >
                        {q}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Stages — a named sequence where each step gets one line.
 * The accent marks the pivotal step; a text label says why.
 * ------------------------------------------------------------------ */

export function Stages({
    steps,
}: {
    steps: { name: string; line: string; pivot?: string }[];
}) {
    return (
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
                <li
                    key={s.name}
                    style={s.pivot ? { borderColor: 'var(--cl-color-brand-primary-base)' } : undefined}
                    className={
                        'rounded-2xl border cl-bg-neutral-surface-level-0 p-5 flex flex-col ' +
                        (s.pivot ? 'border-2' : 'cl-border-border-color-default')
                    }
                >
                    <span className="text-xs font-mono cl-text-neutral-text-low-contrast">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`mt-2 ${MICRO} ${s.pivot ? 'cl-text-brand-primary-base' : 'cl-text-neutral-text-high-contrast'}`}>
                        {s.name}
                    </span>
                    <span className="mt-2 text-[15px] leading-snug cl-text-neutral-text-medium-contrast">
                        {s.line}
                    </span>
                    {s.pivot && (
                        <span className="mt-3 text-[11px] font-semibold cl-text-brand-primary-base">
                            {s.pivot}
                        </span>
                    )}
                </li>
            ))}
        </ol>
    );
}

/* ------------------------------------------------------------------ *
 * Flow — a wrapping sequence, with weak steps named as weak.
 * ------------------------------------------------------------------ */

export function Flow({
    steps,
    weakLabel = 'weak point',
}: {
    steps: { name: string; weak?: boolean }[];
    weakLabel?: string;
}) {
    return (
        <ol className="flex flex-wrap items-stretch gap-2.5">
            {steps.map((s) => (
                <li
                    key={s.name}
                    style={s.weak ? { borderColor: 'var(--cl-color-semantic-error-border)' } : undefined}
                    className={
                        'rounded-xl border cl-bg-neutral-surface-level-0 px-4 py-3 ' +
                        (s.weak ? 'border-2' : 'cl-border-border-color-default')
                    }
                >
                    <span className="block text-[15px] font-semibold cl-text-neutral-text-high-contrast">
                        {s.name}
                    </span>
                    {s.weak && (
                        <span className="block mt-1 text-[11px] font-bold uppercase tracking-wider cl-text-semantic-error-text">
                            {weakLabel}
                        </span>
                    )}
                </li>
            ))}
        </ol>
    );
}

/* ------------------------------------------------------------------ *
 * Compare — two columns, each headed and labelled.
 * ------------------------------------------------------------------ */

export function Compare({
    left,
    right,
}: {
    left: { label: string; headline: string; items?: string[]; tone?: Tone };
    right: { label: string; headline: string; items?: string[]; tone?: Tone };
}) {
    const col = (c: typeof left) => (
        <div
            style={toneBorder(c.tone ?? 'neutral')}
            className={
                'rounded-2xl border cl-bg-neutral-surface-level-0 p-6 ' +
                (c.tone && c.tone !== 'neutral' ? 'border-2' : 'cl-border-border-color-default')
            }
        >
            <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-3`}>{c.label}</p>
            <p className="text-lg md:text-xl font-semibold cl-text-neutral-text-high-contrast leading-snug">
                {c.headline}
            </p>
            {c.items && (
                <ul className="mt-4 space-y-2">
                    {c.items.map((i) => (
                        <li key={i} className="text-[15px] leading-snug cl-text-neutral-text-medium-contrast">
                            {i}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    return <div className="grid md:grid-cols-2 gap-5">{col(left)}{col(right)}</div>;
}

/* ------------------------------------------------------------------ *
 * EvidenceBlock — what the work rests on, in four lines or fewer.
 * ------------------------------------------------------------------ */

export function EvidenceBlock({
    label = 'Evidence used',
    items,
    note,
}: {
    label?: string;
    items: string[];
    note?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
            <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-5`}>{label}</p>
            <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {items.map((i) => (
                    <li key={i} className="flex gap-3 text-[16px] cl-text-neutral-text-high-contrast">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                        <span>{i}</span>
                    </li>
                ))}
            </ul>
            {note && (
                <p className="mt-6 pt-5 border-t cl-border-border-color-default text-sm leading-relaxed cl-text-neutral-text-medium-contrast">
                    {note}
                </p>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * NotProven — the limitation, as a callout rather than a list to skim past.
 * ------------------------------------------------------------------ */

export function NotProven({ headline, items }: { headline: React.ReactNode; items: string[] }) {
    return (
        <div
            style={{ borderColor: 'var(--cl-color-semantic-warning-border)' }}
            className="rounded-2xl border-2 cl-bg-neutral-surface-level-1 p-6 md:p-8"
        >
            <p className={`${MICRO} cl-text-semantic-warning-text mb-4`}>What this does not prove</p>
            <p className="text-lg md:text-xl font-semibold cl-text-neutral-text-high-contrast leading-snug max-w-[52ch]">
                {headline}
            </p>
            <ul className="mt-5 space-y-2.5">
                {items.map((i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed cl-text-neutral-text-medium-contrast">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-neutral-surface-400 mt-2.5 shrink-0" />
                        <span>{i}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Fanout — one source, several outcomes.
 *
 * Used for the two moments in a story where a single thing produced
 * divergent results: one colour that could mean three things, and one brand
 * that produced several different-looking products. The source is the anchor;
 * the outcomes are deliberately equal in weight, because the point is that
 * none of them is obviously wrong.
 * ------------------------------------------------------------------ */

export function Fanout({
    source,
    outcomes,
    tone = 'problem',
}: {
    source: { label: string; value: string };
    outcomes: { name: string; note?: string }[];
    tone?: Tone;
}) {
    return (
        <div className="grid md:grid-cols-[minmax(0,220px)_1fr] gap-8 md:gap-10 items-center">
            <div className="rounded-2xl border-2 cl-border-border-color-strong cl-bg-neutral-surface-level-0 px-6 py-7 text-center">
                <div className={`${MICRO} cl-text-neutral-text-low-contrast mb-2`}>{source.label}</div>
                <div className="text-xl md:text-2xl font-bold cl-text-neutral-text-high-contrast leading-snug">
                    {source.value}
                </div>
            </div>
            <ul className="space-y-3">
                {outcomes.map((o) => (
                    <li
                        key={o.name}
                        style={toneBorder(tone)}
                        className="border-l-2 pl-4"
                    >
                        <span className="block text-lg font-semibold cl-text-neutral-text-high-contrast leading-snug">
                            {o.name}
                        </span>
                        {o.note && (
                            <span className="block mt-0.5 text-[15px] cl-text-neutral-text-medium-contrast leading-snug">
                                {o.note}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Ladder — a chain where each step narrows the one above it.
 *
 * Vertical rather than horizontal on purpose: the steps are a descent from
 * belief to build, not a timeline, and a vertical rule makes the dependency
 * visible without an arrow graphic that a screen reader would skip.
 * ------------------------------------------------------------------ */

export function Ladder({ steps }: { steps: { name: string; line?: string }[] }) {
    return (
        <ol className="border-l-2 cl-border-border-color-strong pl-6 space-y-5">
            {steps.map((s, i) => (
                <li key={s.name} className="relative">
                    <span
                        aria-hidden="true"
                        style={
                            i === steps.length - 1
                                ? { backgroundColor: 'var(--cl-color-brand-primary-base)' }
                                : undefined
                        }
                        className={
                            'absolute -left-[1.92rem] top-2 w-3 h-3 rounded-full border-2 ' +
                            (i === steps.length - 1
                                ? 'border-transparent'
                                : 'cl-border-border-color-strong cl-bg-neutral-surface-level-0')
                        }
                    />
                    <span className="block text-lg font-bold cl-text-neutral-text-high-contrast leading-snug">
                        {s.name}
                    </span>
                    {s.line && (
                        <span className="block mt-1 text-[15px] cl-text-neutral-text-medium-contrast leading-snug">
                            {s.line}
                        </span>
                    )}
                </li>
            ))}
        </ol>
    );
}

/* ------------------------------------------------------------------ *
 * QuadMap — several things that look alike and must not be confused.
 *
 * Each cell carries what it is for and, more importantly, what must never
 * use it. The prohibition is the half that does the work: a rule without one
 * is a suggestion.
 * ------------------------------------------------------------------ */

export function QuadMap({
    items,
}: {
    items: { name: string; role: string; never?: string }[];
}) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => (
                <li
                    key={it.name}
                    className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-5"
                >
                    <p className={`${MICRO} cl-text-brand-primary-base mb-2`}>{it.name}</p>
                    <p className="text-[15px] cl-text-neutral-text-high-contrast leading-snug">{it.role}</p>
                    {it.never && (
                        <p className="mt-3 pt-3 border-t cl-border-border-color-default text-[14px] cl-text-neutral-text-medium-contrast leading-snug">
                            <span className="font-bold cl-text-neutral-text-high-contrast">Never: </span>
                            {it.never}
                        </p>
                    )}
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ *
 * DecisionLoop — a governance rule with a branch, and a way back.
 *
 * The branch is the whole point. Most system diagrams show the happy path;
 * this one exists to make the other path a legitimate, named route rather
 * than the moment somebody improvises.
 * ------------------------------------------------------------------ */

export function DecisionLoop({
    need,
    question,
    yesPath,
    noPath,
    returns,
}: {
    need: string;
    question: string;
    yesPath: { label: string; steps: string[] };
    noPath: { label: string; steps: string[] };
    returns: string;
}) {
    const branch = (
        path: { label: string; steps: string[] },
        tone: Tone,
    ) => (
        <div
            style={toneBorder(tone)}
            className="rounded-2xl border-2 cl-bg-neutral-surface-level-0 p-5"
        >
            <p className={`${MICRO} cl-text-neutral-text-high-contrast mb-3`}>{path.label}</p>
            <ol className="space-y-2">
                {path.steps.map((s) => (
                    <li key={s} className="text-[15px] cl-text-neutral-text-medium-contrast leading-snug">
                        {s}
                    </li>
                ))}
            </ol>
        </div>
    );

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-5">
                <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-1.5`}>Start</p>
                <p className="text-[15px] font-semibold cl-text-neutral-text-high-contrast">{need}</p>
            </div>

            <div
                style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                className="rounded-2xl border-2 cl-bg-neutral-surface-level-0 p-5"
            >
                <p className={`${MICRO} cl-text-brand-primary-base mb-1.5`}>The question</p>
                <p className="text-lg font-semibold cl-text-neutral-text-high-contrast leading-snug">
                    {question}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {branch(yesPath, 'suggestion')}
                {branch(noPath, 'insight')}
            </div>

            <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-5">
                <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-1.5`}>Either way</p>
                <p className="text-[15px] font-semibold cl-text-neutral-text-high-contrast">{returns}</p>
            </div>
        </div>
    );
}
