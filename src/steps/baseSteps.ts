import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../../pages/baseDashboard";
//URL navigation
Given("I am on dashboard", async function (this: CustomWorld) {
    await this.basePage.goto(this.config.baseUrl);
});
//  Lấy link login từ outlook
When("I wait for magic link and navigate", { timeout: 120 * 10000 }, async function (this: CustomWorld) {
    const browser = await chromium.launch({ headless: false });

    try {
        const context = await browser.newContext({
            storageState: "outlook-auth.json",
        });

        const outlookPage = await context.newPage();
        await outlookPage.goto("https://outlook.office.com/mail");

        await outlookPage.waitForSelector("div[role='main']", { timeout: 60000 });

        let magicLink: string | null = null;

        for (let i = 0; i < 12; i++) {
            console.log(`🔁 Checking inbox attempt ${i + 1}`);

            await outlookPage.reload();

            // ✅ FIX: dùng role option
            await outlookPage.waitForSelector("div[role='option']", { timeout: 20000 });

            await outlookPage.waitForTimeout(5000);

            const emails = outlookPage.locator("div[role='option']");
            const count = await emails.count();

            console.log("📊 Email count:", count);

            for (let j = 0; j < count; j++) {
                const email = emails.nth(j);

                const text = await email.innerText();

                console.log(`📧 Email ${j}:`, text);

                if (!text.includes("Login to DVCS Ops Insights")) continue;

                console.log("✅ Found login email");

                await email.click();

                await outlookPage.waitForSelector("text=We've received a login request");

                const linkElement = outlookPage.locator("a:has-text('Log In')");
                await linkElement.waitFor({ state: "visible", timeout: 30000 });

                magicLink = await linkElement.getAttribute("href");
                break;
            }

            if (magicLink) break;

            console.log("⏳ Chưa có mail login...");
            await outlookPage.waitForTimeout(5000);
        }

        if (!magicLink) {
            throw new Error("❌ Không tìm thấy magic link mới");
        }

        console.log("🔗 MAGIC LINK:", magicLink);

        await this.page.goto(magicLink, {
            waitUntil: "domcontentloaded",
        });

        await this.page.waitForLoadState("networkidle");
    } finally {
        await browser.close();
    }
});
// Fill input
When("I fill input {string} with {string}", async function (inputName: string, value: string) {
    await this.basePage.fillInGeneralInputField(inputName, value);
});

// Click button login
When("I click button {string}", async function (text: string) {
    await this.basePage.clickButtonByText(text);
});

// Verify text
Then("I should be on dashboard", async function () {
    await this.page.waitForURL(`${process.env.BASE_URL}/en-us/dashboard?countryCode=gh`);
});
//click để mở dropdown list chọn tenant
When("I click button to select tenant", async function () {
    await this.basePage.clickButtonBycombobox();
});
//Chọn option tenant
When("I selects tenant {string}", async function (tenant: string) {
    await this.basePage.selectOptionFromCombobox(tenant);
});
//Click để mở dropdown filter
When("I click filter {string}", async function (datatestid: string) {
    await this.basePage.clickFilter(datatestid);
});

//Chọn option trong dropdown filter
When("I selects {string} option on filter", async function (filtername: string) {
    await this.basePage.clickOptionFilter(filtername);
    await this.page.waitForTimeout(3000);
});
//Chọn timerange
When("I select {string} timerange {string}", async function (timerange: string, datatestid: string) {
    await this.basePage.selectTimerange(timerange, datatestid);
    await this.page.waitForTimeout(2000);
});
