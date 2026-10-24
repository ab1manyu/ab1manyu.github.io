import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/gallery", "/kai", "/pokedex", "/darts"];

for (const route of ROUTES) {
  test(`route ${route} renders without console errors`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("unknown route shows not found", async ({ page }) => {
  await page.goto("/this-does-not-exist");
  await expect(page.getByText("NOT FOUND")).toBeVisible();
});
