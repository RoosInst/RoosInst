# roos.com migration plan

Built from this machine's git history (branches `master`, `phase0-visual-baseline`, `esm-gulp`, `Dev`, `vo-*`) and `visual/README.md`. No earlier Claude session transcripts exist on this machine, so everything below is sourced from the repo itself.

## Where things stand (2026-11-10)

| Item | State |
|---|---|
| Legacy site | 64 hand-written pages in `src/*.html`, partials `_top/_bottom/_bottom-min/_template`, jQuery + FontAwesome JS + owl/tiny-slider carousels. Old gulp build deleted in `3b0e412`. |
| Phase 0 – visual baseline | **Done on `master`** (merge `d61637f`). Baseline recaptured from live 2026-11-10 (`7f27b60`): 54 pages × 375/768/1440, 162/162 green on a second pass against live. |
| JS rewrite | `bd55e49` ".js rewrite – ai assist (in progress)" — unfinished. |
| Not pushed | `master` (Phases 1–3, merged 2026-11-11) is ahead of `origin/master`. Push LFS objects with it. Ryan's uncommitted w768/gan recapture is in `stash@{0}` of the Dropbox checkout. |

## Phases

### Phase 0 — Baseline ✅ (except step 4)
1. ✅ git-lfs present on Windows; `* text=auto eol=lf` added, 55 CRLF files renormalized (`e8ac52d`).
2. ✅ Live compared against the August baseline: 151/162 still matched. Recaptured all; 20 shots changed (`index`, `infrastructure`, `news`, plus masked embeds on `company`, `contact`, `ritdb`, `visitRI`, `form_network`). Third-party iframes (YouTube, Google Maps, Google Forms) are now masked by `src`.
3. ✅ Merged `phase0-visual-baseline` → `master`; committed `visual/report/` and `visual/test-results/` dropped.
4. ✅ **Decided: `src/` edits are allowed, with the baseline updated in the same commit.** Serve the site on :4321 (from Phase 1: `npm run build && npx astro preview`), `npm run visual`, eyeball the diffs, then `npm run visual:update -- --grep-invert "(apps|form_network)$"`.

### Layout fixes (2026-11-10)
The baseline now reflects these fixes, which are **not yet deployed**. Until they are, live-vs-baseline shows ~80 expected diffs. After deploying, `VISUAL_LOCAL_URL=https://roos.com npm run visual` should be green; that is the deploy check.
- **ritdb videos:** "Error 153" on live. The server sends `Referrer-Policy: same-origin`, so YouTube got no Referer. Fixed with `referrerpolicy="strict-origin-when-cross-origin"` (as `company.html` has) and made responsive.
- **Horizontal scroll, sitewide:** every page was 780px wide at 768 (`.top-header` 30px padding around a fixed-width `.container`) and 1000px at 992–999 (`.page-boxed`/`footer` fixed at 1000px). Fixed in `roos-min.css` (served), `roos.css` and `roos.scss`, and in the inlined copy of `roos.css` in `index.html`.
- **Per page:** error pages' noise canvas (1560px at 1440); `infrastructure` 799px at 375 (dashed bracket hard-coded to 767px; nested `.row`); `maintenance` table; `instruments` blueprint and blindmate images (alt text fixed too); `mediaKit` button column; `fixture` nested rows; `support` `container row` combo (content was also flush-left on desktop); `company`/`visitRI` nested `.container`; `index` panel fan and slider arrows; `5g`/`6g`/`testsets` nested rows at 992.
- Verified: no page wider than the viewport at 320/375/414/768/992/1024/1200/1440.

### Known local-vs-live differences (not bugs in `src/`)
- `form_network.html` is replaced server-side by the Google Form itself; locally it's the iframe wrapper.
- `apps.html` gets a different footer fragment on live (footer under `#page-wrapper`, plus `cookieconsent.min.css`). Same root cause as the two-cached-footers problem; Phase 2 removes it.
- `roos-min.css` is now hand-maintained (gulp is gone) and had drifted from `roos.css` (e.g. `.map-overlay h1` from `ec9726c`). Edit both until Phase 2 replaces them.

### gan
`gan.html` is in development and intentionally unlinked. It's 404 on live today, so the probe skips it. Once uploaded it will be found by the next `npm run baseline`; that is fine even while it's hidden.

