import { createHash } from 'node:crypto';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');

/**
 * Where page sources live. Checked in order, so this keeps working as the
 * migration moves files:
 *   Phase 0-1  src/*.html
 *   Phase 1+   src-legacy/*.html  (originals parked during the migration)
 *   Phase 2+   src/pages/*.astro  (the real pages)
 */
const SOURCES = [
  { dir: join(repo, 'src', 'pages'), ext: '.astro' },
  { dir: join(repo, 'src'), ext: '.html' },
  { dir: join(repo, 'src-legacy'), ext: '.html' },
];

/** Never screenshot these. */
const SKIP = new Set([
  'sitemap',   // 833 KB of Domino-generated output, not a maintained page
  '_index',    // superseded draft of index
]);

/**
 * Regions that change on their own and would make every diff red.
 * Playwright paints these over before comparing, so layout around them is
 * still checked -- only the contents are ignored.
 */
const GLOBAL_MASKS = [
  '.cc-window',              // cookieconsent banner, if it slips past the cookie
  '#jumbotron-slider',
  '#eshop-slider',
  '#partners-slider',
  '#portfolio-slider',
  '#testimonials-slider',
  '#about-us-slider',
  '.catalogCategoriesSlider',
  // Catch-alls, so a slider on a page nobody thought about does not turn the
  // whole diff red. tiny-slider wraps in .tns-outer, Owl in .owl-carousel.
  '.tns-outer',
  '.owl-carousel',
  // <video> posters and first frames decode at different times.
  'video',
  // The whole footer, deliberately.
  //
  // It is injected into 44 pages by jQuery from _bottom-min.html, and the site
  // serves two different versions of that fragment: one renders the address as
  // "Santa Clara, CA95050, US" (the &nbsp; in the maintained _bottom.html was
  // lost in the minified copy), the other keeps the space. Load any page six
  // times and you get each about half the time; at 375px they wrap to
  // different heights and shift everything below them.
  //
  // No mask smaller than this contains it, because the height change
  // propagates down the column. The footer is untestable by construction until
  // it is rendered server-side.
  //
  // REMOVE THIS in Phase 2, once Base.astro renders the footer from a single
  // source. That is the point the footer becomes worth regression-testing --
  // and unmasking it is how you prove the fix landed.
  'footer',
];

const PAGE_MASKS = {
  visitRI: [
    '.tomorrow',        // tomorrow.io weather widget
    '.hotels-slider',   // autoplaying strip of hotel logos
  ],
  checkout: ['iframe[name^="__privateStripe"]'],
  news: ['.news-date-relative'],
};

/** Pages discovered from the working tree, sorted, without the extension. */
export function discoverPages() {
  for (const { dir, ext } of SOURCES) {
    if (!existsSync(dir)) continue;
    const names = readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .map((f) => f.slice(0, -ext.length))
      .filter((n) => !n.startsWith('_'))
      .filter((n) => !SKIP.has(n))
      .sort();
    if (names.length) return { names, from: dir };
  }
  throw new Error('No page sources found. Looked in:\n  ' + SOURCES.map((s) => s.dir).join('\n  '));
}

/** URL path for a page name. Kept in one place because Phase 3 must not change it. */
export function pathFor(name) {
  return `/${name}.html`;
}

export function masksFor(name) {
  return [...GLOBAL_MASKS, ...(PAGE_MASKS[name] ?? [])];
}

/**
 * Pages the probe confirmed are actually served. Falls back to every
 * discovered page when the probe has not run yet.
 */
export function livePages() {
  const f = join(here, 'pages.live.json');
  if (!existsSync(f)) return discoverPages().names;
  return JSON.parse(readFileSync(f, 'utf8')).ok;
}

/**
 * Fingerprint of everything that changes what a screenshot looks like without
 * changing the site. Adding a mask makes every existing baseline wrong, and a
 * mask-vs-no-mask diff looks like a catastrophic layout break -- so the
 * baseline records this and a comparison refuses to run against a stale one.
 */
export function masksFingerprint() {
  const payload = JSON.stringify({ GLOBAL_MASKS, PAGE_MASKS, SKIP: [...SKIP].sort() });
  return createHash('sha1').update(payload).digest('hex').slice(0, 12);
}
