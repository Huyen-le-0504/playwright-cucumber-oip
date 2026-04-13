import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";
//URL navigation
//  Lấy link login từ outlook
When("I wait for magic link and navigate", { timeout: 120 * 10000 }, async function (this: CustomWorld) {
    const browser = await chromium.launch({ headless: false });

    try {
        const context = await browser.newContext({
            storageState: "outlook-auth.json",
        });

        const outlookPage = await context.newPage();

        await outlookPage.goto("https://outlook.office.com/mail");

        await outlookPage.waitForSelector("div[role='main']", { timeout: 30000 });

        let magicLink: string | null = null;

        for (let i = 0; i < 5; i++) {
            const emailItem = outlookPage.locator("span:has-text('login')").first();

            if (await emailItem.isVisible()) {
                await emailItem.click();

                const linkElement = outlookPage.locator("a:has-text('Log In')");
                await linkElement.waitFor({ state: "visible", timeout: 10000 });

                magicLink = await linkElement.getAttribute("href");
                break;
            }
            console.log(` Chưa có mail... retry ${i + 1}`);
            await outlookPage.waitForTimeout(5000);
            await outlookPage.reload();
        }

        if (!magicLink) {
            throw new Error(" Không lấy được magic link");
        }

        console.log(" Magic link:", magicLink);

        await this.page.goto(magicLink);
        await this.page.waitForURL("**/dashboard");
        await this.page.waitForTimeout(4000);
    } finally {
        await browser.close();
    }
});
// Verify text
Then("I should be on dashboard", async function () {
    await this.page.waitForURL(`${process.env.BASE_URL}/en-us/dashboard?countryCode=gh`);
});
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
