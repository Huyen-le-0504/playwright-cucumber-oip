import { Page, Locator, expect } from "playwright/test";
import * as dotenv from "dotenv";
import { BasePage } from "../dynamicLocator/basePage";
dotenv.config(); // Load environment variables from .env

export class BaseOverview {
    static selectTenant(tenantName: string) {
        throw new Error("Method not implemented.");
    }
    protected page: Page;
    protected basePage: BasePage;
    readonly tenantDropdown: Locator;
    constructor(page: Page) {
        this.page = page;
        this.basePage = new BasePage(page);
        this.tenantDropdown = page.locator('button[data-testid="tenant-dropdown"]');
        this.page.setDefaultTimeout(30_000);
    }
    //#region Locators
    btntopic = (text: string) => this.page.locator(`xpath=(//div//p[normalize-space()='${text}']/ancestor::div[contains(@class,'cursor-pointer')])`);
    btnOpenDropdownListTenant = (filter: string) => this.page.locator(`xpath=(//form//button[.//span[normalize-space()='${filter}']])`);
    //#endregion
    //#region Actions
    //Click filter "Total pending lag"
    async clickBtnTotalPendingLag(text: string): Promise<void> {
        const button = this.btntopic(text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to open dropdown list to select tenant
    async clickBtnOpenDropdownListTenant(text: string): Promise<void> {
        const button = this.btnOpenDropdownListTenant(text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    // Verify the filter displays the number of selected countries
    async verifyCountryFilter(expected: string): Promise<void> {
        await expect(this.btnOpenDropdownListTenant(expected)).toHaveText(expected);
    }
    //Verify UI when user click to Critical Issues
    async verifyOverviewCardSelected(cardName: string): Promise<void> {
        await expect(this.btntopic(cardName)).toHaveCSS("border-color", "rgb(0, 86, 184)");
    }
    //#endregion
    //#region Actions
    //Merge the data into a table
    async performActionOverview(action: string, value: string) {
        const actions: Record<string, () => Promise<void>> = {
            tab: async () => this.basePage.clictab(value),
            totalPendingLag: async () => this.clickBtnTotalPendingLag(value),
            dropdownTenantFilter: async () => this.clickBtnOpenDropdownListTenant(value),
            checkbox: async () => this.basePage.clickCheckbox(value),
            verifyCountryFilter: async () => this.verifyCountryFilter(value),
        };
        const fn = actions[action];
        if (!fn) {
            throw new Error(`Unknown action: ${action}`);
        }
        await fn();
    }
    //#endregion
}
