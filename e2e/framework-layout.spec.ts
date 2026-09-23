import { test, expect } from '@playwright/test';
import { isDesktop, viewports } from './fixtures/viewports';
import {
  assertNoHorizontalPageOverflow,
  settlePage,
} from './helpers/layout';

for (const vp of viewports) {
  test.describe(`framework layout @ ${vp.id} (${vp.width}×${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`layout — ${vp.label}`, async ({ page }) => {
      await page.goto('/framework.html');
      await settlePage(page);

      const heading = page.getByRole('heading', { name: 'The Framework', exact: true });
      await expect(heading).toBeVisible();
      // No “Contents” eyebrow (aria-label may still say “Framework contents”)
      await expect(page.locator('#framework-contents .eyebrow')).toHaveCount(0);
      await expect(page.getByText('Contents', { exact: true })).toHaveCount(0);

      const pullquote = page.locator('.fw-pullquote p').first();
      await expect(pullquote).toBeVisible();
      const align = await pullquote.evaluate((el) => getComputedStyle(el).textAlign);
      expect(['left', 'start'].includes(align), `text-align was ${align}`).toBe(true);

      await expect(page.locator('.fw-subsection-heading').first()).toBeVisible();
      await assertNoHorizontalPageOverflow(page);

      if (isDesktop(vp.width)) {
        await expect(page.locator('nav[aria-label="Primary"]')).toBeVisible();
        await expect(page.locator('#menuToggle')).toBeHidden();
      } else {
        await expect(page.locator('#menuToggle')).toBeVisible();
        await expect(page.locator('nav[aria-label="Primary"]')).toBeHidden();
      }
    });
  });
}
