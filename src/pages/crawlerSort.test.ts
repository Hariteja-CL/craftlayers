import { describe, expect, it } from 'vitest';
import {
    FAMILY_FIRST_DIRECTION,
    nextSort,
    sortFamilies,
    type FamilyColumn,
    type FamilyRow,
} from './crawlerSort';

const row = (family: string, category: FamilyRow['category'], count: number, lastSeen: number): FamilyRow => ({
    family,
    category,
    count,
    lastSeen,
});

/** Shaped after the real production data, which is what the sort has to cope
 *  with: one dominant unknown family, a long tail of ones, and ties. */
const ROWS: FamilyRow[] = [
    row('Unrecognised bot', 'unknown', 29, 1788963432607),
    row('curl', 'monitoring', 17, 1788994350792),
    row('Googlebot', 'search', 7, 1788994400699),
    row('GPTBot', 'ai', 3, 1788949819947),
    row('Applebot', 'search', 2, 1788993000000),
    row('Go-http-client', 'monitoring', 1, 1788998214640),
    row('LinkedInBot', 'social', 1, 1788949823429),
];

const names = (rows: FamilyRow[]) => rows.map((r) => r.family);

describe('sortFamilies', () => {
    it('sorts by request count, descending', () => {
        expect(names(sortFamilies(ROWS, 'count', 'desc'))).toEqual([
            'Unrecognised bot',
            'curl',
            'Googlebot',
            'GPTBot',
            'Applebot',
            'Go-http-client',
            'LinkedInBot',
        ]);
    });

    /** The tie at count 1 breaks on recency, so the order is meaningful rather
     *  than whatever order the API happened to return. */
    it('breaks count ties on recency', () => {
        const tied = sortFamilies(ROWS, 'count', 'desc').slice(-2);
        expect(names(tied)).toEqual(['Go-http-client', 'LinkedInBot']);
        expect(tied[0].lastSeen).toBeGreaterThan(tied[1].lastSeen);
    });

    it('sorts by last seen, newest first', () => {
        const sorted = sortFamilies(ROWS, 'lastSeen', 'desc');
        expect(sorted[0].family).toBe('Go-http-client');
        expect(sorted[sorted.length - 1].family).toBe('GPTBot');
        for (let i = 1; i < sorted.length; i++) {
            expect(sorted[i - 1].lastSeen).toBeGreaterThanOrEqual(sorted[i].lastSeen);
        }
    });

    it('sorts by last seen, oldest first, when reversed', () => {
        const sorted = sortFamilies(ROWS, 'lastSeen', 'asc');
        expect(sorted[0].family).toBe('GPTBot');
        expect(sorted[sorted.length - 1].family).toBe('Go-http-client');
    });

    it('sorts by family name alphabetically', () => {
        expect(names(sortFamilies(ROWS, 'family', 'asc'))).toEqual([
            'Applebot',
            'curl',
            'Go-http-client',
            'Googlebot',
            'GPTBot',
            'LinkedInBot',
            'Unrecognised bot',
        ]);
    });

    /** localeCompare, not raw code points: a byte-order sort would file every
     *  lowercase name after every uppercase one, putting curl last. */
    it('does not order names by character code', () => {
        const sorted = names(sortFamilies(ROWS, 'family', 'asc'));
        expect(sorted.indexOf('curl')).toBeLessThan(sorted.indexOf('Googlebot'));
    });

    it('sorts by the category label a reader sees, not the internal key', () => {
        const sorted = sortFamilies(ROWS, 'category', 'asc');
        // AI crawler, Monitoring, Search, Social, Unknown — alphabetical by
        // label. By raw key it would be ai, monitoring, search, social,
        // unknown, which happens to differ for "Unknown bot" vs "unknown".
        expect(sorted[0].category).toBe('ai');
        expect(sorted[sorted.length - 1].category).toBe('unknown');
    });

    it('orders same-category rows by family name', () => {
        const monitoring = sortFamilies(ROWS, 'category', 'asc').filter((r) => r.category === 'monitoring');
        expect(names(monitoring)).toEqual(['curl', 'Go-http-client']);
    });

    it('is an exact reverse when the direction flips', () => {
        for (const column of ['family', 'category', 'count', 'lastSeen'] as FamilyColumn[]) {
            const asc = names(sortFamilies(ROWS, column, 'asc'));
            const desc = names(sortFamilies(ROWS, column, 'desc'));
            expect(desc).toEqual([...asc].reverse());
        }
    });

    it('never reorders the array it was given', () => {
        const original = names(ROWS);
        sortFamilies(ROWS, 'family', 'asc');
        expect(names(ROWS)).toEqual(original);
    });

    it('handles an empty table and a single row', () => {
        expect(sortFamilies([], 'count', 'desc')).toEqual([]);
        expect(names(sortFamilies([ROWS[0]], 'count', 'desc'))).toEqual(['Unrecognised bot']);
    });
});

describe('nextSort', () => {
    it('toggles direction when the active column is clicked again', () => {
        expect(nextSort({ column: 'count', direction: 'desc' }, 'count')).toEqual({
            column: 'count',
            direction: 'asc',
        });
        expect(nextSort({ column: 'count', direction: 'asc' }, 'count')).toEqual({
            column: 'count',
            direction: 'desc',
        });
    });

    /** The bug this prevents: carrying the previous column's direction over,
     *  so clicking "Family" after "Requests" gives Z to A. */
    it('uses the new column natural direction rather than inheriting', () => {
        expect(nextSort({ column: 'count', direction: 'desc' }, 'family')).toEqual({
            column: 'family',
            direction: 'asc',
        });
        expect(nextSort({ column: 'family', direction: 'asc' }, 'lastSeen')).toEqual({
            column: 'lastSeen',
            direction: 'desc',
        });
    });

    it('gives every column a first direction', () => {
        for (const column of ['family', 'category', 'count', 'lastSeen'] as FamilyColumn[]) {
            expect(FAMILY_FIRST_DIRECTION[column]).toMatch(/^(asc|desc)$/);
        }
    });
});
