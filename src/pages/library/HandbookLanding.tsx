import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { DashboardGate } from '../../components/auth/DashboardGate';
import {
  fetchLibraryIndex,
  UnauthorizedError,
  type LibraryIndex,
} from '../../content/library/handbook';

/**
 * Landing page for the private handbook.
 *
 * The framing rules for this page are load-bearing rather than decorative:
 * it is a personal learning record, its evidence limits are stated on the same
 * screen as its evidence, and none of the "NOT RUN" / "NOT MEASURED" language
 * from the source project is softened for a public audience.
 */

function HandbookLandingBody({ data }: { data: LibraryIndex }) {
  const { handbook: HANDBOOK, chapters: CHAPTERS, lessons: LESSONS, evidence: EVIDENCE, gaps: GAPS } = data;

  return (
    <div className="pb-20">
      <div className="pt-8 mb-8">
        <Breadcrumbs items={[{ label: 'Library', path: '/library' }, { label: HANDBOOK.title }]} />
      </div>

      <header className="max-w-3xl mb-16">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="cl-bg-neutral-surface-level-2 cl-text-neutral-text-medium-contrast cl-text-050 cl-weight-medium px-3 py-1 cl-radius-full uppercase tracking-wider">
            {HANDBOOK.label}
          </span>
          <span className="cl-text-050 cl-text-neutral-text-low-contrast">
            {HANDBOOK.status}
          </span>
        </div>

        <h1 className="cl-text-600 cl-weight-bold cl-text-neutral-text-high-contrast mb-6">
          {HANDBOOK.title}
        </h1>

        <p className="cl-text-300 cl-text-neutral-text-medium-contrast cl-leading-175">
          {HANDBOOK.summary}
        </p>
      </header>

      {/* Why / what / what it is not ------------------------------------- */}
      <section className="max-w-3xl mb-16 space-y-10" aria-labelledby="about-heading">
        <h2 id="about-heading" className="sr-only">About this handbook</h2>

        <div>
          <h3 className="cl-text-300 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
            Why I built it
          </h3>
          <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175">
            I wanted to understand what sits between an AI demo and a product that can be
            trusted, evaluated, operated and changed safely.
          </p>
        </div>

        <div>
          <h3 className="cl-text-300 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
            What it is
          </h3>
          <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175">
            A personal learning handbook built through research, implementation,
            experiments, failures and evaluation. Sixteen chapters, each one building a
            mechanism into a single small application and then testing what it actually
            guarantees. Failures were kept rather than tidied away.
          </p>
        </div>

        <div>
          <h3 className="cl-text-300 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
            What it is not
          </h3>
          <ul className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175 space-y-2 list-disc pl-6">
            <li>Not a commercial book, and not for sale.</li>
            <li>Not a course or a certification.</li>
            <li>Not proof that every experiment has production validation.</li>
            <li>Not a claim of AI-engineering expertise beyond the evidence presented here.</li>
          </ul>
        </div>
      </section>

      {/* Chapters --------------------------------------------------------- */}
      <section className="mb-16" aria-labelledby="chapters-heading">
        <h2 id="chapters-heading" className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mb-6">
          The learning arc
        </h2>
        <ol className="grid gap-3 md:grid-cols-2">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.slug}>
              <Link
                to={`/library/${HANDBOOK.slug}/${chapter.slug}`}
                className="group flex h-full gap-4 cl-surface-card border cl-border-border-color-subtle cl-radius-md p-5 hover:cl-border-border-color-strong transition-colors cl-focus-ring"
              >
                <span
                  className="cl-text-200 cl-weight-bold cl-text-neutral-text-low-contrast shrink-0 tabular-nums"
                  aria-hidden="true"
                >
                  {String(chapter.number).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block cl-text-200 cl-weight-semibold cl-text-neutral-text-high-contrast mb-1">
                    <span className="sr-only">Chapter {chapter.number}: </span>
                    {chapter.title}
                  </span>
                  <span className="block cl-text-100 cl-text-neutral-text-medium-contrast cl-leading-150 mb-3">
                    {chapter.question}
                  </span>
                  <span className="inline-flex items-center gap-1.5 cl-text-050 cl-weight-medium cl-text-brand-primary-base">
                    Read chapter
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* What changed how I think ----------------------------------------- */}
      <section className="max-w-3xl mb-16" aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
          What changed how I think
        </h2>
        <p className="cl-text-100 cl-text-neutral-text-low-contrast mb-6">
          Lessons from this project, in the words the chapters use. They are conclusions
          drawn from these experiments rather than general laws.
        </p>
        <ul className="space-y-3">
          {LESSONS.map((lesson) => (
            <li
              key={lesson}
              className="cl-text-200 cl-text-neutral-text-high-contrast border-l-2 cl-border-border-color-strong pl-4"
            >
              {lesson}
            </li>
          ))}
        </ul>
        <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175 mt-6">
          And the question that turned out to find more defects than any test suite:{' '}
          <strong className="cl-weight-bold cl-text-neutral-text-high-contrast">
            can this path explain itself from recorded evidence?
          </strong>
        </p>
      </section>

      {/* Final state ------------------------------------------------------ */}
      <section className="max-w-3xl mb-16" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mb-6">
          Final state
        </h2>

        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {EVIDENCE.map((item) => (
            <div
              key={item.label}
              className="cl-bg-neutral-surface-level-1 border cl-border-border-color-subtle cl-radius-md p-4"
            >
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast tabular-nums">
                  {item.value}
                </span>
                <span className="block cl-text-050 cl-text-neutral-text-medium-contrast cl-leading-150 mt-1">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default cl-radius-md p-5 md:p-6">
          <p className="cl-text-100 cl-weight-semibold cl-text-neutral-text-high-contrast mb-4">
            None of those numbers is evidence of production quality.
          </p>
          <ul className="space-y-2 cl-text-100 cl-text-neutral-text-medium-contrast">
            <li>
              <strong className="cl-weight-bold cl-text-neutral-text-high-contrast">
                Real model findings:
              </strong>{' '}
              NOT RUN
            </li>
            <li>
              <strong className="cl-weight-bold cl-text-neutral-text-high-contrast">
                Real user findings:
              </strong>{' '}
              NOT MEASURED
            </li>
            <li>
              <strong className="cl-weight-bold cl-text-neutral-text-high-contrast">
                Real production and load evidence:
              </strong>{' '}
              NOT MEASURED
            </li>
          </ul>
        </div>
      </section>

      {/* Open gaps -------------------------------------------------------- */}
      <section className="max-w-3xl" aria-labelledby="gaps-heading">
        <h2 id="gaps-heading" className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
          Open evidence gaps
        </h2>
        <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175 mb-6">
          The handbook is complete. The evidence is not. Keeping those two statements
          apart is part of what the project was for — and none of these gaps closes by
          writing more code.
        </p>
        <dl className="space-y-4">
          {GAPS.map((gap) => (
            <div
              key={gap.id}
              className="border cl-border-border-color-subtle cl-radius-md p-5"
            >
              <dt className="cl-text-100 cl-weight-bold cl-text-neutral-text-high-contrast mb-1">
                <span className="cl-text-neutral-text-low-contrast font-mono mr-2">{gap.id}</span>
                {gap.title}
              </dt>
              <dd className="cl-text-100 cl-text-neutral-text-medium-contrast cl-leading-150">
                {gap.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

/**
 * Private. Everything this page renders — the handbook's title and summary,
 * the chapter list, the lessons, the evidence counts and the open gaps — is
 * fetched from `/api/library` after the session check. None of it is compiled
 * into the public bundle.
 */
export function HandbookLanding() {
  const [data, setData] = useState<LibraryIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLibraryIndex()
      .then((d) => !cancelled && setData(d))
      .catch((e) => {
        if (cancelled) return;
        setError(
          e instanceof UnauthorizedError
            ? 'This session has expired. Sign in again to continue.'
            : 'Could not load the handbook.',
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardGate>
      {error ? (
        <p className="pt-8 cl-text-100 cl-text-neutral-text-low-contrast">{error}</p>
      ) : !data ? (
        <p className="pt-8 cl-text-100 cl-text-neutral-text-low-contrast">Loading…</p>
      ) : (
        <HandbookLandingBody data={data} />
      )}
    </DashboardGate>
  );
}
