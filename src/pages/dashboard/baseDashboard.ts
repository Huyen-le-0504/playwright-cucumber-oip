// file: dashboardWithMagicLink.ts
import { Page, Locator } from "playwright/test";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

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
    btntopservice = (datatestid: string, text: string) => this.page.locator(`xpath=(//div[@data-testid="${datatestid}"]//button[text()="${text}"])`);
    btnclose = () => this.page.locator(`xpath=(//button[.//span[text()='Close']])`);
    expandModule = (expandmodule: string) => this.page.locator(`xpath=(//span[normalize-space()="${expandmodule}"]/ancestor::button//div[contains(@class,'cursor-pointer') and .//span[contains(.,'Sub-module')]])`);
    collapseProject = (collapsemodule: string) => this.page.locator(`xpath=(//button[.//span[text()='${collapsemodule}']]//span[@data-state-icon='true'])`);
    submodule = (submodule: string) => this.page.locator(`xpath=(//div[contains(@class,'flex items-center') and contains(@class,'text-sm')]//span[text()='${submodule}'])`);
    runResult = (result: string) => this.page.locator(`xpath=(//div[contains(@class,'space-y-0')]//a)[${result}]`);
    expandrunresult = (titleresult: string) => this.page.locator(`xpath=(//button[@aria-expanded='true' and .//h3[text()='${titleresult}']])`);
    //#endregion
    //#endregion

    //#region Actions
    //Check if the value is different from 0
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
    //click In order of priority: PASSING MODULES → DEGRADED MODULES → FAILED MODULES
    async clickModulesByPriority(): Promise<void> {
        const priority = ["PASSING MODULES", "DEGRADED MODULES", "FAILED MODULES"];

        for (const status of priority) {
            await this.clickstatus(status);
        }
    }
    //Click to open top service popup
    async clicktopservice(datatestid: string, text: string): Promise<void> {
        const button = this.btntopservice(datatestid, text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to close top service popup
    async clickbtnClose(): Promise<void> {
        const button = this.btnclose();
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to expand module
    async clickExpandModule(expandmodule: string): Promise<void> {
        const button = this.expandModule(expandmodule);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to collapse module
    async clickCollapseProject(collapsemodule: string): Promise<void> {
        const button = this.collapseProject(collapsemodule);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //click to select submodule
    async clickSubmodule(submodule: string): Promise<void> {
        const submoduleLocator = this.submodule(submodule);
        await submoduleLocator.waitFor({ state: "visible", timeout: 10000 });
        await submoduleLocator.click();
    }
    //Click to select run result of submodule
    async clickRunResult(result: string): Promise<void> {
        const runResultLocator = this.runResult(result);
        await runResultLocator.waitFor({ state: "visible", timeout: 10000 });
        await runResultLocator.click();
    }
    //Click to expand run result
    async clickExpandRunResult(titleresult: string): Promise<void> {
        const expandRunResultLocator = this.expandrunresult(titleresult);
        await expandRunResultLocator.waitFor({ state: "visible", timeout: 10000 });
        await expandRunResultLocator.click();
    }

    //#endregion
}

//#endregion
