//keywords
import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";

Given("user is on dashboard", async function (this: CustomWorld) {
    await this.baseDashboard.goto(this.config.baseUrl);
});

Then("I should see {string} in cart icon", async function (count: string) {
    const cartBadge = this.page.locator(".bg-qa-clr");
    if (count === "0") {
        await expect(cartBadge).toHaveCount(0);
    } else {
        await expect(cartBadge).toHaveText(count);
    }
});

// Fill input
When("I fill input {string} with {string}", async function (inputName: string, value: string) {
    await this.baseDashboard.fillInGeneralInputField(inputName, value);
});

// Click button
When("I click button {string}", async function (text: string) {
    await this.baseDashboard.clickButtonByText(text);
});

//  LẤY MAGIC LINK TỪ OUTLOOK UI
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
Then("user should be on dashboard", async function () {
    await this.page.waitForURL(`${process.env.BASE_URL}/en-us/dashboard?countryCode=gh`);
});
When("I click button to select tenant", async function () {
    await this.baseDashboard.clickButtonBycombobox();
});

When("I selects tenant {string}", async function (tenant: string) {
    await this.baseDashboard.selectOptionFromCombobox(tenant);
    await this.page.waitForTimeout(3000);
});
