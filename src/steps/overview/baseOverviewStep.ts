import { When, DataTable, Then } from "@cucumber/cucumber";

//Merge the data into a table
When("I perform overview actions:", async function (table: DataTable) {
    const rows = table.hashes();
    for (const row of rows) {
        const action = row.action?.trim();
        if (!action) {
            throw new Error("Action is missing in table row");
        }
        await this.baseOverview.performActionOverview(action, row.value ?? "", row.text ?? "", row.dropdownTenantFilter ?? "", row.checkbox ?? "");
        await this.page.waitForTimeout(2000);
    }
});
//Verify the filter displays the number of selected countries
Then("I verify country filter displays {string}", async function (expected: string) {
    await this.baseOverview.verifyCountryFilter(expected);
});
//Verify UI when user click to Critical Issues
Then("{string} card border turns blue", async function (cardName: string) {
    await this.baseOverview.verifyOverviewCardSelected(cardName);
});
