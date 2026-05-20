import { When, DataTable } from "@cucumber/cucumber";

//Select tab in tabmenu
When("I click tab {string} to menutab", async function (tab: string) {
    await this.baseIncident.clictab(tab);
    await this.page.waitForTimeout(2000);
});
//Click to open custom range
When("I click custom range", async function () {
    await this.baseIncident.clickCustomrange();
});
//Select Start day and End day in custom range
When("I selects and saves date range from {string} to {string}", async function (startDate: string, endDate: string) {
    await this.baseIncident.selectDateRange(startDate, endDate);
    await this.baseIncident.clickSaveDateRange();
    await this.page.waitForTimeout(2000);
});
//Click on a link with specific text (Incident detail)
When("I click on link {string} at index {int}", async function (text: string, index: number) {
    await this.baseIncident.clickLinkByText(text, Number(index));
});
//Click to open log in workflow
When("I click step {string} of workflow", async function (step: string) {
    await this.baseIncident.clickStepOfWorkflow(step);
    await this.page.waitForTimeout(2000);
});
//Click to click on the active button of incident detail
When("I click button {string} of OpenTelemetry", async function (btnactive: string) {
    await this.baseIncident.clickButtonOfOpenTelemetry(btnactive);
    await this.page.waitForTimeout(2000);
});
//input data into general input field
When("I add a comment {string} into general input field", async function (value: string) {
    await this.baseIncident.fillInGeneralInputField(value);
    await this.page.waitForTimeout(2000);
});
//Merge the data into a table
When("I perform actions:", async function (table: DataTable) {
    const rows = table.hashes();
    for (const row of rows) {
        const action = row.action?.trim();
        const value = row.value?.trim();
        const datatestid = row.datatestid?.trim();
        const startDate = row.startDate?.trim();
        const endDate = row.endDate?.trim();
        if (!action) {
            throw new Error("Action is missing in table row");
        }
        await this.baseIncident.performAction(action, value, datatestid, startDate, endDate);
        await this.page.waitForTimeout(300);
    }
});
