import { test, expect } from '@playwright/test';
import { livePages, pathFor, masksFor } from './pages.mjs';
import { settle } from './settle.mjs';

const names = livePages();

test.describe('roos.com pages', () => {
  for (const name of names) {
    test(name, async ({ page, context, baseURL }) => {
      // Suppress the cookie banner the same way a returning visitor would.
      await context.addCookies([
        { name: 'cookieconsent_status', value: 'dismiss', url: baseURL },
      ]);

      const res = await page.goto(pathFor(name), { waitUntil: 'load' });
      expect(res, `no response for ${pathFor(name)}`).not.toBeNull();
      // Error pages are served with their own status by design.
      if (!/^(40\d|50\d|50x)/.test(name)) {
        expect(res.status(), `${pathFor(name)} returned ${res.status()}`).toBe(200);
      }

      await settle(page);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        mask: masksFor(name).map((sel) => page.locator(sel)),
      });
    });
  }
});
