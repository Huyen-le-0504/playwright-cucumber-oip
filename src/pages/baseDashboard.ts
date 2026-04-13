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
    btnChooseProject = (project: string) => this.page.locator(`//div[@data-testid="${project}"]// button[@role="combobox"]`);
    optionChooseProject = (option: string) => this.page.locator(`//div[@role="option"]//span[normalize-space()="${option}"]`);
    btnLatencyTime = (text: string) => this.page.locator(`//div[@data-testid="latency-section"]//button[normalize-space()="${text}"]`);
    btnViewAllservices = () => this.page.locator(`//button[text()="View all services"]`);
    btnClose = () => this.page.locator(`//div[@role='dialog']//button[.//span[text()='Close']]`);
    iconInfo = () => this.page.locator(`//svg[contains(@class,'lucide-info')]`);
    btnLastResult = (text: string) => this.page.locator(`//div[@data-testid="last-results-filter"]//button[normalize-space()="${text}"]`);
    btnFilterModules = (text: string) => this.page.locator(`//button[.//div[normalize-space()='${text}']]`);

    //div[@role="<roleName>"]//span[normalize-space()="<text>"]
    //div[@data-testid="<dataTest-id>"]// button[@role="<roleName>"]

    //#endregion

    //#region Actions
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState("domcontentloaded", { timeout: 30000 });
    }

    async reload(): Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async expectTextVisible(text: string): Promise<void> {
        await expect(this.page.getByText(text)).toBeVisible();
    }

    async clickDropdown(text: string) {
        const dropdown = this.btnByflag(text);
        await dropdown.waitFor({ state: "visible" });
        await dropdown.click();
    }

    async selectDropdownByText(selectId: string, optionText: string | null): Promise<void> {
        if (!optionText) return;
        const select = this.page.locator(`select#${selectId}`);
        await select.waitFor({ state: "visible" });
        await select.selectOption({ label: optionText });
    }

    // Hàm click button dùng locator này
    async clickButtonByText(text: string): Promise<void> {
        const button = this.btnByText(text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }

    async clickButtonBycombobox(text: string): Promise<void> {
        const button = this.btncombobox(text);
        await button.waitFor({ state: "visible", timeout: 5000 });
        await button.click();
    }

    // New helper: Điền email vào input email cụ thể
    async fillInGeneralInputField(nameOrId: string, value: string | null) {
        if (!value) return;
        const input = this.txtGeneralInputField(nameOrId);
        await input.waitFor({ state: "visible" });
        await input.fill(value);
    }

    async selectOptionFromCombobox(optionText: string): Promise<void> {
        const option = this.page.locator(`text=${optionText}`);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }

    async selectFilterProject(text: string): Promise<void> {
        const button = this.btnChooseProject(text);
        await button.waitFor({ state: "visible", timeout: 30000 });
        await button.click();

        const option = this.optionChooseProject(text);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }

    async selectLatencyTime(text: string): Promise<void> {
        const button = this.btnLatencyTime(text);
        await button.waitFor({ state: "visible", timeout: 3000 });
        await button.click();
    }

    async clickViewAllServices(): Promise<void> {
        const button = this.btnViewAllservices();
        await button.waitFor({ state: "visible", timeout: 3000 });
        await button.click();
    }
    async clickCloseViewAllServices(): Promise<void> {
        const button = this.btnClose();
        await button.waitFor({ state: "visible", timeout: 3000 });
        await button.click();
    }

    async clickIconInfo(): Promise<void> {
        const button = this.iconInfo();
        await button.waitFor({ state: "visible", timeout: 3000 });
        await button.click();
    }

    async selectFilterModule(text: string): Promise<void> {
        const button = this.btnFilterModules(text);
        await button.waitFor({ state: "visible", timeout: 3000 });
        await button.click();
    }

    // async selectFilterModule(text: string): Promise<void> {
    //     const button = this.btnFilterModules(text);

    //     await button.waitFor({ state: "visible" });
    //     await button.scrollIntoViewIfNeeded();

    //     const isDisabled = await button.isDisabled();

    //     const value = Number(await button.locator("span.tabular-nums").textContent());

    //     // log thôi, KHÔNG return
    //     if (isDisabled || value === 0) {
    //         console.log(`Button "${text}" may be inactive (disabled or value=0)`);
    //     }

    //     // vẫn click
    //     await button.click({ force: true });
    // }

    async selectLastResult(text: string): Promise<void> {
        const button = this.btnLastResult(text);
        await button.waitFor({ state: "visible", timeout: 3000 });
        await button.click();
    }
    //#endregion
}

//#endregion
1;
