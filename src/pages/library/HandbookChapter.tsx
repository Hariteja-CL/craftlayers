import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ChapterMarkdown } from '../../components/library/ChapterMarkdown';
import {
  HANDBOOK, CHAPTERS, chapterBySlug, chapterNeighbours, loadChapter,
} from '../../content/library/ai-product-development/manifest';

/**
 * Loaded markdown is stored WITH the slug it belongs to, so switching chapters
 * cannot briefly render the previous chapter's text under the new title. The
 * effect only ever sets state from its async callback -- the unknown-slug case
 * is derived during render, because it is knowable without any I/O.
 */
type Loaded =
  | { slug: string; kind: 'ready'; markdown: string }
  | { slug: string; kind: 'missing' };

export function HandbookChapter() {
  const { chapterSlug = '' } = useParams();
  const chapter = chapterBySlug(chapterSlug);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!chapter) return;
    let cancelled = false;
    loadChapter(chapter.number, chapter.slug)
      .then((markdown) => {
        if (cancelled) return;
        setLoaded(markdown
          ? { slug: chapter.slug, kind: 'ready', markdown }
          : { slug: chapter.slug, kind: 'missing' });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ slug: chapter.slug, kind: 'missing' });
      });
    return () => { cancelled = true; };
  }, [chapter]);

  const current = loaded && chapter && loaded.slug === chapter.slug ? loaded : null;

  // An unknown chapter slug is a real 404 rather than an empty reader.
  if (!chapter || current?.kind === 'missing') {
    return (
      <div className="max-w-3xl py-20">
        <h1 className="cl-text-500 cl-weight-bold cl-text-neutral-text-high-contrast mb-4">
          Chapter not found
        </h1>
        <p className="cl-text-200 cl-text-neutral-text-medium-contrast mb-8">
          There is no chapter at this address. The handbook has {CHAPTERS.length} chapters.
        </p>
        <Link
          to={`/library/${HANDBOOK.slug}`}
          className="inline-flex items-center gap-2 cl-text-100 cl-weight-medium cl-text-brand-primary-base cl-focus-ring rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All chapters
        </Link>
      </div>
    );
  }

  const { previous, next } = chapterNeighbours(chapter.slug);

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
        {current?.kind === 'ready' ? (
          <ChapterMarkdown>{current.markdown}</ChapterMarkdown>
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
