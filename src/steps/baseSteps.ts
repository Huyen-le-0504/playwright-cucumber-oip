import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect, chromium, Page, Locator } from "@playwright/test";
import { BaseDashboard } from "../pages/baseDashboard";
//URL navigation
Given("user is on dashboard", async function (this: CustomWorld) {
    await this.baseDashboard.goto(this.config.baseUrl);
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
Then("user should be on dashboard", async function () {
    await this.page.waitForURL(`${process.env.BASE_URL}/en-us/dashboard?countryCode=gh`);
});
//click để mở dropdown list chọn tenant
When("I click button to select tenant", async function () {
    await this.basePage.clickButtonBycombobox();
});
//Chọn option tenant
When("I selects tenant {string}", async function (tenant: string) {
    await this.basePage.selectOptionFromCombobox(tenant);
    await this.page.waitForTimeout(3000);
});
//Click để mở dropdown filter
When("I click filter {string}", async function (datatestid: string) {
    await this.basePage.clickFilter(datatestid);
});

//Chọn option trong dropdown filter
When("I selects option {string} on filter", async function (filtername: string) {
    await this.basePage.clickOptionFilter(filtername);
    await this.page.waitForTimeout(3000);
});
//Chọn timerange
When("I select timerange {string}", async function (timerange: string) {
    await this.basePage.selectTimerange(timerange);
    await this.page.waitForTimeout(2000);
});
