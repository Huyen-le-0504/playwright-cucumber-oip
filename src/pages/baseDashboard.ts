// file: dashboardWithMagicLink.ts
import { chromium, Page, expect, Locator } from "playwright/test";
import * as imaps from "imap-simple";
import * as dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

export class BaseDashboard {
    static selectTenant(tenantName: string) {
        throw new Error("Method not implemented.");
    }
    protected page: Page;
    readonly tenantDropdown: Locator;
    constructor(page: Page) {
        this.page = page;
        this.page = page;
        this.tenantDropdown = page.locator('button[data-testid="tenant-dropdown"]');
        this.page.setDefaultTimeout(30_000);
    }

    //#region Locators
    menuItem = (item: string) => this.page.locator(`xpath=(//ul[@role="menu"]//li[@role="menuitem"]//span[contains(text(),"${item}")])`);
    btnByText = (text: string) => this.page.locator(`xpath=(//button[@type="submit" and normalize-space()="${text}"])`);
    txtGeneralInputField = (name: string) => this.page.locator(`xpath=//input[@name='${name}']`);
    selectById = (id: string) => this.page.locator(`select#${id}`);
    optionByText = (selectId: string, optionText: string) => this.page.locator(`xpath=//select[@id='${selectId}']/option[normalize-space()='${optionText}']`);
    linkByText = (text: string) => this.page.locator(`xpath=(//a[normalize-space(text())="${text}"])`);
    btnByflag = (text: string) => this.page.locator(`xpath=(//button[@type="button" and @role="combobox" and @aria-controls="radix-:rdjq:"])`);
    btnBytenant = (tenant: string) => this.page.locator(`xpath=(.//div[@role="option" and .//span[text()='${tenant}']])`);
    btncombobox = (name: string) => this.page.locator(`xpath=(//button[@type="button" and @role="combobox"]//span[@style="pointer-events: none;"]//div[@class="flex items-center gap-2 pr-2"])`);
    btnSelectFilter = (filtername: string) => this.page.locator(`xpath=(//div[@role="presentation"]//div[@role="option" and @tabindex="-1"]//span[@id="radix-:r366:" and normalize-space()="${filtername}"])`);
    btnfilter = (datatestid: string) => this.page.locator(`xpath=(//div[@data-testid="${datatestid}"]//button[@type="button" and @role="combobox"])`);
    btnFilterStatusModule = (status: string) => this.page.locator(`//button[.//*[normalize-space()='${status}']]`);
    //#endregion

    //#region Actions
    //Click link "Incident Detail"
    // async clickDropdown(text: string) {
    //     const dropdown = this.btnByflag(text);
    //     await dropdown.waitFor({ state: "visible" });
    //     await dropdown.click();
    // }
    //check value khác 0
    async clickstatus(status: string): Promise<void> {
        const container = this.page.locator(`//div[.//div[text()='${status}']]`);
        const valueLocator = container.locator("div").filter({ hasText: /^\d+$/ }).first();

        const valueText = await valueLocator.textContent();
        const value = parseInt(valueText || "0");

        if (value > 0) {
            console.log(`${status} has data: ${value} → click`);
            await container.click();
        } else {
            console.log(`${status} has NO data → skip`);
        }
    }
    //click theo thứ tư
    async clickModulesByPriority(): Promise<void> {
        const priority = ["PASSING MODULES", "DEGRADED MODULES", "FAILED MODULES"];

        for (const status of priority) {
            await this.clickstatus(status);
        }
    }

    //#endregion
}

//#endregion
