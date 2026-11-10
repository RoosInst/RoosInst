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
2. ✅ Live compared against the August baseline: 151/162 still matched. Recaptured all; 20 shots changed (`index`, `infrastructure`, `news`, plus masked embeds on `company`, `contact`, `ritdb`, `visitRI`, `form_network`). Third-party iframes (YouTube, Google Maps, Google Forms) are now masked by `src`. `gan` returns 404 live, so it has no baseline yet — run `npm run baseline -- --grep gan` once it's deployed.
3. ✅ Merged `phase0-visual-baseline` → `master`; committed `visual/report/` and `visual/test-results/` dropped.
4. ⏳ **Ryan to decide:** freeze content edits on legacy `src/`, or require a baseline update in the same commit.

### Found during Phase 0 (live-site bugs, not fixed — `src/` is frozen pending step 4)
- **ritdb videos are broken live** ("Error 153 – Video player configuration error"). roos.com sends `Referrer-Policy: same-origin`, so YouTube gets no Referer. `company.html` works because its iframe sets `referrerpolicy="strict-origin-when-cross-origin"`; the two iframes in `ritdb.html` (lines ~325, ~376) need the same attribute.
- **infrastructure overflows horizontally at 375px**: the page renders 799px wide on a phone (both baseline and live).

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
