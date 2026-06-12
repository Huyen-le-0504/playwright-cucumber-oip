import { Page, expect, Locator } from "playwright/test";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

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
    txtGeneralInputField = (name: string) => this.page.locator(`xpath=//input[@name='${name}']`);
    btncombobox = () => this.page.locator(`xpath=(//button[@type="button" and @role="combobox"]//span[@style="pointer-events: none;"]//div[@class="flex items-center gap-2 pr-2"])`);
    btnByText = (text: string) => this.page.locator(`xpath=(//button[@type="submit" and normalize-space()="${text}"])`);
    btnfilter = (datatestid: string) => this.page.locator(`xpath=(//div[@data-testid="${datatestid}"]//button[@type="button" and @role="combobox"])`);
    timerange = (datatestid: string, timerange: string) => this.page.locator(`xpath=(//div[@data-testid="${datatestid}"]//button[normalize-space()="${timerange}"])[1]`);
    clickbarchart = (barchart: string, barchartindex: number) => this.page.locator(`xpath=(//span[contains(.,'${barchart}')]/following::div[@data-state='closed' and contains(@class,'cursor-pointer')])[${barchartindex}]`);
    selectboxfilter = (submodule: string, index: number, color: string) => this.page.locator(`xpath=//span[normalize-space()="${submodule}"]/ancestor::div[contains(@class,'items-center')]//div[contains(@class,'${color}')][${index}]`);
    breadcrumb = (breadcrumb: string) => this.page.locator(`xpath=(//ol//li//a[contains(text(),"${breadcrumb}")])`);
    tabmenu = (tab: string) => this.page.locator(`xpath=(//p[normalize-space()="${tab}"])`);
    selectcheckbox = (checkbox: string) => this.page.locator(`xpath=(//span[normalize-space()='${checkbox}']/parent::*//button[@role='checkbox'])`);
    //#endregion
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
    // Function to click button using this locator
    async clickButtonByText(text: string): Promise<void> {
        const button = this.btnByText(text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to open dropdown list to select tenant
    async clickButtonBycombobox(): Promise<void> {
        const button = this.btncombobox();
        await button.waitFor({ state: "visible", timeout: 5000 });
        await button.click();
    }
    //Click to select incident detail
    async selectDropdownByText(selectId: string, optionText: string | null): Promise<void> {
        if (!optionText) return;
        const select = this.page.locator(`select#${selectId}`);
        await select.waitFor({ state: "visible" });
        await select.selectOption({ label: optionText });
    }
    //Click to open dropdown filter
    async clickFilter(datatestid: string): Promise<void> {
        const button = this.btnfilter(datatestid);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Select option in dropdown filter
    async clickOptionFilter(option: string): Promise<void> {
        const opt = this.page.getByRole("option", { name: option });
        await opt.waitFor();
        await opt.click();
    }
    //Select tenant option
    async selectOptionFromCombobox(optionText: string): Promise<void> {
        const option = this.page.locator(`text=${optionText}`);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    //Click to select checkbox in dropdown filter
    async clickCheckbox(checkbox: string): Promise<void> {
        const cb = this.selectcheckbox(checkbox);
        await cb.waitFor({
            state: "visible",
            timeout: 10000,
        });
        await cb.scrollIntoViewIfNeeded();
        await cb.click({
            force: true,
            timeout: 10000,
        });
    }
    //Select time range
    async selectTimerange(datatestid: string, timerange: string): Promise<void> {
        const option = this.timerange(datatestid, timerange);
        await option.waitFor({ state: "visible", timeout: 15000 });
        await option.click({ timeout: 15000 });
    }
    //#endregion
    //#region Actions
    //Input email to textbox to login
    async fillInGeneralInputField(nameOrId: string, value: string | null) {
        if (!value) return;
        const input = this.txtGeneralInputField(nameOrId);
        await input.waitFor({ state: "visible" });
        await input.fill(value);
    }
    //#endregion
    //#region Actions
    //Click any barchart in dashboard by module name
    async clickBarchart(barchart: string, barchartindex: number): Promise<void> {
        const button = this.clickbarchart(barchart, barchartindex);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to select tab at menutab
    async clictab(tabName: string): Promise<void> {
        const button = this.tabmenu(tabName);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Locate element by color
    async clickStatusBoxByPriority(submodule: string, index: number): Promise<void> {
        const colors = ["bg-[#D4F4EC]", "bg-[#FFEECC]", "bg-[#FDDDD3]"];
        let hasClicked = false;
        for (const [colorIndex, color] of colors.entries()) {
            const box = this.selectboxfilter(submodule, index, color);
            const isVisible = await box.isVisible().catch(() => false);
            if (!isVisible) {
                continue;
            }
            const className = await box.getAttribute("class");
            const isDisabled = className?.includes("cursor-not-allowed") || className?.includes("opacity-50");
            if (isDisabled) {
                console.log(`Skip disabled status box: ${color}`);
                if (colorIndex === colors.length - 1 && !hasClicked) {
                    throw new Error("The last status box has no data.");
                }
                continue;
            }
            hasClicked = true;
            await box.scrollIntoViewIfNeeded();
            await box.click();
            console.log(`Clicked status box with color: ${color}`);
            await this.breadcrumb("Dashboard").click();
            await this.page.waitForLoadState("networkidle");
        }
        if (!hasClicked) {
            throw new Error(`No visible status box found for "${submodule}".`);
        }
    }
    //#endregion
}

//#endregion
