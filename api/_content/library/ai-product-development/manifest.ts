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
 * Landing-page content. Server-side for the same reason the chapters are: the
 * lessons quote the chapters, the counts describe the project's real evidence
 * base, and the gap IDs map to its open-questions register. All of it tells a
 * reader what is in the handbook, so none of it belongs in a public bundle.
 */
export type Lesson = string;
export type EvidenceStat = { value: string; label: string };
export type Gap = { id: string; title: string; detail: string };

export const LESSONS: Lesson[] = [
  'A model proposes; it does not authorize.',
  'Relevance is not trust.',
  'A protocol connection is not a trust relationship.',
  'Rollback is not undo.',
  'Instrumentation is not observability.',
  'Observability is not operability.',
  'A passing test is not product quality.',
  'A test fixture is not a source of truth.',
];

export const EVIDENCE: EvidenceStat[] = [
  { value: '789', label: 'deterministic tests' },
  { value: '272', label: 'runtime checks across 7 harnesses' },
  { value: '9', label: 'evaluation harnesses' },
  { value: '52', label: 'recorded failures' },
  { value: '75', label: 'retrieved sources' },
];

export const GAPS: Gap[] = [
  { id: 'G-18', title: 'No real model execution',
    detail: 'No model call was ever made, so every claim about AI behaviour in this handbook is unmeasured.' },
  { id: 'G-69', title: 'No real-user evidence',
    detail: 'The experiment application has never served a user, so nothing is known about a real task distribution or real usefulness.' },
  { id: 'G-80', title: 'No real deployment evidence',
    detail: 'Nothing has run under load, over time, or across more than one machine.' },
];

/**
 * Chapter markdown, read from disk inside the Function.
 *
 * This file and the .md files beside it live under `api/_content/` — outside
 * `src/`, so Vite cannot see them and cannot compile them into the public
 * bundle. That placement IS the security boundary: before it, every chapter
 * shipped as a public JS chunk and the whole handbook could be downloaded
 * without a session.
 *
 * `vercel.json` includes `api/_content/**` with the function, because Vercel's
 * file tracing cannot follow a path built at runtime.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const CONTENT_DIR = join(process.cwd(), 'api', '_content', 'library', 'ai-product-development');

export async function loadChapter(number: number, slug: string): Promise<string | null> {
  // The filename is rebuilt from the manifest entry, never from user input, so
  // a caller cannot reach outside this directory. The slug is additionally
  // checked against the manifest before this is called.
  const file = `${String(number).padStart(2, '0')}-${slug}.md`;
  try {
    return await readFile(join(CONTENT_DIR, file), 'utf8');
  } catch {
    return null;
  }
}
