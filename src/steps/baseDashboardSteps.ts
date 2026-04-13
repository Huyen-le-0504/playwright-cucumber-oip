import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";
//URL navigation
//click status filter module
When("I click status modules if they have value", async function () {
    const priority = ["PASSING MODULES", "DEGRADED MODULES", "FAILED MODULES"];

    for (const status of priority) {
        const container = this.page.locator(`//button[.//div[contains(text(),'${status}')]]`);

        await container.first().waitFor({ state: "visible" });

        const valueText = await container.locator("div").filter({ hasText: /^\d+$/ }).first().textContent();

        const value = parseInt(valueText || "0");

        if (value > 0) {
            console.log(`Click ${status} (${value})`);
            await container.first().click();
            await this.page.waitForTimeout(5000);
        } else {
            console.log(`Skip ${status} (${value})`);
        }
    }
});
