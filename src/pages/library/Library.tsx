import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HANDBOOK, CHAPTERS } from '../../content/library/ai-product-development/manifest';

/**
 * The Library index.
 *
 * Deliberately small. This is a shelf for personal learning and research
 * projects, kept distinct from /work, which carries professional product
 * evidence. One entry today; the page is built to stay quiet if it only ever
 * holds a handful.
 */
export function Library() {
  return (
    <div className="pb-20">
      <header className="max-w-3xl pt-8 pb-12">
        <p className="cl-text-075 cl-weight-medium cl-text-neutral-text-low-contrast uppercase tracking-widest mb-4">
          Library
        </p>
        <h1 className="cl-text-600 cl-weight-bold cl-text-neutral-text-high-contrast mb-6">
          Learning in the open
        </h1>
        <p className="cl-text-300 cl-text-neutral-text-medium-contrast cl-leading-175">
          Long-form personal learning projects. These are records of working through
          something, including the parts that did not work — not courses, and not
          claims of expertise.
        </p>
      </header>

      <ul className="max-w-3xl space-y-6">
        <li>
          <Link
            to={`/library/${HANDBOOK.slug}`}
            className="group block cl-surface-card border cl-border-border-color-default cl-radius-lg p-6 md:p-8 hover:cl-border-border-color-strong transition-colors cl-focus-ring"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="cl-bg-neutral-surface-level-2 cl-text-neutral-text-medium-contrast cl-text-050 cl-weight-medium px-3 py-1 cl-radius-full uppercase tracking-wider">
                {HANDBOOK.label}
              </span>
              <span className="cl-text-050 cl-text-neutral-text-low-contrast">
                16 chapters
              </span>
            </div>

            <h2 className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
              {HANDBOOK.title}
            </h2>

            <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175 mb-5">
              {HANDBOOK.summary}
            </p>

            <span className="inline-flex items-center gap-2 cl-text-100 cl-weight-medium cl-text-brand-primary-base">
              Open the handbook
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>

      <p className="max-w-3xl mt-10 cl-text-100 cl-text-neutral-text-low-contrast">
        {CHAPTERS.length} chapters · status: {HANDBOOK.status.toLowerCase()}.
      </p>
    </div>
  );
}
