/**
 * Get a page to a state where two screenshots of it would be identical.
 *
 * The legacy site finishes assembling itself well after `load`:
 *   - the footer is fetched with jQuery (`$('.bottom').load(...)`)
 *   - FontAwesome's JS replaces every <i> with an <svg>, which changes icon
 *     widths and reflows the navbar horizontally
 * Measured on roos.com, both land ~1.5s after load. Screenshot before that and
 * the footer is missing and the nav labels sit at different x-positions.
 *
 * Every wait is bounded. A page that never finishes loading a third-party
 * asset should still produce a screenshot -- if that asset matters visually,
 * the diff will say so.
 */

const withCap = (promise, ms) =>
  Promise.race([promise, new Promise((r) => setTimeout(r, ms))]);

export async function settle(page) {
  // Wait for the two late-arriving DOM rewrites before anything else, because
  // both change the height of the page the scroll walk is about to cover.
  await page
    .waitForFunction(
      () => {
        const holder = document.querySelector('.bottom');
        const footerReady = !holder || holder.children.length > 0;
        const iconsReady =
          document.querySelectorAll(
            'i.fa-solid, i.fas, i.fa-brands, i.fab, i.fa-regular, i.far'
          ).length === 0;
        return footerReady && iconsReady;
      },
      null,
      { timeout: 20_000 }
    )
    .catch(() => {});

  // Full-page screenshots do not trigger lazy loading on their own -- the
  // viewport never moves. Walk down the page, then return to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = 60;
    for (let i = 0; i < max && i * step < document.body.scrollHeight; i++) {
      window.scrollTo(0, i * step);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 120));
  });

  // Webfonts (Source Sans Pro / Quando / Michroma) reflow text when they land.
  await withCap(page.evaluate(() => document.fonts.ready), 10_000);

  // Wait out in-flight images so none render as a blank box. Images with no
  // usable src never fire either event, so they are excluded and the whole
  // wait is capped.
  await withCap(
    page.evaluate(
      () =>
        new Promise((done) => {
          const pending = Array.from(document.images).filter(
            (img) => !img.complete && img.getAttribute('src')
          );
          if (!pending.length) return done();
          let left = pending.length;
          const tick = () => { if (--left === 0) done(); };
          for (const img of pending) {
            img.addEventListener('load', tick, { once: true });
            img.addEventListener('error', tick, { once: true });
          }
          setTimeout(done, 8000);
        })
    ),
    10_000
  );

  // The sticky navbar toggles classes on scroll; make sure it settled at top.
  await page.waitForTimeout(400);
}