### Phase 1 — Astro scaffold ✅ (merged to `master` 2026-11-10)
1. ✅ `src/*.html` → `src-legacy/` (61 files incl. partials).
2. ✅ Astro 7.4.10 at repo root (`astro.config.mjs`: `build.format: 'file'` so URLs stay `/name.html`; port 4321; dev toolbar off).
3. ✅ `src/css`, `src/images`, `src/js`, `src/sitemap.xml` → `public/`, next to the existing `public/` files. Two collisions: `public/sitemap.xml` was a stale 2024 copy (494 URLs; live serves the 1723-URL `src/` one), and `public/css/roos-dark.css` differed from `src/css/` only by a trailing blank line. The `src/` copies won.
4. ✅ `src/pages/[page].html.ts` serves every `src-legacy/` file byte for byte at `/<name>.html`, partials included (jQuery fetches `_bottom-min.html` at runtime). Porting a page = adding `src/pages/<name>.astro`; the pass-through then skips that name. Delete it once `src-legacy/` is empty.
5. ✅ Exit: `npm run build` → `dist/` has 591 files = 61 pages (all byte-identical to `src-legacy/`) + 530 `public/` files. `npm run visual` against `npx astro preview` (excluding `apps`/`form_network`): **156/156 green**. Getting there surfaced two things the old `src/`-only test server hid:
   - `mediaKit`'s logos live in `public/mediakit/`, so the `ac576b4` baseline had recorded them as broken images. Re-accepted from the Astro build (logos present).
   - Five SVG references on `5g`/`6g`/`testsets` had the wrong case. roos.com and Windows ignore case; Astro's server, like most hosts, doesn't. Fixed on `master` (`5d40cde`) and merged in.
- `pages.mjs` now merges `src/*.html`, `src-legacy/*.html` and `src/pages/*.astro`, so half-ported states are fully covered.
- Root `npm run visual -- <flags>` now forwards flags (npm 12 rejected them before).
- **Deploy:** `npm run build`, then upload `dist/` (not `src-legacy/` + `public/`). Edit pages in `src-legacy/`.
- `http://localhost:4321/` 404s in dev/preview; use `/index.html`. Production web servers map `/` to `index.html` themselves.

### Phase 2 — Layout + partials server-side ✅ (merged to `master` 2026-11-11)
1. ✅ One footer source: `src/components/Footer.astro` (from the maintained `_bottom.html`). The pass-through renders it into `<div class="bottom"></div>` on the 45 Bootstrap 3 pages and fails the build on a malformed placeholder (`cassini_reference_guide` had `class=" bottom"`). `index` is Bootstrap 5 with its own inline footer; it joins when it's ported.
   - **Root cause of the two footers:** `roos.min.js` bundles a copy of `loadbottom.js` that loads `/_bottom.html` into `.bottom`, and the pages also load `loadbottom.js`, which loads `/_bottom-min.html` into the same element. The last response won. Both loaders are gone; `roos.min.js?v2` → `?v3`.
   - **`footer` mask removed.** 162/162 green on repeat runs, so the footer is deterministic now.
   - `compressHTML: false`: Astro's compression deleted the spaces in the address ("Santa Clara,CA 95050,US").
2. ✅ FontAwesome's script is gone. `src/lib/fontawesome.mjs` inlines each `<i class="fa…">` as the exact `<svg>` the script produced (FA 6.7.2 data from `node_modules`), including the carousel arrows in inline scripts and `roos.js`/`roos.min.js`. `/css/fontawesome-svg.min.css` is the CSS the script injected, linked where the script put it (first stylesheet in `<head>`). Unknown icon names fail the build.
   - **Verified:** rendered icon markup is identical to the script's on 53/55 pages. The other two are fixes: `software` (`fa-hand-o-up`, `fa-hand-pointer-o`, both FA4 names) and `article_mmwave_journal_march2020` (`fa-small` → `fa-sm`) showed FA's pulsing "?" placeholder on live.
   - The full visual run is ~25% faster without the 1.5 s icon reflow.
3. ✅ `Base.astro` (head + navbar): done in Phase 3 batch 1. `_top.html` is dead code: no page has a `.top` placeholder.
- `visual:update -- --update-snapshots=all` now works. `run.mjs` used to append a bare `--update-snapshots`, which silently reset it to "changed only", so sub-tolerance changes (like the address spacing) were never recorded.
- Still served for HTML that browsers cached before the switch: `_bottom*.html`, `js/loadbottom.js`, `js/fontawesome.all.min.js`. Delete them a release or two later.

### Phase 3 — Page port ✅ (merged to `master` 2026-11-11)
**All 56 pages ported**; `src-legacy/` holds only the partials. The first 49 were ported in 8 commits, the last 7 in one more.
- **Shared pieces:**
  - `src/layouts/Base.astro`: head, JS notice, header, footer. Props are `title`, `description`, `canonical`, `active` (nav ids, set at build time instead of by a script), `footer` and `htmlClass`. Slots are `head-early` (before `roos-min.css`), `head` and `end` (after the footer).
  - `src/components/Header.astro`.
  - `src/layouts/ErrorPage.astro` (403/404/502/503/50x).
  - `src/middleware.ts` inlines FA icons for every page, ported or not.
