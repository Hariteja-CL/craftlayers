import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Square, Volume2 } from 'lucide-react';

export interface NarrationSection {
    /** Short title shown in the player while this section is being read. */
    title: string;
    /** Plain narration text. No markup, no decorative labels. */
    body: string;
}

/**
 * Why a section changed. `start` means the listener deliberately began (Play
 * from idle, or Repeat) and a one-time scroll is acceptable; `advance` means
 * narration flowed into the next section on its own, where moving the page
 * under the reader would be hostile.
 */
export type SectionChangeReason = 'start' | 'advance' | 'stop';

interface Props {
    sections: NarrationSection[];
    /** Pre-computed listen estimate, e.g. "5 min". */
    estimatedDuration: string;
    /** Reports the narration section index, or null when nothing is active. */
    onSectionChange?: (index: number | null, reason: SectionChangeReason) => void;
}

type PlayerState = 'ready' | 'playing' | 'paused' | 'finished' | 'unavailable';

const STATE_LABEL: Record<PlayerState, string> = {
    ready: 'Ready',
    playing: 'Playing',
    paused: 'Paused',
    finished: 'Finished',
    unavailable: 'Unavailable',
};

/**
 * Compact, floating "Listen to this case study" chip.
 *
 * Sits immediately to the left of the chat launcher so the two utilities read
 * as one small toolset rather than page furniture. Deliberately minimal:
 * play/pause and repeat only.
 *
 * This is a convenience feature for any visitor — it is NOT a substitute for
 * screen-reader accessibility. The page itself remains the transcript, and
 * assistive technologies read the real document semantics.
 *
 * Uses only the browser Web Speech API (no external service), and never
 * autoplays. When speech is unsupported the chip does not render at all, so
 * the page stays fully usable.
 */
