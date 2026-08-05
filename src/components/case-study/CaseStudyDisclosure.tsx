import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
    /** Visible, meaningful label describing what is inside. */
    summary: string;
    children: ReactNode;
}

/**
 * Native `<details>` disclosure for secondary supporting evidence.
 *
 * Native elements are used deliberately: they are keyboard operable and
 * announced correctly by assistive technology without any ARIA of our own.
 * Core findings are never placed inside these — only supporting detail.
 */
export function CaseStudyDisclosure({ summary, children }: Props) {
    return (
        <details className="group rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 px-6 py-4 [&[open]]:pb-6">
            <summary className="flex items-center gap-2 cursor-pointer list-none text-sm font-semibold cl-text-neutral-text-high-contrast cl-focus-ring rounded-md -mx-1 px-1 py-1">
                <ChevronRight
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 cl-text-brand-primary-base transition-transform group-open:rotate-90 motion-reduce:transition-none"
                />
                {summary}
            </summary>
            <div className="mt-5">{children}</div>
        </details>
    );
}
