/**
 * Reading / listening time estimation.
 *
 * Two different rates are used on purpose, because the two experiences are
 * driven by two different sources:
 *
 *  - READ time is estimated from the *visible article prose*. Silent reading
 *    of dense, technical prose is commonly estimated at ~200–250 wpm; we use
 *    the conservative end so the number never under-promises.
 *
 *  - LISTEN time is estimated from the *curated narration transcript only*
 *    (which is deliberately shorter than the page). `SpeechSynthesisUtterance`
 *    at rate 1.0 lands around ~150 wpm for most desktop voices, so narration
 *    is slower per word but has fewer words to get through.
 *
 * Both values are computed at module load from real content — nothing here is
 * a hardcoded guess.
 */

/** Silent reading rate for technical/editorial prose. */
export const READING_WPM = 200;

/** Approximate speech-synthesis rate at playbackRate = 1.0. */
export const NARRATION_WPM = 150;

/** Count whitespace-delimited words, ignoring empty tokens. */
export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Whole minutes, floored at 1 so we never render "0 min". */
export function minutesFor(words: number, wordsPerMinute: number): number {
    return Math.max(1, Math.round(words / wordsPerMinute));
}

/** Format seconds-ish duration as "6 min". */
export function formatMinutes(minutes: number): string {
    return `${minutes} min`;
}