export function CaseStudyListenPlayer({ sections, estimatedDuration, onSectionChange }: Props) {
    const [supported, setSupported] = useState<boolean | null>(null);
    const [state, setState] = useState<PlayerState>('ready');
    const [sectionIndex, setSectionIndex] = useState(0);

    /** Keeps the chip clear of the chat launcher, whose width can change. */
    const [rightOffset, setRightOffset] = useState(220);

    /** Index we intend to be speaking, readable from utterance callbacks. */
    const indexRef = useRef(0);
    /**
     * Generation token. Every new speak/cancel bumps it, and each utterance
     * closes over the generation that created it. Because `cancel()` fires
     * `onend`/`onerror` *asynchronously*, a boolean flag reset synchronously
     * would already be stale by the time those callbacks run — a superseded
     * utterance could then clobber the state of the one now playing. Comparing
     * generations makes stale callbacks inert.
     */
    const genRef = useRef(0);
    /** Held in a ref so utterance callbacks never close over a stale prop. */
    const onSectionChangeRef = useRef(onSectionChange);
    useEffect(() => {
        onSectionChangeRef.current = onSectionChange;
    }, [onSectionChange]);

    // Feature detection after mount, so no flash of the wrong state.
    useEffect(() => {
        const ok =
            typeof window !== 'undefined' &&
            'speechSynthesis' in window &&
            typeof window.SpeechSynthesisUtterance !== 'undefined';
        setSupported(ok);
        if (!ok) setState('unavailable');
    }, []);

    // Track the chat launcher so the chip always sits just left of it.
    useEffect(() => {
        const launcher = document.querySelector('[data-chat-launcher]');
        if (!launcher) return;
        const update = () => {
            const width = launcher.getBoundingClientRect().width;
            // 1.5rem page gutter + launcher width + 0.75rem gap
            setRightOffset(24 + width + 12);
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(launcher);
        window.addEventListener('resize', update);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [supported]);

    // Cancel on unmount / route change away from this page.
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    /** Prefer an English voice when one exists, but never force a specific
     *  voice — voice lists differ per platform and may be empty. */
    const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
        try {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return null;
            return voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ?? null;
        } catch {
            return null;
        }
    }, []);

    /**
     * Speak one section, then chain to the next.
     * Always cancels first so repeated Play taps replace rather than stack.
     */
    const speakFrom = useCallback(
        (start: number, reason: SectionChangeReason = 'start') => {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
            if (start >= sections.length) {
                setState('finished');
                onSectionChangeRef.current?.(null, 'stop');
                return;
            }

            const generation = ++genRef.current;
            window.speechSynthesis.cancel();

            indexRef.current = start;
            setSectionIndex(start);
            onSectionChangeRef.current?.(start, reason);

            const section = sections[start];
            const utterance = new SpeechSynthesisUtterance(`${section.title}. ${section.body}`);
            utterance.lang = 'en-US';
            const voice = pickVoice();
            if (voice) utterance.voice = voice;

            utterance.onend = () => {
                if (generation !== genRef.current) return; // superseded
                const next = indexRef.current + 1;
                if (next < sections.length) {
                    // Flowed onward by itself — update the highlight, don't scroll.
                    speakFrom(next, 'advance');
                } else {
                    setState('finished');
                    onSectionChangeRef.current?.(null, 'stop');
                }
            };

            utterance.onerror = () => {
                if (generation !== genRef.current) return;
                setState('ready');
                onSectionChangeRef.current?.(null, 'stop');
            };

            window.speechSynthesis.speak(utterance);
            setState('playing');
        },
        [sections, pickVoice]
    );

    const handleToggle = useCallback(() => {
        if (!supported) return;
        if (state === 'playing') {
            window.speechSynthesis.pause();
            setState('paused');
            return;
        }
        if (state === 'paused') {
            window.speechSynthesis.resume();
            setState('playing');
            return;
        }
        speakFrom(state === 'finished' ? 0 : indexRef.current, 'start');
    }, [supported, state, speakFrom]);

    const handleRepeat = useCallback(() => {
        if (!supported) return;
        speakFrom(0, 'start');
    }, [supported, speakFrom]);

    const handleStop = useCallback(() => {
        if (!supported) return;
        genRef.current += 1; // invalidate the cancelled utterance's callbacks
        window.speechSynthesis.cancel();
        indexRef.current = 0;
        setSectionIndex(0);
        setState('ready');
        onSectionChangeRef.current?.(null, 'stop');
    }, [supported]);

    // Nothing to show until detection resolves; hidden entirely when
    // unsupported so the page is never cluttered with a dead control.
    if (supported === null || supported === false) return null;

    const isPlaying = state === 'playing';
    const isActive = state === 'playing' || state === 'paused';
    const currentTitle = sections[sectionIndex]?.title ?? '';

    const toggleLabel = isPlaying
        ? 'Pause narration'
        : state === 'paused'
            ? 'Resume narration'
            : `Listen to this case study, about ${estimatedDuration}`;

    return (
        <div
            style={{ right: rightOffset }}
            className="fixed bottom-6 z-[9998] flex items-center gap-1 rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 shadow-lg px-1.5 py-1.5"
        >
            <button
                type="button"
                onClick={handleToggle}
                aria-label={toggleLabel}
                title={toggleLabel}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
            >
                {isPlaying ? (
                    <Pause aria-hidden="true" className="w-3.5 h-3.5" />
                ) : isActive ? (
                    <Play aria-hidden="true" className="w-3.5 h-3.5" />
                ) : (
                    <Volume2 aria-hidden="true" className="w-3.5 h-3.5" />
                )}
                {/* Label collapses on very small screens; the button keeps its
                    accessible name via aria-label either way. */}
                <span className="hidden sm:inline">
                    {isPlaying ? 'Pause' : state === 'paused' ? 'Resume' : 'Listen'}
                </span>
            </button>

            {isActive || state === 'finished' ? (
                <>
                    <button
                        type="button"
                        onClick={handleRepeat}
                        aria-label="Repeat from the beginning"
                        title="Repeat from the beginning"
                        className="inline-flex items-center justify-center rounded-full w-7 h-7 cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                    >
                        <RotateCcw aria-hidden="true" className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleStop}
                        aria-label="Stop narration"
                        title="Stop narration"
                        className="inline-flex items-center justify-center rounded-full w-7 h-7 cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                    >
                        <Square aria-hidden="true" className="w-3 h-3" />
                    </button>
                </>
            ) : null}

            {/* Status is announced politely; the section name is visual bonus. */}
            <p aria-live="polite" className="sr-only">
                {STATE_LABEL[state]}
                {isActive && currentTitle ? `. Section: ${currentTitle}` : ''}
            </p>
        </div>
    );
}
