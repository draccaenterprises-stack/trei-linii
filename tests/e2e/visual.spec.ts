import { expect, test } from "@playwright/test";

const visualRoutes = [
  { path: "/", name: "homepage" },
  { path: "/shop", name: "shop" },
  { path: "/manifest", name: "manifest" },
] as const;

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem(
      "trei-linii-cookie-consent-v1",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        version: 1,
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    );
  });
});

for (const route of visualRoutes) {
  test(`vizual ${route.name}`, async ({ page }) => {
    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toBeVisible();
    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
    });
  });
}
