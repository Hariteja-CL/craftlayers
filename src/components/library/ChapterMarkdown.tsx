import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Long-form markdown renderer for the Library.
 *
 * Every visual decision here routes through CraftLayers `.cl-*` tokens.
 * Tailwind is used only for layout and sizing, per the frozen Tailwind
 * configuration ("Design Authority: Craftlayers CSS").
 *
 * It deliberately does NOT use `prose`: the `@tailwindcss/typography` plugin
 * is not installed in this repository, so those classes render as nothing and
 * would leave the chapters unstyled.
 *
 * Headings start at h2 because the page supplies the single h1 (the chapter
 * title). The source markdown's own `# Title` line is therefore rendered as an
 * h2 rather than producing a second h1 and breaking heading order.
 */
export function ChapterMarkdown({ children }: { children: string }) {
  return (
    <div className="cl-text-neutral-text-medium-contrast cl-leading-175">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="cl-text-500 cl-weight-bold cl-text-neutral-text-high-contrast mt-16 mb-6 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast mt-14 mb-5 scroll-mt-28">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="cl-text-300 cl-weight-bold cl-text-neutral-text-high-contrast mt-10 mb-4 scroll-mt-28">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="cl-text-200 cl-weight-bold cl-text-neutral-text-high-contrast mt-8 mb-3">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="cl-text-200 mb-5">{children}</p>,
          ul: ({ children }) => (
            <ul className="cl-text-200 mb-5 pl-6 list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="cl-text-200 mb-5 pl-6 list-decimal space-y-2">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="cl-weight-bold cl-text-neutral-text-high-contrast">{children}</strong>
          ),
          a: ({ href, children }) => {
            const external = Boolean(href && /^https?:/.test(href));
            return (
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="cl-text-brand-primary-base underline underline-offset-2 cl-focus-ring rounded-sm"
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 cl-border-border-color-strong pl-6 my-8 cl-text-neutral-text-high-contrast">
              {children}
            </blockquote>
          ),
          // Fenced blocks scroll inside their own container so the page body
          // never scrolls horizontally on a phone.
          pre: ({ children }) => (
            <pre className="cl-bg-neutral-surface-level-2 cl-radius-md border cl-border-border-color-subtle p-4 my-6 overflow-x-auto cl-text-100 leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const isBlock = Boolean(className);
            if (isBlock) return <code className="font-mono">{children}</code>;
            return (
              <code className="cl-bg-neutral-surface-level-2 cl-radius-sm px-1.5 py-0.5 font-mono cl-text-100 cl-text-neutral-text-high-contrast">
                {children}
              </code>
            );
          },
          // Wide tables get their own scroll container for the same reason.
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto border cl-border-border-color-subtle cl-radius-md">
              <table className="w-full text-left border-collapse cl-text-100">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="cl-bg-neutral-surface-level-2 cl-text-neutral-text-high-contrast">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3 cl-weight-bold border-b cl-border-border-color-default align-top">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-b cl-border-border-color-subtle align-top">{children}</td>
          ),
          hr: () => <hr className="my-12 border-0 border-t cl-border-border-color-subtle" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
