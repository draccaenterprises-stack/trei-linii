import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const commerceBaseUrl = "http://localhost:4178";

test.beforeEach(async ({ page }) => {
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
    if (!sessionStorage.getItem("trei-linii-e2e-cart-reset")) {
      localStorage.removeItem("trei-linii-cart-v4");
      sessionStorage.setItem("trei-linii-e2e-cart-reset", "1");
    }
  });
});

test("journey mobil: Shop, PDP, variante, coș, refresh și checkout guard", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-390",
    "Journey-ul comercial este verificat pe mobil.",
  );

  await page.goto(commerceBaseUrl);
  await page.locator("html.motion-ready").waitFor({ state: "attached" });
  await page.getByRole("link", { name: "Shop", exact: true }).first().click();
  await expect(page).toHaveURL(`${commerceBaseUrl}/shop`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Colecții în capitole");

  await page.getByRole("link", { name: "Vezi produsul" }).first().click();
  const productHeading = page.getByRole("heading", {
    level: 1,
    name: "Tricou Oversized Linie 01",
  });
  await expect(productHeading).toBeVisible();

  const productPanel = page.locator("aside").first();
  await productPanel.getByRole("button", { name: "Culoarea Crem" }).click();
  await productPanel.getByRole("button", { name: "Mărimea S" }).click();
  await productPanel.getByRole("button", { name: /Adaugă în coș/ }).click();

  const cartDialog = page.getByRole("dialog", { name: /Coș \(1\)/ });
  await expect(cartDialog).toBeVisible();
  await cartDialog.getByRole("link", { name: "Vezi coșul complet" }).click();
  await expect(page).toHaveURL(`${commerceBaseUrl}/cart`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Produse - 1");
  await expect(
    page.getByRole("link", { name: "Tricou Oversized Linie 01", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Cont necesar. Primești pe email un cod unic, apoi continui direct la plată."),
  ).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Produse - 1");
  await expect(
    page.getByRole("link", { name: "Tricou Oversized Linie 01", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: /Crește cantitatea pentru Tricou Oversized Linie 01/ })
    .click();
  await expect(page.getByText("2", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("2", { exact: true })).toBeVisible();

  const checkout = page.getByRole("button", { name: "Plata disponibilă la lansare" });
  await expect(checkout).toBeDisabled();

  await page.getByRole("button", { name: /Elimină Tricou Oversized Linie 01 din coș/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Coșul este gol");
});

test("@a11y PDP comercial nu are încălcări serious sau critice", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "PDP-ul comercial este verificat pe mobil.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${commerceBaseUrl}/product/tricou-oversized-linie-01`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Tricou Oversized Linie 01" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const severe = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
});
