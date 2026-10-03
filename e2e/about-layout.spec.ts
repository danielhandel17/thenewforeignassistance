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

      // BugHerd #20: operating team follows Leadership and is not duplicated on the council.
      const team = page.locator('#team');
      await expect(team.getByRole('heading', { name: 'Team' })).toBeVisible();
      await expect(team.locator('.board-name', { hasText: 'Daniel Handel' })).toBeVisible();
      await expect(team.locator('.board-name', { hasText: 'David Dry' })).toBeVisible();
      await expect(team.locator('.board-name', { hasText: 'Ryan Moore' })).toBeVisible();
      await expect(team.locator('.board-role', { hasText: 'Executive Director' })).toBeVisible();
      await expect(team.locator('.board-role', { hasText: 'Chief of Staff' })).toBeVisible();
      await expect(team.locator('.board-role', { hasText: 'VP Policy Innovation' })).toBeVisible();
      const leadership = page.locator('.board-block').first();
      await expect(leadership.getByRole('heading', { name: 'Leadership' })).toBeVisible();
      await expect(leadership.getByText('Daniel Handel')).toHaveCount(0);
      await expect(page.locator('#advisory').getByText('David Dry')).toHaveCount(0);
      await expect(page.locator('#advisory').getByText('Ryan Moore')).toHaveCount(0);
      const teamBox = await team.boundingBox();
      const leadershipBox = await leadership.boundingBox();
      expect(teamBox.y).toBeGreaterThan(leadershipBox.y);

      await assertNoHorizontalPageOverflow(page);
    });
  });
}
