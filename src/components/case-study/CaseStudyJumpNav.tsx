export interface JumpTarget {
    /** Existing section id on the page (without the leading #). */
    id: string;
    label: string;
}

interface Props {
    items: JumpTarget[];
}

/**
 * Compact in-page navigation for a long case study.
 *
 * Plain anchor links so it works without JavaScript and stays keyboard
 * operable. Vertical offset for the fixed site header is handled with
 * `scroll-mt-*` on the target sections, not with JS scroll hijacking.
 */
export function CaseStudyJumpNav({ items }: Props) {
    return (
        <nav aria-label="Jump to section" className="border-y cl-border-border-color-default py-3">
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
                <li className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mr-2">
                    Jump to
                </li>
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className="inline-block rounded-md px-2.5 py-1 text-sm cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
