import { expect, type Locator, type Page } from '@playwright/test';

export type Box = { x: number; y: number; width: number; height: number };

export function rectsOverlap(a: Box, b: Box, tolerance = 1): boolean {
  const ax2 = a.x + a.width;
  const ay2 = a.y + a.height;
  const bx2 = b.x + b.width;
  const by2 = b.y + b.height;
  return (
    a.x < bx2 - tolerance &&
    ax2 > b.x + tolerance &&
    a.y < by2 - tolerance &&
    ay2 > b.y + tolerance
  );
}

export async function getBox(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, `expected visible box for ${locator}`).toBeTruthy();
  return box as Box;
}

/** Fail if two locators' bounding boxes intersect by more than `tolerance` px. */
export async function assertNoOverlap(
  locatorA: Locator,
  locatorB: Locator,
  tolerance = 1,
): Promise<void> {
  const a = await getBox(locatorA);
  const b = await getBox(locatorB);
  expect(
    rectsOverlap(a, b, tolerance),
    `expected no overlap between boxes ${JSON.stringify(a)} and ${JSON.stringify(b)}`,
  ).toBe(false);
}

/** Each next box’s top ≥ previous bottom − tolerance. */
export async function assertStackedVertically(
  locators: Locator[],
  tolerance = 1,
): Promise<void> {
  let prevBottom = -Infinity;
  for (let i = 0; i < locators.length; i++) {
    const box = await getBox(locators[i]);
    expect(
      box.y,
      `locator[${i}] top ${box.y} should be ≥ previous bottom ${prevBottom}`,
    ).toBeGreaterThanOrEqual(prevBottom - tolerance);
    prevBottom = box.y + box.height;
  }
}

/** Child must not overflow parent horizontally (with tolerance). */
export async function assertWithinParent(
  child: Locator,
  parent: Locator,
  tolerance = 1,
): Promise<void> {
  const c = await getBox(child);
  const p = await getBox(parent);
  expect(c.x, 'child left ≥ parent left').toBeGreaterThanOrEqual(p.x - tolerance);
  expect(c.x + c.width, 'child right ≤ parent right').toBeLessThanOrEqual(
    p.x + p.width + tolerance,
  );
}

/**
 * Center-point hit test: the topmost element at the target’s center should be
 * the target itself (or a descendant), not `by` / a descendant of `by`.
 */
export async function assertNotCovered(
  page: Page,
  el: Locator,
  by: Locator,
): Promise<void> {
  const box = await getBox(el);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const elHandle = await el.elementHandle();
  const byHandle = await by.elementHandle();
  expect(elHandle).toBeTruthy();
  expect(byHandle).toBeTruthy();

  const covered = await page.evaluate(
    ({ x, y }, target, cover) => {
      const hit = document.elementFromPoint(x, y);
      if (!hit || !cover) return false;
      const hitsCover = cover === hit || (cover as Element).contains(hit);
      const hitsTarget =
        target === hit || (target as Element).contains(hit);
      return hitsCover && !hitsTarget;
    },
    { x: cx, y: cy },
    elHandle!,
    byHandle!,
  );

  expect(covered, `element center (${cx},${cy}) should not be covered by ${by}`).toBe(
    false,
  );
}

/** CTA label text should not spill outside the button box. */
export async function assertLabelFitsButton(
  button: Locator,
  tolerance = 2,
): Promise<void> {
  const btn = await getBox(button);
  const overflow = await button.evaluate((el) => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
  expect(
    overflow.scrollWidth,
    `button text overflows: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`,
  ).toBeLessThanOrEqual(overflow.clientWidth + tolerance);
  expect(btn.width).toBeGreaterThan(0);
  expect(btn.height).toBeGreaterThan(0);
}

/** Page root should not require horizontal scrolling. */
export async function assertNoHorizontalPageOverflow(
  page: Page,
  tolerance = 1,
): Promise<void> {
  const { scrollWidth, clientWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    scrollWidth,
    `horizontal overflow: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`,
  ).toBeLessThanOrEqual(Math.max(innerWidth, clientWidth) + tolerance);
}

export async function settlePage(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(150);
}
