/**
 * AI Product Development Handbook — publication manifest.
 *
 * Chapter titles are CANONICAL and taken directly from the source project's
 * `00-master/01 — Learning Architecture.md` roadmap table. They are not
 * rewritten for the web, and the 07 <-> 09 resequence recorded in that file
 * (Workflows & Agents moved to 07, Retrieval & RAG to 09) is preserved.
 *
 * Chapter 03 exists as two files in the source project (Part A and Part B).
 * The roadmap defines ONE chapter, so the two parts are joined into a single
 * chapter here rather than invented as chapters 03 and 04.
 *
 * `question` is the chapter's learning question or core experiment, kept to
 * one line. Implementation statistics deliberately do not appear on cards.
 */

export type Chapter = {
  number: number;
  slug: string;
  title: string;
  question: string;
};

export const HANDBOOK = {
  slug: 'ai-product-development',
  title: 'AI Product Development Handbook',
  label: 'Personal learning handbook',
  status: 'Complete with open evidence gaps',
  summary:
    'A hands-on learning project exploring how AI products are built around models: '
    + 'context, evaluation, agents, tools, retrieval, permissions, security, '
    + 'observability and deployment.',
} as const;

export const CHAPTERS: Chapter[] = [
  { number: 1, slug: 'how-modern-software-products-work',
    title: 'How Modern Software Products Work',
    question: 'Read a real request end to end.' },
  { number: 2, slug: 'working-like-a-modern-product-builder',
    title: 'Working Like a Modern Product Builder',
    question: 'Branch, commit, PR, revert — and find out what a revert does not undo.' },
  { number: 3, slug: 'testing-and-evaluation-foundations',
    title: 'Testing & Evaluation Foundations',
    question: 'Grade a fixed set of outputs by hand, then automate one check.' },
  { number: 4, slug: 'building-with-model-apis',
    title: 'Building with Model APIs',
    question: 'Make the first real model call, and handle the ways it fails.' },
  { number: 5, slug: 'prompting-as-application-behaviour',
    title: 'Prompting as Application Behaviour',
    question: 'Treat a prompt as versioned behaviour with a regression set.' },
  { number: 6, slug: 'context-and-memory',
    title: 'Context & Memory',
    question: 'What may the model see, and what must it never see?' },
  { number: 7, slug: 'workflows-agents-and-autonomy',
    title: 'Workflows, Agents & Autonomy',
    question: 'Routing, gating, interruption, compensation and residual state.' },
  { number: 8, slug: 'tool-use',
    title: 'Tool Use',
    question: 'A tool schema, argument validation, and what a timeout really means.' },
  { number: 9, slug: 'retrieval-and-rag',
    title: 'Retrieval and RAG',
    question: 'Multi-tenant retrieval with citations — and when to say nothing.' },
  { number: 10, slug: 'mcp-and-external-systems',
    title: 'MCP & External Systems',
    question: 'A protocol connection is not a trust relationship.' },
  { number: 11, slug: 'identity-authentication-authorization-rbac',
    title: 'Identity, Authentication, Authorization, RBAC',
    question: 'Who are you, what may you reach, and on which rows?' },
  { number: 12, slug: 'secure-ai-product-development',
    title: 'Secure AI Product Development',
    question: 'Build a threat model, then attack your own controls.' },
  { number: 13, slug: 'advanced-evaluation-engineering',
    title: 'Advanced Evaluation Engineering',
    question: 'What does a number actually support — and what is its denominator?' },
  { number: 14, slug: 'observability-and-production-behaviour',
    title: 'Observability & Production Behaviour',
    question: 'Trace a failing request, and find out why it failed.' },
  { number: 15, slug: 'deployment',
    title: 'Deployment',
    question: 'Deploy, roll back, and determine what actually reversed.' },
  { number: 16, slug: 'complete-ai-product-capstone',
    title: 'Complete AI Product Capstone',
    question: 'Do the pieces still form one product when they all operate together?' },
];

export const chapterBySlug = (slug: string) =>
  CHAPTERS.find((c) => c.slug === slug);

export const chapterNeighbours = (slug: string) => {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return {
    previous: i > 0 ? CHAPTERS[i - 1] : null,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null,
  };
};

/**
 * Raw markdown, loaded lazily so a chapter's text is fetched only when that
 * chapter is opened. Eager loading would put ~700 KB of prose into the main
 * bundle for visitors who never open the handbook.
 */
const files = import.meta.glob('./*.md', { query: '?raw', import: 'default' });

export async function loadChapter(number: number, slug: string): Promise<string | null> {
  const key = `./${String(number).padStart(2, '0')}-${slug}.md`;
  const loader = files[key];
  if (!loader) return null;
  return (await loader()) as string;
}
