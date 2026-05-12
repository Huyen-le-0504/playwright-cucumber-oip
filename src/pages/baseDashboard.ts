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
    btntopservice = () => this.page.locator(`xpath=(//div[@data-testid="top-services-latency"]//div//button)`);
    btnclose = () => this.page.locator(`xpath=(//button[.//span[text()='Close']])`);
    expandModule = (expandmodule: string) => this.page.locator(`xpath=(//button[contains(.,'${expandmodule}')]//span[contains(.,'Sub-modules')])`);
    collapseProject = (collapsemodule: string) => this.page.locator(`xpath=(//button[.//span[text()='${collapsemodule}']]//span[@data-state-icon='true'])`);
    submodule = (submodule: string) => this.page.locator(`xpath=(//div[contains(@class,'flex items-center') and contains(@class,'text-sm')]//span[text()='${submodule}'])`);
    runResult = (result: string) => this.page.locator(`xpath=(//div[contains(@class,'space-y-0')]//a)[${result}]`);
    expandrunresult = (titleresult: string) => this.page.locator(`xpath=(//button[@aria-expanded='true' and .//h3[text()='${titleresult}']])`);
    //#endregion
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
    async clicktopservice(): Promise<void> {
        const button = this.btntopservice();
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    async clickbtnClose(): Promise<void> {
        const button = this.btnclose();
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }

    //Click để expand module
    async clickExpandModule(expandmodule: string): Promise<void> {
        const button = this.expandModule(expandmodule);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }

    //Click để collapse module
    async clickCollapseProject(collapsemodule: string): Promise<void> {
        const button = this.collapseProject(collapsemodule);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //click để chọn submodule
    async clickSubmodule(submodule: string): Promise<void> {
        const submoduleLocator = this.submodule(submodule);
        await submoduleLocator.waitFor({ state: "visible", timeout: 10000 });
        await submoduleLocator.click();
    }
    //Click để chọn run result của submodule
    async clickRunResult(result: string): Promise<void> {
        const runResultLocator = this.runResult(result);
        await runResultLocator.waitFor({ state: "visible", timeout: 10000 });
        await runResultLocator.click();
    }
    //Click để expand run result
    async clickExpandRunResult(titleresult: string): Promise<void> {
        const expandRunResultLocator = this.expandrunresult(titleresult);
        await expandRunResultLocator.waitFor({ state: "visible", timeout: 10000 });
        await expandRunResultLocator.click();
    }

    //#endregion
}

//#endregion
