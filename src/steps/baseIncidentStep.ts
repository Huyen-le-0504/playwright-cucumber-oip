//keywords
import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";

When("I click tab {string} to menutab", async function (tab: string) {
    await this.baseIncident.clictab(tab);
});

When("I selects timerange {string}", async function (timerange: string) {
    await this.baseIncident.selectTimerange(timerange);
    await this.page.waitForTimeout(2000);
});
When("I click custom range", async function () {
    await this.baseIncident.clickCustomrange();
});
When("I selects and saves date range from {string} to {string}", async function (startDate: string, endDate: string) {
    await this.baseIncident.selectDateRange(startDate, endDate);
    await this.baseIncident.clickSaveDateRange();
    await this.page.waitForTimeout(2000);
});
