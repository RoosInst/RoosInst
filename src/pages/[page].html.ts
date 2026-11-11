/**
 * Pass-through for src-legacy/. Since Phase 3 every page is ported, so this
 * only emits the legacy partials (see below); new pages go in
 * src/pages/<name>.astro on src/layouts/Base.astro.
 *
 * Serves src-legacy/<name>.html at /<name>.html unchanged except for two
 * things done at build time instead of in the browser:
 *   - the empty footer placeholder <div class="bottom"></div> gets the shared
 *     footer (src/components/Footer.astro) instead of a jQuery fetch;
 *   - FontAwesome <i> icons become inline <svg>; src/middleware.ts does that
 *     for every page, this one included.
 *
 * Porting a page = adding src/pages/<name>.astro; this route then stops
 * emitting that name. When src-legacy/ is empty, delete this file.
 *
 * Partials (_bottom.html, _bottom-min.html, ...) are still emitted as-is, so
 * HTML that browsers cached before the switch can still fetch them. Drop them
 * once that cache has expired.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import Footer from '../components/Footer.astro';

const root = process.cwd();
const legacyDir = join(root, 'src-legacy');
const pagesDir = join(root, 'src', 'pages');

const FOOTER_SLOT = '<div class="bottom"></div>';

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

let footerHtml: Promise<string> | undefined;
const renderFooter = () =>
  (footerHtml ??= AstroContainer.create().then((c) => c.renderToString(Footer)));

export const GET: APIRoute = async ({ params }) => {
  const name = params.page!;
  const raw = readFileSync(join(legacyDir, `${name}.html`));
  let body: string | Buffer = raw;

  if (!name.startsWith('_')) {
    const html = raw.toString('utf8');
    const slots = html.split(FOOTER_SLOT).length - 1;
    if (slots > 1) throw new Error(`${name}.html has ${slots} footer placeholders; expected at most one`);
    if (slots === 0 && /class=["']\s*bottom\s*["']/.test(html)) {
      throw new Error(`${name}.html has a .bottom element that isn't exactly ${FOOTER_SLOT}`);
    }
    body = slots === 1 ? html.replace(FOOTER_SLOT, `<div class="bottom">${await renderFooter()}</div>`) : html;
  }
  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
