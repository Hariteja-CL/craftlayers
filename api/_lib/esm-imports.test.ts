/**
 * Guards the Node ESM contract for the deployed functions.
 *
 * package.json declares `"type": "module"`, so Vercel runs everything under
 * api/ as real ESM. In ESM a relative import MUST carry a file extension —
 * Node will not try `.js`, `.ts` or `/index.js` on its own.
 *
 * Getting this wrong does not fail the build, the typecheck, or the tests.
 * It fails at module load in production, taking down every route in the file
 * with FUNCTION_INVOCATION_FAILED before the handler is ever reached. That is
 * exactly what happened on the first preview deploy of this PR, so it is
 * worth a test rather than a comment.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory() ? walk(full) : [full];
    });
}

/** Every .ts under api/, tests included — they run in Vitest, but the same
 *  spelling rule keeps them honest about what production requires. */
const sourceFiles = walk(API_DIR).filter((f) => f.endsWith('.ts'));

/** Matches a relative module specifier in a static import or re-export. */
const RELATIVE_IMPORT = /\bfrom\s+['"](\.[^'"]*)['"]/g;

/**
 * Comments are stripped first. Without this the checker flags its own prose —
 * a doc comment naming an example specifier reads identically to real code.
 */
function stripComments(src: string): string {
    return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

describe('Node ESM import hygiene under api/', () => {
    it('finds source files to check', () => {
        expect(sourceFiles.length).toBeGreaterThan(0);
    });

    it.each(sourceFiles.map((f) => [f.slice(API_DIR.length + 1), f]))(
        '%s uses extensioned relative imports',
        (_label, file) => {
            const src = stripComments(readFileSync(file, "utf8"));
            const offenders: string[] = [];

            for (const match of src.matchAll(RELATIVE_IMPORT)) {
                const spec = match[1];
                if (!spec.endsWith('.js') && !spec.endsWith('.json')) {
                    offenders.push(spec);
                }
            }

            expect(
                offenders,
                `Relative imports missing a .js extension: ${offenders.join(', ')}. ` +
                'Node ESM will throw ERR_MODULE_NOT_FOUND at load time and every ' +
                'route in this file will return FUNCTION_INVOCATION_FAILED.'
            ).toEqual([]);
        }
    );
});
