import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ChapterMarkdown } from '../../components/library/ChapterMarkdown';
import { DashboardGate } from '../../components/auth/DashboardGate';
import {
  fetchChapter, HANDBOOK_SLUG, UnauthorizedError, type ChapterPayload,
} from '../../content/library/handbook';

/**
 * Everything about the chapter — its title, number, neighbours and prose —
 * arrives together from `/api/library`, which checks the session first. The
 * client holds no manifest, so it cannot even name a chapter until the server
 * has authorised the request.
 *
 * The payload is stored WITH the slug it belongs to, so switching chapters
 * cannot briefly render the previous chapter's text under the new title.
 */
type Loaded =
  | { slug: string; kind: 'ready'; data: ChapterPayload }
  | { slug: string; kind: 'missing' }
  | { slug: string; kind: 'expired' };

function HandbookChapterBody() {
  const { chapterSlug = '' } = useParams();
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    // No synchronous reset here. `current` below already discards a payload
    // whose slug no longer matches the route, which is what stops the previous
    // chapter's text appearing under the new title.
    fetchChapter(chapterSlug)
      .then((data) => {
        if (!cancelled) setLoaded({ slug: chapterSlug, kind: 'ready', data });
      })
      .catch((e) => {
        if (cancelled) return;
        setLoaded({
          slug: chapterSlug,
          kind: e instanceof UnauthorizedError ? 'expired' : 'missing',
        });
      });
    return () => { cancelled = true; };
  }, [chapterSlug]);

  const current = loaded && loaded.slug === chapterSlug ? loaded : null;

  if (!current) {
    return <p className="pt-8 cl-text-100 cl-text-neutral-text-low-contrast">Loading…</p>;
  }

  if (current.kind === 'expired') {
    return (
      <p className="pt-8 cl-text-100 cl-text-neutral-text-low-contrast">
        This session has expired. Sign in again to continue.
      </p>
    );
  }

  // An unknown chapter slug is a real 404 rather than an empty reader. The
  // chapter count is no longer stated here: it is manifest data, and this
  // branch renders before any authorised payload has arrived.
  if (current.kind === 'missing') {
    return (
      <div className="max-w-3xl py-20">
        <h1 className="cl-text-500 cl-weight-bold cl-text-neutral-text-high-contrast mb-4">
          Chapter not found
        </h1>
        <p className="cl-text-200 cl-text-neutral-text-medium-contrast mb-8">
          There is no chapter at this address.
        </p>
        <Link
          to={`/library/${HANDBOOK_SLUG}`}
          className="inline-flex items-center gap-2 cl-text-100 cl-weight-medium cl-text-brand-primary-base cl-focus-ring rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All chapters
        </Link>
      </div>
    );
  }

  const { chapter, previous, next, totalChapters } = current.data;
  const HANDBOOK = current.data.handbook;
  const CHAPTERS = { length: totalChapters };

  return (
    <article className="pb-20">
      <div className="pt-8 mb-8">
        <Breadcrumbs
          items={[
            { label: 'Library', path: '/library' },
            { label: 'AI Product Development', path: `/library/${HANDBOOK.slug}` },
            { label: `Chapter ${chapter.number}` },
          ]}
        />
      </div>

      <header className="max-w-3xl mb-12">
        <p className="cl-text-075 cl-weight-medium cl-text-neutral-text-low-contrast uppercase tracking-widest mb-3">
          Chapter {String(chapter.number).padStart(2, '0')} of {CHAPTERS.length}
        </p>
        <h1 className="cl-text-600 cl-weight-bold cl-text-neutral-text-high-contrast mb-5">
          {chapter.title}
        </h1>
        <p className="cl-text-300 cl-text-neutral-text-medium-contrast cl-leading-175">
          {chapter.question}
        </p>
      </header>

      {/* Comfortable measure for long-form reading. */}
      <div className="max-w-[68ch]">
        {current.data.markdown ? (
          <ChapterMarkdown>{current.data.markdown}</ChapterMarkdown>
        ) : (
          <p className="cl-text-200 cl-text-neutral-text-low-contrast py-12" role="status">
            Loading chapter…
          </p>
        )}
      </div>

      {/* Previous / next -------------------------------------------------- */}
      <nav
        aria-label="Chapter navigation"
        className="max-w-[68ch] mt-16 pt-8 border-t cl-border-border-color-subtle grid gap-4 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            to={`/library/${HANDBOOK.slug}/${previous.slug}`}
            className="group cl-surface-card border cl-border-border-color-subtle cl-radius-md p-4 hover:cl-border-border-color-strong transition-colors cl-focus-ring"
          >
            <span className="flex items-center gap-2 cl-text-050 cl-text-neutral-text-low-contrast mb-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Previous · Chapter {previous.number}
            </span>
            <span className="block cl-text-100 cl-weight-semibold cl-text-neutral-text-high-contrast">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        {next && (
          <Link
            to={`/library/${HANDBOOK.slug}/${next.slug}`}
            className="group cl-surface-card border cl-border-border-color-subtle cl-radius-md p-4 hover:cl-border-border-color-strong transition-colors cl-focus-ring sm:text-right"
          >
            <span className="flex items-center gap-2 sm:justify-end cl-text-050 cl-text-neutral-text-low-contrast mb-1">
              Next · Chapter {next.number}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
            <span className="block cl-text-100 cl-weight-semibold cl-text-neutral-text-high-contrast">
              {next.title}
            </span>
          </Link>
        )}
      </nav>

      <div className="max-w-[68ch] mt-8">
        <Link
          to={`/library/${HANDBOOK.slug}`}
          className="inline-flex items-center gap-2 cl-text-100 cl-weight-medium cl-text-brand-primary-base cl-focus-ring rounded-sm"
        >
          <List className="w-4 h-4" aria-hidden="true" />
          All {CHAPTERS.length} chapters
        </Link>
      </div>
    </article>
  );
}

/** Private. The gate renders the sign-in surface for a signed-out visitor and
 *  keeps them on this URL, so a deep link resolves to the requested chapter as
 *  soon as the session exists. */
export function HandbookChapter() {
  return (
    <DashboardGate>
      <HandbookChapterBody />
    </DashboardGate>
  );
}
