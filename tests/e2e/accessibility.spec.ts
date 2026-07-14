import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/shop",
  "/shop/lista",
  "/lookbook",
  "/manifest",
  "/about",
  "/journal",
  "/contact",
  "/faq",
  "/size-guide",
  "/livrare",
  "/retur",
  "/schimb-marime",
  "/termeni-si-conditii",
  "/confidentialitate",
  "/cookies",
  "/anpc",
  "/sol",
  "/cart",
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
        updatedAt: new Date().toISOString(),
      }),
    );
  });
});

for (const route of routes) {
  test(`@a11y ${route} nu are incalcari serious sau critice`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("#main-content")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const severe = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });
}
