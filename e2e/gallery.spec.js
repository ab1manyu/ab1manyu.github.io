import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Skip bootloader animation
  await page.addInitScript(() => {
    sessionStorage.setItem("booted", "true");
  });
});

test.describe("Gallery interactions & keyboard access", () => {
  test("opens modal on card click and closes on Escape", async ({ page }) => {
    await page.goto("/gallery");

    // Click the first gallery card
    const firstCard = page.locator(".glass-panel").first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal should be visible
    const modal = page.locator("#gallery-modal");
    await expect(modal).toBeVisible();

    // Press Escape to close modal
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("closes modal when clicking the backdrop", async ({ page }) => {
    await page.goto("/gallery");

    const firstCard = page.locator(".glass-panel").first();
    await firstCard.click();

    const modal = page.locator("#gallery-modal");
    await expect(modal).toBeVisible();

    // Click backdrop
    const backdrop = modal.locator(".backdrop-blur-sm");
    await backdrop.click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });
});
