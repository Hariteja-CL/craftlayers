import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DashboardGate } from '../../components/auth/DashboardGate';
import {
  fetchLibraryIndex,
  UnauthorizedError,
  type LibraryIndex,
} from '../../content/library/handbook';

/**
 * The Library index — private.
 *
 * A shelf for personal learning and research projects, kept distinct from
 * /work, which carries professional product evidence.
 *
 * Everything below the gate is fetched: the handbook's title, summary, status
 * and chapter count all come from `/api/library` after the session check.
 * Nothing about the handbook is compiled into the public bundle, so a signed-
 * out visitor cannot learn what is in here — not even how many chapters exist.
 */
function LibraryBody() {
  const [data, setData] = useState<LibraryIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLibraryIndex()
      .then((d) => !cancelled && setData(d))
      .catch((e) => {
        if (cancelled) return;
        // The gate above handles the unauthenticated case; reaching here with
        // a 401 means the session expired mid-visit.
        setError(
          e instanceof UnauthorizedError
            ? 'This session has expired. Sign in again to continue.'
            : 'Could not load the library.',
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="cl-text-100 cl-text-neutral-text-low-contrast">{error}</p>;
  if (!data) return <p className="cl-text-100 cl-text-neutral-text-low-contrast">Loading…</p>;

  const { handbook, chapters } = data;

  return (
    <>
      <ul className="max-w-3xl space-y-6">
        <li>
          <Link
            to={`/library/${handbook.slug}`}
            className="group block cl-surface-card border cl-border-border-color-default cl-radius-lg p-6 md:p-8 hover:cl-border-border-color-strong transition-colors cl-focus-ring"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="cl-bg-neutral-surface-level-2 cl-text-neutral-text-medium-contrast cl-text-050 cl-weight-medium px-3 py-1 cl-radius-full uppercase tracking-wider">
                {handbook.label}
              </span>
              <span className="cl-text-050 cl-text-neutral-text-low-contrast">
                {chapters.length} chapters
              </span>
            </div>

            <h2 className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
              {handbook.title}
            </h2>

            <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175 mb-5">
              {handbook.summary}
            </p>

            <span className="inline-flex items-center gap-2 cl-text-100 cl-weight-medium cl-text-brand-primary-base">
              Open the handbook
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>

      <p className="max-w-3xl mt-10 cl-text-100 cl-text-neutral-text-low-contrast">
        {chapters.length} chapters · status: {handbook.status.toLowerCase()}.
      </p>
    </>
  );
}

export function Library() {
  return (
    <DashboardGate>
      <div className="pb-20">
        <header className="max-w-3xl pt-8 pb-12">
          <p className="cl-text-075 cl-weight-medium cl-text-neutral-text-low-contrast uppercase tracking-widest mb-4">
            Library · Private
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

        <LibraryBody />
      </div>
    </DashboardGate>
  );
}
