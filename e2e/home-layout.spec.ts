import { test, expect } from '@playwright/test';
import { isDesktop, isWide, viewports } from './fixtures/viewports';
import {
  assertLabelFitsButton,
  assertNoHorizontalPageOverflow,
  assertNoOverlap,
  assertStackedVertically,
  assertWithinParent,
  getBox,
  settlePage,
} from './helpers/layout';

for (const vp of viewports) {
  test.describe(`homepage layout @ ${vp.id} (${vp.width}×${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`layout geometry — ${vp.label}`, async ({ page }) => {
      await page.goto('/index.html');
      await settlePage(page);
      await expect(page.locator('#the-record')).toBeVisible();

      // --- Record articles: no pairwise overlap of main children ---
      const articles = page.locator('#the-record article');
      const articleCount = await articles.count();
      expect(articleCount).toBeGreaterThanOrEqual(3);

      for (let i = 0; i < articleCount; i++) {
        const article = articles.nth(i);
        // Direct children: stat block, copy, image block (ignore empty text nodes)
        const children = article.locator(':scope > *');
        const childCount = await children.count();
        expect(childCount).toBeGreaterThanOrEqual(3);

        const main = [children.nth(0), children.nth(1), children.nth(2)];

        await assertNoOverlap(main[0], main[1]);
        await assertNoOverlap(main[0], main[2]);
        await assertNoOverlap(main[1], main[2]);

        if (isWide(vp.width)) {
          const boxes = await Promise.all(main.map((l) => getBox(l)));
          const xs = boxes.map((b) => Math.round(b.x));
          expect(
            new Set(xs).size,
            `wide Record article[${i}] children should have distinct x: ${xs.join(',')}`,
          ).toBe(3);
        } else {
          await assertStackedVertically(main);
        }
      }

      // --- Diagnosis tick patterns stay inside section ---
      const diagnosis = page.locator('#the-diagnosis');
      const ticks = page.locator('#the-diagnosis .tick-pattern');
      const tickCount = await ticks.count();
      expect(tickCount).toBeGreaterThanOrEqual(1);
      for (let i = 0; i < tickCount; i++) {
        await assertWithinParent(ticks.nth(i), diagnosis);
      }

      // --- Principles / live-tracker seam ---
      await assertNoOverlap(page.locator('#principles'), page.locator('#live-tracker'));

      // Mobile CTA is `wide:hidden`; sidebar CTA is `hidden wide:inline-flex`
      const principlesCta = page.locator('#principles a.btn-outline').filter({ visible: true });
      await expect(principlesCta).toBeVisible();
      await assertLabelFitsButton(principlesCta);

      // --- Hero + page overflow ---
      await expect(page.locator('#page-hero img').first()).toBeVisible();
      await assertNoHorizontalPageOverflow(page);

      // --- Nav band ---
      if (isDesktop(vp.width)) {
        await expect(page.locator('nav[aria-label="Primary"]')).toBeVisible();
        await expect(page.locator('nav[aria-label="Primary"] a').first()).toBeVisible();
        await expect(page.locator('#menuToggle')).toBeHidden();
      } else {
        await expect(page.locator('#menuToggle')).toBeVisible();
        await expect(page.locator('nav[aria-label="Primary"]')).toBeHidden();
      }

      // --- Decorative month rail removed ---
      await expect(page.locator('.tracker-month')).toHaveCount(0);
    });
  });
}
