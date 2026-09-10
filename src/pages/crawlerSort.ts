/**
 * Sorting for the crawler tracker tables.
 *
 * Kept out of the page component so it can be tested. The dashboard sits
 * behind a server session, which `vite dev` cannot issue, so anything left
 * inside the component is unverifiable locally — the sort order would only
 * ever be checked by eye, on production, by someone already signed in.
 */

export type Category = 'search' | 'ai' | 'social' | 'monitoring' | 'unknown';

export const CATEGORY_LABELS: Record<Category, string> = {
    search: 'Search crawler',
    ai: 'AI crawler',
    social: 'Social / link preview',
    monitoring: 'Monitoring / tooling',
    unknown: 'Unknown bot',
};

export interface FamilyRow {
    family: string;
    category: Category;
    count: number;
    lastSeen: number;
}

export type FamilyColumn = 'family' | 'category' | 'count' | 'lastSeen';
export type SortDirection = 'asc' | 'desc';

/**
 * The direction each column takes when it is first clicked.
 *
 * A new column does not inherit the previous column's direction. "Most
 * requests" and "A to Z" are both what a person means on first click, and they
 * are opposite directions — carrying the old one over gets it backwards half
 * the time. Clicking the column that is already active toggles instead.
 */
export const FAMILY_FIRST_DIRECTION: Record<FamilyColumn, SortDirection> = {
    family: 'asc',
    category: 'asc',
    count: 'desc',
    lastSeen: 'desc',
};

function compareFamilies(a: FamilyRow, b: FamilyRow, column: FamilyColumn): number {
    switch (column) {
        case 'family':
            return a.family.localeCompare(b.family);
        case 'category':
            // Ordered by the label a reader sees, not the internal key:
            // "Unknown bot" belongs under U, not under its 'unknown' id.
            return (
                (CATEGORY_LABELS[a.category] ?? a.category).localeCompare(
                    CATEGORY_LABELS[b.category] ?? b.category,
                ) || a.family.localeCompare(b.family)
            );
        case 'count':
            // Ties break on recency, so an equal-count run keeps a meaningful
            // order rather than whatever order it arrived in.
            return a.count - b.count || a.lastSeen - b.lastSeen;
        case 'lastSeen':
            return a.lastSeen - b.lastSeen;
    }
}

/** Returns a new array; the caller's data is never reordered in place. */
export function sortFamilies(
    rows: readonly FamilyRow[],
    column: FamilyColumn,
    direction: SortDirection,
): FamilyRow[] {
    return [...rows].sort((a, b) => {
        const result = compareFamilies(a, b, column);
        return direction === 'asc' ? result : -result;
    });
}

/**
 * The next sort state when a header is clicked: toggle if it is already the
 * active column, otherwise switch and use that column's natural direction.
 */
export function nextSort(
    current: { column: FamilyColumn; direction: SortDirection },
    clicked: FamilyColumn,
): { column: FamilyColumn; direction: SortDirection } {
    if (clicked === current.column) {
        return { column: clicked, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    }
    return { column: clicked, direction: FAMILY_FIRST_DIRECTION[clicked] };
}
