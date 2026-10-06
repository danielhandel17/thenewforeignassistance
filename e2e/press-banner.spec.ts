import { test, expect } from '@playwright/test';

test('press page leads with the three Devex sessions from the banner', async ({ page }) => {
  await page.goto('/press.html');

  const banner = page.locator('a.unga-banner');
  await expect(banner).toHaveAttribute('href', 'press.html#in-the-press');
  await expect(banner).toContainText('TNFA speaking at Devex. View More');

  const cards = page.locator('#in-the-press + .article-cards > a.article-card');
  await expect(cards.nth(0)).toHaveAttribute(
    'href',
    'https://www.devex.com/news/are-there-reasons-to-be-cheerful-about-us-development-funding-113405',
  );
  await expect(cards.nth(1)).toHaveAttribute('href', 'https://www.youtube.com/watch?v=CpfMky1Kt3g');
  await expect(cards.nth(2)).toHaveAttribute('href', 'https://www.youtube.com/watch?v=T8ohfa5Eeag');

  // BugHerd #21–#23: the three Devex sessions share one outlet label.
  for (const card of [cards.nth(0), cards.nth(1), cards.nth(2)]) {
    await expect(card.locator('.article-outlet')).toHaveText('DEVEX - SEPTEMBER 2026');
  }
});
