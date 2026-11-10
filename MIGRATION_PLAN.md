# roos.com migration plan

Built from this machine's git history (branches `master`, `phase0-visual-baseline`, `esm-gulp`, `Dev`, `vo-*`) and `visual/README.md`. No earlier Claude session transcripts exist on this machine, so everything below is sourced from the repo itself.

## Where things stand (2026-11-10)

| Item | State |
|---|---|
| Legacy site | 64 hand-written pages in `src/*.html`, partials `_top/_bottom/_bottom-min/_template`, jQuery + FontAwesome JS + owl/tiny-slider carousels. Old gulp build deleted in `3b0e412`. |
| Phase 0 – visual baseline | **Done on `master`** (merge `d61637f`). Baseline recaptured from live 2026-11-10 (`7f27b60`): 54 pages × 375/768/1440, 162/162 green on a second pass against live. |
| JS rewrite | `bd55e49` ".js rewrite – ai assist (in progress)" — unfinished. |
| Not pushed | `master` is 4 commits ahead of `origin/master` (merge, LF normalization, recapture, this plan). Push LFS objects with it. |

## Phases

### Phase 0 — Baseline ✅ (except step 4)
1. ✅ git-lfs present on Windows; `* text=auto eol=lf` added, 55 CRLF files renormalized (`e8ac52d`).
2. ✅ Live compared against the August baseline: 151/162 still matched. Recaptured all; 20 shots changed (`index`, `infrastructure`, `news`, plus masked embeds on `company`, `contact`, `ritdb`, `visitRI`, `form_network`). Third-party iframes (YouTube, Google Maps, Google Forms) are now masked by `src`.
3. ✅ Merged `phase0-visual-baseline` → `master`; committed `visual/report/` and `visual/test-results/` dropped.
4. ✅ **Decided: `src/` edits are allowed, with the baseline updated in the same commit.** Serve `src/` on :4321, `npm run visual`, eyeball the diffs, then `npm run visual:update -- --grep-invert "(apps|form_network)$"`.

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

### Phase 1 — Astro scaffold
1. Move `src/*.html` → `src-legacy/` (harness already looks there).
2. New Astro project at repo root, dev on `:4321` (harness default).
3. Copy `src/css`, `src/images`, `public/` (robots, sitemap, Cassini guide, ahrefs/indexnow keys) unchanged.
4. Exit: `npm run build` produces a site; `npm run visual` runs (failures expected).

### Phase 2 — Layout + partials server-side
1. `Base.astro` from `_top.html` / `_bottom.html`; one footer source.
2. Fixes the live `CA95050` footer bug and the two-cached-versions problem; **remove the `footer` mask** in `pages.mjs` to prove it.
3. Drop the jQuery footer fetch and FontAwesome JS → inline SVG icons (removes the ~1.5 s reflow `settle.mjs` waits for).

### Phase 3 — Page port
1. Port pages in batches, simplest first: error pages → legal/terms/privacy/shipping/returns → products/instruments/software → carousel pages (`5g`, `6g`, `testsets`, `visitRI`, `index`) → interactive (`checkout`/Stripe, `search`, `contact`, `form_network`).
2. Each batch merges only when `npm run visual` is green at all three widths. Use `visual:update` only for eyeballed, intentional diffs.
3. Finish or replace the in-progress `.js` rewrite (`bd55e49`) here; one carousel lib (tiny-slider or owl, not both).

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
