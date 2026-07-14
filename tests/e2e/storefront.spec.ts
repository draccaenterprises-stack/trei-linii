import { expect, test } from "@playwright/test";

async function waitForHydration(page: import("@playwright/test").Page) {
  await page.locator("html.motion-ready").waitFor({ state: "attached" });
}

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
  });
});

test("homepage-ul și shop-ul se încarcă fără erori sau overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  const homeResponse = await page.goto("/");
  expect(homeResponse?.ok()).toBe(true);
  await waitForHydration(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);

  const shopResponse = await page.goto("/shop");
  expect(shopResponse?.ok()).toBe(true);
  await waitForHydration(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Colecții în capitole");
  await expect(page.getByRole("navigation", { name: "Alege colecția" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Vezi produs/ }).first()).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("meniul mobil este operabil cu tastatura", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Meniul compact este verificat pe mobil.");
  await page.goto("/");
  await waitForHydration(page);
  const trigger = page.getByRole("button", { name: "Deschide meniul" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Navigație" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigație" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("animația Vezi produs pornește din centrul butonului pe mobil", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Verificare dedicată animației mobile.");
  await page.goto("/shop");
  await waitForHydration(page);
  const button = page.getByRole("button", { name: /Vezi produs/ }).first();
  await button.scrollIntoViewIfNeeded();
  const buttonBox = await button.boundingBox();
  expect(buttonBox).not.toBeNull();
  await button.click();

  const root = page.locator("[data-quick-view-root]");
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-quick-view-phase", /preparing|opening/);

  const spineBox = await page.locator(".quick-view-spine").boundingBox();
  expect(spineBox).not.toBeNull();
  expect(
    Math.abs((spineBox?.x ?? 0) - ((buttonBox?.x ?? 0) + (buttonBox?.width ?? 0) / 2 - 1)),
  ).toBeLessThan(3);

  await page.waitForTimeout(180);
  const cloneScale = await page.locator(".quick-view-clone").evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return matrix.a;
  });
  expect(cloneScale).toBeLessThan(0.95);

  const bandOrigins = await page
    .locator(".quick-view-band")
    .evaluateAll((bands) =>
      bands.map((band) => Number.parseFloat(getComputedStyle(band).transformOrigin)),
    );
  const buttonCenter = (buttonBox?.x ?? 0) + (buttonBox?.width ?? 0) / 2;
  expect(bandOrigins.every((origin) => Math.abs(origin - buttonCenter) < 3)).toBe(true);

  await expect(root).toHaveAttribute("data-quick-view-phase", "open", { timeout: 2_500 });
  await expect(page.getByRole("button", { name: "Închide galeria" })).toBeFocused();
  await expect(
    page.locator("[data-quick-view-gallery]").getByText("Piesă în pregătire", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".quick-view-bands")).toBeHidden();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
});

test("galeria rapidă se închide cu Escape și restabilește focusul", async ({ page }) => {
  await page.goto("/shop");
  await waitForHydration(page);
  const button = page.getByRole("button", { name: /Vezi produs/ }).first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(page.locator("[data-quick-view-root]")).toHaveAttribute(
    "data-quick-view-phase",
    "open",
    { timeout: 2_500 },
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-quick-view-root]")).toBeHidden();
  await expect(button).toBeFocused();
});

test("rutele vechi redirecționează spre paginile canonice", async ({ request, baseURL }) => {
  const redirects = [
    ["/terms", "/termeni-si-conditii"],
    ["/privacy", "/confidentialitate"],
    ["/collections", "/shop"],
  ] as const;

  for (const [legacyPath, canonicalPath] of redirects) {
    const response = await request.get(legacyPath, { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(response.status());
    const location = response.headers().location;
    expect(location).toBeTruthy();
    expect(new URL(location ?? "", baseURL).pathname).toBe(canonicalPath);
  }
});

test("o rută necunoscută răspunde cu 404 real", async ({ page }) => {
  const response = await page.goto("/ruta-care-nu-exista");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Pagina nu a fost găsită");
});

test("@links linkurile interne principale răspund", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute("href") ?? "")),
    ]);

  for (const href of hrefs.filter((value) => value && !value.includes("#"))) {
    const response = await request.get(href, { maxRedirects: 5 });
    expect(response.status(), `${href} trebuie să răspundă fără eroare`).toBeLessThan(400);
  }
});
