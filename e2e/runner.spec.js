const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

test("run interactive actions from actions.json", async ({ page }) => {
  const actionsPath = path.join(__dirname, "actions.json");
  if (!fs.existsSync(actionsPath)) {
    console.warn(`No actions.json found at ${actionsPath}. Exiting.`);
    return;
  }

  const { actions } = JSON.parse(fs.readFileSync(actionsPath, "utf-8"));
  console.log(`Loaded ${actions.length} actions from actions.json.`);

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(`Executing action ${i + 1}/${actions.length}: ${action.type}`);

    switch (action.type) {
      case "goto":
        await page.goto(action.url);
        break;

      case "click":
        await page.locator(action.selector).click();
        break;

      case "fill":
        await page.locator(action.selector).fill(action.text);
        break;

      case "wait":
        if (action.timeout) {
          await page.waitForTimeout(action.timeout);
        } else if (action.selector) {
          await page.locator(action.selector).waitFor({ state: "visible" });
        }
        break;

      case "screenshot":
        const targetPath = action.path;
        // Ensure directory exists
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        if (action.selector) {
          await page.locator(action.selector).screenshot({ path: targetPath });
        } else {
          await page.screenshot({ path: targetPath });
        }
        console.log(`Saved screenshot to: ${targetPath}`);
        break;

      case "dump":
        const locators = await page.locator(action.selector).all();
        console.log(
          `Dump for "${action.selector}" (${locators.length} elements found):`
        );
        for (let j = 0; j < locators.length; j++) {
          const locator = locators[j];
          const text = await locator
            .textContent()
            .then((t) => t.trim().substring(0, 60))
            .catch(() => "");
          const box = await locator.boundingBox().catch(() => null);
          const computed = await locator
            .evaluate((el) => {
              const style = window.getComputedStyle(el);
              return {
                height: style.height,
                maxHeight: style.maxHeight,
                minHeight: style.minHeight,
                overflow: style.overflow,
                display: style.display,
                flexDirection: style.flexDirection,
                scrollHeight: el.scrollHeight,
                clientHeight: el.clientHeight,
              };
            })
            .catch(() => null);

          console.log(`  Element ${j + 1}: text="${text}"`);
          console.log(`    Bounding Box:`, box);
          console.log(`    Styles:`, computed);
        }
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }
});
