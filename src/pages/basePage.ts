// file: dashboardWithMagicLink.ts
import { chromium, Page, expect, Locator } from "playwright/test";
import * as imaps from "imap-simple";
import * as dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

export class BasePage {
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
    tabmenu = (tab: string) => this.page.locator(`xpath=(//p[normalize-space()="${tab}"])`);
    txtGeneralInputField = (name: string) => this.page.locator(`xpath=//input[@name='${name}']`);
    optionByText = (selectId: string, optionText: string) => this.page.locator(`xpath=//select[@id='${selectId}']/option[normalize-space()='${optionText}']`);
    btnBytenant = (tenant: string) => this.page.locator(`xpath=(.//div[@role="option" and .//span[text()='${tenant}']])`);
    btncombobox = (name: string) => this.page.locator(`xpath=(//button[@type="button" and @role="combobox"]//span[@style="pointer-events: none;"]//div[@class="flex items-center gap-2 pr-2"])`);
    btnByText = (text: string) => this.page.locator(`xpath=(//button[@type="submit" and normalize-space()="${text}"])`);
    btnSelectFilter = (filtername: string) => this.page.locator(`xpath=(//div[@role="presentation"]//div[@role="option" and @tabindex="-1"]//span[@id="radix-:r366:" and normalize-space()="${filtername}"])`);
    btnfilter = (datatestid: string) => this.page.locator(`xpath=(//div[@data-testid="${datatestid}"]//button[@type="button" and @role="combobox"])`);
    timerange = (timerange: string, datatestid: string) => this.page.locator(`xpath=(//div[@data-testid="${datatestid}"]//button[normalize-space()="${timerange}" and not(contains(@class,"hidden"))])`); //#endregion
    statusfilter = (status: string, timerange: string) => this.page.locator(`xpath=(//div[@data-testid="${status}"]//button[normalize-space()="${timerange}" and not(contains(@class,"hidden"))])`);
    //#region Actions
    // URL navigation
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
    //#endregion
    //#region Actions
    // Hàm click button dùng locator này
    async clickButtonByText(text: string): Promise<void> {
        const button = this.btnByText(text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click để mở dropdown list chọn tenant
    async clickButtonBycombobox(text: string): Promise<void> {
        const button = this.btncombobox(text);
        await button.waitFor({ state: "visible", timeout: 5000 });
        await button.click();
    }
    //Click để mở dropdown list chọn tenant
    async selectDropdownByText(selectId: string, optionText: string | null): Promise<void> {
        if (!optionText) return;
        const select = this.page.locator(`select#${selectId}`);
        await select.waitFor({ state: "visible" });
        await select.selectOption({ label: optionText });
    }
    //Click để mở dropdown filter
    async clickFilter(datatestid: string): Promise<void> {
        const button = this.btnfilter(datatestid);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Chọn option trong dropdown filter
    async clickOptionFilter(option: string): Promise<void> {
        const opt = this.page.getByRole("option", { name: option });
        await opt.waitFor();
        await opt.click();
    }
    //Chọn option tenant
    async selectOptionFromCombobox(optionText: string): Promise<void> {
        const option = this.page.locator(`text=${optionText}`);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    //Chọn timerange
    async selectTimerange(timerange: string, datatestid: string): Promise<void> {
        const option = this.timerange(timerange, datatestid);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    //Chọn filter module theo status

    //#endregion
    //#region Actions
    //Điền email vao input để login
    async fillInGeneralInputField(nameOrId: string, value: string | null) {
        if (!value) return;
        const input = this.txtGeneralInputField(nameOrId);
        await input.waitFor({ state: "visible" });
        await input.fill(value);
    }
    //#endregion
}

//#endregion
