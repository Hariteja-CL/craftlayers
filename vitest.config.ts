import { defineConfig } from 'vitest/config';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * The api/ functions run as real ESM on Vercel — package.json declares
 * `"type": "module"` — so their relative imports must carry a `.js`
 * extension. Node refuses to resolve `./_lib/session` otherwise, which
 * crashed every function at import time with ERR_MODULE_NOT_FOUND.
 *
 * Vite does not perform the TypeScript `.js` -> `.ts` substitution on its
 * own, so this plugin does it for tests only. The source keeps the spelling
 * Node requires; the test runner follows it to the real file.
 */
function resolveTsFromJsSpecifier() {
    return {
        name: 'resolve-ts-from-js-specifier',
        resolveId(source: string, importer: string | undefined) {
            if (!importer || !source.startsWith('.') || !source.endsWith('.js')) return null;
            const asTs = resolve(dirname(importer), source.slice(0, -3) + '.ts');
            return existsSync(asTs) ? asTs : null;
        },
    };
}

export default defineConfig({
    plugins: [resolveTsFromJsSpecifier()],
    test: {
        include: ['api/**/*.test.ts', 'src/**/*.test.ts'],
    },
});
