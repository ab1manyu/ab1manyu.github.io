import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("booted", "true");
  });
});

test.describe("Pokedex App", () => {
  test("switches between Battle and Pokédex views", async ({ page }) => {
    await page.goto("/pokedex");

    // Wait until battle screen is mounted and interactive
    await expect(page.getByPlaceholder("Who's that Pokémon?")).toBeVisible();

    // Click POKÉDEX in navbar
    const pokedexBtn = page.getByRole("button", { name: /POKÉDEX/i });
    await pokedexBtn.click();

    // Pokédex filter buttons should now be visible
    await expect(page.locator("#filter-all")).toBeVisible();
    await expect(page.locator("#filter-caught")).toBeVisible();
  });

  test("opens settings/options modal", async ({ page }) => {
    await page.goto("/pokedex");

    // Wait until battle screen is mounted and interactive
    await expect(page.getByPlaceholder("Who's that Pokémon?")).toBeVisible();

    // Click SETTINGS in navbar
    const settingsBtn = page.getByRole("button", { name: /SETTINGS/i });
    await settingsBtn.click();

    // Options modal should appear with role="dialog"
    const dialog = page.getByRole("dialog", { name: "Run Statistics" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("OPTIONS")).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
