import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";
//URL navigation
//click status filter module
When("I click status modules if they have value", async function () {
    const priority = ["PASSING MODULES", "DEGRADED MODULES", "FAILED MODULES"];

    for (const status of priority) {
        console.log(`\n🔍 Checking: ${status}`);
        const container = this.page.locator(`//button[.//div[contains(text(),'${status}')]]`).first();
        if ((await container.count()) === 0) {
            console.log(`❌ Not found: ${status}`);
            continue;
        }

        await container.waitFor({ state: "visible", timeout: 2000 });
        await container.scrollIntoViewIfNeeded();
        const valueElement = container
            .locator("div")
            .filter({
                hasText: /^[0-9,]+$/,
            })
            .first();

        const valueText = await valueElement.textContent();
        const value = parseInt((valueText || "0").replace(/,/g, ""));

        if (value > 0) {
            console.log(`✅ Click ${status} (${value})`);
            const freshContainer = this.page.locator(`//button[.//div[contains(text(),'${status}')]]`).first();
            await freshContainer.waitFor({ state: "visible", timeout: 2000 });
            await freshContainer.scrollIntoViewIfNeeded();

            await freshContainer.click();
            await this.page.waitForTimeout(2000);
        } else {
            console.log(`⏭ Skip ${status} (${value})`);
        }
    }
});
//view all service
When("I click view all services", async function () {
    await this.baseDashboard.clicktopservice();
});
When("I click to close popup Services latency", async function () {
    await this.baseDashboard.clickbtnClose();
});
