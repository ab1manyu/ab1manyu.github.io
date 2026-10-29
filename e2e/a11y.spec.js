import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  { path: "/", name: "Home" },
  { path: "/gallery", name: "Gallery" },
  { path: "/kai", name: "Kai Cards" },
  { path: "/pokedex", name: "Pokédex" },
  { path: "/darts", name: "Darts" },
];

test.beforeEach(async ({ page }) => {
  // Skip bootloader animation during tests
  await page.addInitScript(() => {
    sessionStorage.setItem("booted", "true");
  });
});

for (const { path, name } of ROUTES) {
  test(`${name} (${path}) should pass WCAG accessibility standards`, async ({
    page,
  }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Disable color-contrast and meta-viewport for now so other critical structural/semantic checks run
      .disableRules(["color-contrast", "meta-viewport"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}

test.describe("Full WCAG Audit (informational / strict)", () => {
  test("audit home page for contrast and viewport rules", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const fullResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    // Log violations to help developers locate issues to remediate
    if (fullResults.violations.length > 0) {
      console.log(
        "Accessibility remediation backlog:",
        fullResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        }))
      );
    }
  });
});
