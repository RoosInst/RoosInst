# Visual regression harness

Phase 0 of the roos.com migration. Screenshots every page of the **live** site
and stores them as the reference the migrated site is measured against.

This is deliberately a separate npm package. It has nothing to do with the
legacy gulp build, and it should outlive both that and the Astro scaffold that
replaces it.

## Setup, once

```
npm run visual:setup
```

Installs Playwright into `visual/` and downloads the Chromium build.

## Capture the baseline

```
npm run baseline
```

Probes `https://roos.com` for which pages are actually served, then captures
every one at three widths into `visual/baseline/`. **Commit those PNGs** — once
the migrated site is deployed the live original is gone, and the baseline is
the only record of what the pages used to look like.

## Compare a build against it

```
npm run visual
```

Renders the same pages from `http://localhost:4321` (Astro's dev port; override
with `VISUAL_LOCAL_URL`) and diffs against the baseline. Failures write
`expected / actual / diff` PNGs into `visual/test-results/`.

```
npm run visual:report      # browsable HTML report of the last run
```

Useful flags pass straight through:

```
npm run visual -- --project=w375
npm run visual -- --grep products
```

## Accepting an intentional change

```
npm run visual:update -- --grep products
```

Overwrites the baseline for matching pages from the *local* build. Only use
this once a diff has been eyeballed and judged correct — it is how a real
regression gets silently blessed.

## What the numbers mean

| | |
|---|---|
| Breakpoints | 375 / 768 / 1440 — Bootstrap 3 switches at 768 and 992 |
| Tolerance | 0.2% of pixels, to absorb font antialiasing |
| Retries | 1, to absorb a flaky third-party load |

## Adding or removing pages

Nothing to edit. `pages.mjs` reads the working tree — `src/pages/*.astro` if it
exists, else `src/*.html`, else `src-legacy/*.html` — so the list follows the
migration automatically. Files starting with `_` are treated as partials.

Two lists in `pages.mjs` do need a human:

- `SKIP` — pages that should never be shot at all.
- `GLOBAL_MASKS` / `PAGE_MASKS` — regions that change on their own
  (carousels, the tomorrow.io weather widget, Stripe's iframe). Playwright
  paints over them, so surrounding layout is still compared; only the contents
  are ignored. **If a diff is red because something rotated, mask it — do not
  raise the tolerance.**

## Known-unstable regions

The legacy site does not render deterministically. Everything below was found
while getting the first baseline to a clean state, and every one of them is
handled in `pages.mjs` or `settle.mjs` rather than by loosening the tolerance.

**The site finishes assembling itself ~1.5s after `load`.** The footer is
fetched by jQuery, and FontAwesome's JS swaps every `<i>` for an `<svg>`,
which changes icon widths and reflows the navbar horizontally. `settle()`
waits for both before shooting. Without that wait, roughly a third of pages
disagree with themselves run to run.

**Capture concurrency changes the result.** Photographing 162 pages against
production with 4 workers made assets arrive late enough that baselines
disagreed with a quieter comparison run over text antialiasing. Workers are
pinned to 2 (`VISUAL_WORKERS` overrides). Raising it will reintroduce this.

**Sliders.** `visitRI` has an autoplaying `.hotels-slider`; `5g`, `6g` and
`testsets` carry several diagram carousels. `.tns-outer` and `.owl-carousel`
are masked as catch-alls.

**The footer address is genuinely broken on the live site** — see below.

## A real bug this harness found on day one

`src/_bottom.html` has the address as:

```html
<span class="region">CA</span>&nbsp;
<span class="postal-code">95050</span>,
```

The file actually served and injected into 44 pages, `_bottom-min.html`, has
lost that `&nbsp;`:

```html
<span class="region">CA</span><span class="postal-code">95050</span>,
```

So the live footer can render **"Santa Clara, CA95050, US"**. Worse, the site
serves *two different versions* of that fragment — load the same page six
times and you get each about half the time. At 375px they wrap to different
heights and shift the entire footer.

No mask smaller than the whole `<footer>` contains this, because the height
change propagates down the column -- so the footer is masked entirely, and
that is the harness's one real coverage gap today.

**Both the missing `&nbsp;` and the two-versions-in-cache problem are real
defects, not test noise.** They go away when Phase 2 renders the footer
server-side from a single source. Remove the `footer` mask then: unmasking it
is how you prove the fix landed.
