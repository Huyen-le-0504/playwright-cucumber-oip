//keywords
import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";
//Chọn tab trong tabmenu
When("I click tab {string} to menutab", async function (tab: string) {
    await this.baseIncident.clictab(tab);
    await this.page.waitForTimeout(2000);
});

//Click để mở custom range
When("I click custom range", async function () {
    await this.baseIncident.clickCustomrange();
});
//Chọn Start day và End day trong custom range
When("I selects and saves date range from {string} to {string}", async function (startDate: string, endDate: string) {
    await this.baseIncident.selectDateRange(startDate, endDate);
    await this.baseIncident.clickSaveDateRange();
    await this.page.waitForTimeout(2000);
});
//Click vào link có text cụ thể (Incident detail)
When("I click on link {string} at index {int}", async function (text: string, index: number) {
    await this.baseIncident.clickLinkByText(text, Number(index));
});
//Click để mở log trong wf
When("I click step {string} of workflow", async function (step: string) {
    await this.baseIncident.clickStepOfWorkflow(step);
    await this.page.waitForTimeout(2000);
});
//Hàm điền vào table
When("I perform actions:", async function (table: DataTable) {
    const rows = table.hashes();

    for (const row of rows) {
        const action = row.action?.trim();
        const value = row.value?.trim();
        const startDate = row.startDate?.trim();
        const endDate = row.endDate?.trim();

        if (!action) {
            throw new Error("Action is missing in table row");
        }

        await this.baseIncident.performAction(action, value, startDate, endDate);
        await this.page.waitForTimeout(2000);
    }
});
