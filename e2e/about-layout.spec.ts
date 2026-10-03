import { test, expect } from '@playwright/test';
import { aboutViewports } from './fixtures/viewports';
import {
  assertNoHorizontalPageOverflow,
  settlePage,
} from './helpers/layout';

for (const vp of aboutViewports) {
  test.describe(`about layout smoke @ ${vp.id}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`about smoke — ${vp.label}`, async ({ page }) => {
      await page.goto('/about.html');
      await settlePage(page);

      await expect(page.getByText('Joseph Mandelbaum').first()).toBeVisible();
      await expect(page.locator('body')).not.toContainText("We're hiring");
      await expect(page.locator('body')).not.toContainText('We’re hiring');

      await assertNoHorizontalPageOverflow(page);
    });
  });
}
