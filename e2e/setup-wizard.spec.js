// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Setup wizard → dashboard (fresh user)", () => {
  test.beforeEach(async ({ context }) => {
    // Ensure clean localStorage — fresh user has no saved data
    await context.clearCookies();
  });

  test("completes the setup wizard and lands on the budget dashboard", async ({
    page,
  }) => {
    // Navigate to root — should redirect through /<Month>-<Year> to /settings
    await page.goto("/");

    // Step 1: Salary — the wizard should render
    await expect(
      page.getByRole("heading", { name: "Set Your Starting Monthly Income" })
    ).toBeVisible();

    // Clear the default salary and enter £3,500
    const salaryInput = page.locator(".wizard-salary-input");
    await salaryInput.fill("3500");

    // Click "Next" to go to step 2 (Budget Categories)
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2: Categories — accept defaults
    await expect(
      page.getByRole("heading", { name: "Customize Budget Categories" })
    ).toBeVisible();

    // Click "Next" to go to step 3 (Debt question)
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3: Debt question — skip debts
    await expect(
      page.getByRole("heading", { name: "Do You Have Any Debt?" })
    ).toBeVisible();
    await page.getByRole("button", { name: "No, skip this step" }).click();

    // Confirm step — verify the summary shows £3,500.00
    await expect(
      page.getByRole("heading", { name: "Confirm Your Budget Setup" })
    ).toBeVisible();
    await expect(page.locator(".summary-value").first()).toHaveText("£3500.00");

    // Click "Save & Start Budgeting"
    await page.getByRole("button", { name: "Save & Start Budgeting" }).click();

    // Should redirect to the budget dashboard (URL matches /<Month>-<Year>)
    await expect(page).toHaveURL(/\/[A-Z][a-z]+-\d{4}$/);

    // Verify the Hero shows TOTAL INCOME with £3,500.00
    await expect(page.locator(".hero-total-amount")).toContainText("3500.00");
  });
});
