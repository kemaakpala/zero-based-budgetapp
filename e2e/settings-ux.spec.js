const { test, expect } = require("@playwright/test");

test("budget category cards are not collapsed or squished", async ({
  page,
}) => {
  await page.goto("/settings");

  // Wait for step 1 to render
  await expect(
    page.getByRole("heading", { name: "Set Your Starting Monthly Income" })
  ).toBeVisible();

  // Go to step 2
  await page.getByRole("button", { name: "Next" }).click();

  // Wait for step 2 to render
  await expect(
    page.getByRole("heading", { name: "Customize Budget Categories" })
  ).toBeVisible();
  await page.waitForTimeout(500); // Allow any transitions

  const cards = await page.locator(".group-card").all();
  expect(cards.length).toBeGreaterThan(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const headerText = await card.locator(".group-name-edit").inputValue();

    const sizes = await card.evaluate((el) => {
      return {
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight,
      };
    });

    console.log(
      `Checking card "${headerText}": clientHeight = ${sizes.clientHeight}, scrollHeight = ${sizes.scrollHeight}`
    );

    // In a broken state, the card is squished (clientHeight is much smaller than scrollHeight)
    // In a correct state, the card is fully expanded (clientHeight equals scrollHeight)
    expect(sizes.clientHeight).toBeGreaterThanOrEqual(sizes.scrollHeight);
  }
});