- **Converter:** `node tools/port-page.mjs [--dry] [--force] <names>` writes `src/pages/<name>.astro` and `git rm`s the legacy file. It refuses anything it can't map exactly. Fix the legacy file, then rerun with `--force`.
- **Verification:** two checks per batch.
  - Strict: `VISUAL_SNAPSHOT_DIR=<dir> VISUAL_STRICT=1` with zero tolerance, comparing the new build against a Phase 2 build. Every pixel change has to be explained.
  - Baseline: the usual `npm run visual`.
  - The noise-canvas pages (error pages, landing pages) never give two identical frames, so they can only be checked by the baseline run.
- **Pixel changes, all intended (baseline re-recorded):**
  - `returns`, `products`, `services`, `turnkey`: a second `#page-wrapper` nested and left unclosed, which drew a doubled edge shadow at 1440.
  - `turnkey`: live showed the text "body>" under the footer (from a broken `</div>body>`).
  - 13 pages had an "Online Learning" header variant with a space after the top-bar icon (101 px).
  - `company`: its own header, which read "Modular ATEfor the World's…".
- **Same DOM, but Astro won't compile it:** unclosed `li`/`ul`/`span`/`div`, and stray `</style>`/`</a>`/`</i>`/`</div>`. Closed where the browser closed them.
- **Behavior changes:** `automotive_radar` moves from jQuery 3.6.0 to the site-wide 3.7.1. The second `#searchModal` on 403/404 is dropped.
- **Header (Ryan's call):** `Header.astro` took company's version: "About RI", and both search icons link to `/search.html` instead of opening the modal. The modal stays for the error pages' "Search our website" button. `index` (own BS5 header) got "About RI" too.
- **The last 7:**
  - `search`, `gan`: put on the shared header, then converted. `search` lost its own second modal, which re-ran the search API on every load and duplicated the page's `#query`/`#search_param` ids. Both gain the top bar's "Online Training" link they were missing. `gan` is still unlinked; edit `src/pages/gan.astro` now.
  - `form_network`: converter, `footer={false}`.
  - `lab_landing`, `vmhost_landing`: `Base bare` (no header/footer/#page-wrapper) + `src/components/NoiseScreen.astro`, which `ErrorPage.astro` now uses too. Their unreachable search modals are gone; `vmhost_landing` keeps having no canonical (`canonical={false}`). They get the error pages' canvas fix, so they no longer scroll by 5 px (baseline re-recorded).
  - `index`: ported verbatim (`src/pages/index.astro`), the only Bootstrap 5 page, so no layout of its own yet. Hand fixes, same DOM: `Search</i>` → `</a>`, and the nav's `div.container` closed before `</nav>`.
  - `sitemap.html`: generated crawler output, moved to `public/` unchanged. Its `grid.js` (table sorting) doesn't exist anywhere, on live either.
- **Content fix:** `testsets` breadcrumb now says "Test Sets" (was "6G Device Testing" / "6G Testing"). The `<title>` still says "6G Device Testing".
- **New pages:** write `src/pages/<name>.astro` on `Base` (see any ported page); `src-legacy/_template.html` predates the port.
- Still to do: one carousel library (tiny-slider or owl), and finish or replace the `.js` rewrite (`bd55e49`).

### Phase 4 — SEO / infra parity
1. Same URLs (`.html` paths or redirects), canonical tags, `sitemap.xml`, `robots.txt`, `403/404/50x` pages.
2. Cookie consent: three packages in `package.json` (`cookie-bar`, `cookie-consent-box`, `cookieconsent`) → keep one. Drop unused `socket.io`, `@types/del`.
3. Replace `codeql-analysis.yml`/old CI with: build + visual check on PR.

### Phase 5 — Cutover
1. Deploy to staging, run `VISUAL_LOCAL_URL=<staging> npm run visual`.
2. Switch DNS/hosting; keep the legacy build tagged (`legacy-final`) for rollback.
3. Clean up stale branches (`esm-gulp`, `Dev`, `vo-*`, ~20 dependabot branches).

## Risks
- Live-site nondeterminism (carousels, weather widget, Stripe iframe) — mask, never raise tolerance.
- Master content drifting during the port — Phase 0 step 4.
- Baseline is the only record of the old site once cut over — keep LFS objects pushed.
