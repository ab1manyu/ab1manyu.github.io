import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("booted", "true");
  });
});

test.describe("Navigation & Link Safety", () => {
  test("brand link navigates back to home from /gallery", async ({ page }) => {
    await page.goto("/gallery");
    await page.locator('nav a:has-text("abi.")').click();
    await expect(page).toHaveURL("/");
  });

  test("external links have secure rel attributes", async ({ page }) => {
    await page.goto("/");

    // Inspect all external links
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
    }
  });

  test("keyboard tab navigation focuses interactive elements", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    // After first tab, active element should be an interactive element (button or link)
    const tagName = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON"]).toContain(tagName);
  });
});
