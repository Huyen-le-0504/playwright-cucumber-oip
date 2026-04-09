// file: dashboardWithMagicLink.ts
import { chromium, Page, expect, Locator } from "playwright/test";
import * as imaps from "imap-simple";
import * as dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

export class BaseIncident {
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
    btnBytenant = (tenant: string) => this.page.locator(`xpath=(.//div[@role="option" and .//span[text()='${tenant}']])`);
    btncombobox = (name: string) => this.page.locator(`xpath=(//button[@type="button" and @role="combobox"]//span[@style="pointer-events: none;"]//div[@class="flex items-center gap-2 pr-2"])`);
    tabmenu = (tab: string) => this.page.locator(`xpath=(//p[normalize-space()="${tab}"])`);
    timerange = (timerange: string) => this.page.locator(`xpath=((//button[normalize-space()="${timerange}" and not(contains(@class,"hidden"))])[1])`);
    customrange = (customrange: string) => this.page.locator(`xpath=(//div[@class="flex flex-1 flex-row items-center gap-2"]//button[@type="button"]//div[normalize-space()="Custom range"])`);
    datePicker = () => this.page.locator('//*[@data-testid="date-range-picker-custom"]');
    startCalendar = () => this.page.locator('(//*[@data-testid="date-range-picker-custom"]//div[contains(@class,"calendar-section")])[1]');
    endCalendar = () => this.page.locator('(//*[@data-testid="date-range-picker-custom"]//div[contains(@class,"calendar-section")])[2]');
    saveButton = () => this.page.locator('//button[.//text()="Save"]');
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
    async clictab(tabName: string): Promise<void> {
        const button = this.tabmenu(tabName);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }

    async selectTimerange(timerange: string): Promise<void> {
        const option = this.timerange(timerange);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    async clickCustomrange(datetime: string): Promise<void> {
        const button = this.customrange(datetime);
        await button.waitFor({ state: "visible", timeout: 10000 });
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
    async pickDate(calendarIndex: number, date: string) {
        const calendar = this.page.locator(`(//*[@data-testid="date-range-picker-custom"]//div[contains(@class,"calendar-section")])[${calendarIndex}]`);

        const monthLabel = calendar.locator(".rdp-caption_label");
        const prevBtn = calendar.locator(".rdp-button_previous");
        const targetMonth = new Date(date).toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        });
        while (true) {
            const currentMonth = (await monthLabel.textContent())?.trim();
            if (currentMonth === targetMonth) break;
            const isDisabled = await prevBtn.getAttribute("aria-disabled");
            if (isDisabled === "true") {
                throw new Error(`Không thể về tháng: ${targetMonth}`);
            }
            await prevBtn.click();
        }
        const day = calendar.locator(`//*[@data-day="${date}" and not(@data-disabled="true")]`);
        if ((await day.count()) === 0) {
            throw new Error(`Date ${date} không tồn tại hoặc bị disable`);
        }
        await day.click();
    }
    async clickSaveDateRange() {
        await this.saveButton().waitFor({ state: "visible" });
        await this.saveButton().click();
    }
    async selectDateRange(start: string, end: string) {
        await this.pickDate(1, start); // Start
        await this.pickDate(2, end); // End
    }

    //#endregion
}

//#endregion
