import { When } from "@cucumber/cucumber";

//URL navigation
//click status filter module
When("I click status modules if they have value", async function () {
    const priority = ["PASSING MODULES", "DEGRADED MODULES", "FAILED MODULES"];

    for (const status of priority) {
        console.log(`Checking: ${status}`);
        const container = this.page.locator(`//button[.//div[contains(text(),'${status}')]]`).first();
        if ((await container.count()) === 0) {
            console.log(`Not found: ${status}`);
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
            console.log(`Click ${status} (${value})`);
            const freshContainer = this.page.locator(`//button[.//div[contains(text(),'${status}')]]`).first();
            await freshContainer.waitFor({ state: "visible", timeout: 2000 });
            await freshContainer.scrollIntoViewIfNeeded();
            await freshContainer.click();
            await this.page.waitForTimeout(2000);
        } else {
            console.log(`Skip ${status} (${value})`);
        }
    }
});
//View all service
When("From {string} I click {string}", async function (datatestid: string, text: string) {
    await this.baseDashboard.clicktopservice(datatestid, text);
    await this.page.waitForTimeout(2000);
});
//Click to close popup Services latency
When("I click to close popup Services latency", async function () {
    await this.baseDashboard.clickbtnClose();
});
//Click to expand module
When("I click to expand module {string}", async function (expandmodule: string) {
    await this.baseDashboard.clickExpandModule(expandmodule);
    await this.page.waitForTimeout(3000);
});
//Click to collapse project
When("I click to collapse or expand project {string}", async function (collapsemodule: string) {
    await this.baseDashboard.clickCollapseProject(collapsemodule);
    await this.page.waitForTimeout(2000);
});
//Click to select submodule
When("I click {string} submodule", async function (submodule: string) {
    await this.baseDashboard.clickSubmodule(submodule);
    await this.page.waitForTimeout(2000);
});
//Click to select run result of submodule
When("I click {string} run result", async function (result: string) {
    await this.baseDashboard.clickRunResult(result);
    await this.page.waitForTimeout(2000);
});
//Click to expand run result
When("I click to expand run result at {string}", async function (titleresult: string) {
    await this.baseDashboard.clickExpandRunResult(titleresult);
    await this.page.waitForTimeout(2000);
});
