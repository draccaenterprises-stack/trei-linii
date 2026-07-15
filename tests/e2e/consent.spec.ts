import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await page.addInitScript(() => localStorage.removeItem("trei-linii-cookie-consent-v1"));
});

test("vizitatorul poate refuza și redeschide preferințele cookies", async ({ page }) => {
  await page.goto("/");
  await page.locator("html.motion-ready").waitFor({ state: "attached" });
  const banner = page.getByRole("region", { name: "Setări cookies" });
  await expect(banner).toBeVisible();
  await page.getByRole("button", { name: "Refuz opționale" }).click();
  await expect(banner).toBeHidden();

  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("trei-linii-cookie-consent-v1") ?? "null"),
  );
  expect(saved).toMatchObject({ essential: true, analytics: false, marketing: false, version: 1 });

  await page.getByRole("button", { name: "Preferințe cookies" }).click();
  await expect(banner).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Analiza trafic" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Marketing" })).not.toBeChecked();
});

test("preferințele personalizate sunt memorate separat", async ({ page }) => {
  await page.goto("/");
  await page.locator("html.motion-ready").waitFor({ state: "attached" });
  await page.getByRole("button", { name: "Personalizează" }).click();
  await page.getByRole("checkbox", { name: "Analiza trafic" }).check();
  await page.getByRole("button", { name: "Salvează" }).click();

  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("trei-linii-cookie-consent-v1") ?? "null"),
  );
  expect(saved).toMatchObject({ essential: true, analytics: true, marketing: false, version: 1 });
  expect(
    await page.locator('script[src*="googletagmanager"], script[src*="facebook"]').count(),
  ).toBe(0);
});
