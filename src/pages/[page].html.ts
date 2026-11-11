/**
 * Pass-through for pages that have not been ported yet.
 *
 * Serves src-legacy/<name>.html byte for byte at /<name>.html, so the built
 * site matches the legacy site exactly and `npm run visual` is green before
 * any page is ported. Porting a page = adding src/pages/<name>.astro; this
 * route then stops emitting that name. When src-legacy/ is empty, delete this
 * file.
 *
 * Partials (_bottom-min.html etc.) are emitted too: legacy pages fetch them
 * at runtime with jQuery.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const legacyDir = join(root, 'src-legacy');
const pagesDir = join(root, 'src', 'pages');

export const getStaticPaths = (() => {
  const ported = new Set(
    existsSync(pagesDir)
      ? readdirSync(pagesDir).filter((f) => f.endsWith('.astro')).map((f) => f.slice(0, -'.astro'.length))
      : [],
  );
  return readdirSync(legacyDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.slice(0, -'.html'.length))
    .filter((name) => !ported.has(name))
    .map((page) => ({ params: { page } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const body = readFileSync(join(legacyDir, `${params.page}.html`));
  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
