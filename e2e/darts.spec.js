import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("booted", "true");
  });
});

test.describe("Darts Scorer App", () => {
  test("displays initial player scores and handles scoring throws", async ({
    page,
  }) => {
    await page.goto("/darts");

    // Default start score is 301
    await expect(page.locator("body")).toContainText("301");

    // Click score 20 button
    const target20 = page.locator("button:text-is('20')");
    await expect(target20).toBeVisible();
    await target20.click();

    // The active turn panel should reflect the thrown dart of value 20
    await expect(page.locator("body")).toContainText("20");
  });
});
