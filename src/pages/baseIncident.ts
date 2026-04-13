// file: dashboardWithMagicLink.ts
import { chromium, Page, expect, Locator } from "playwright/test";
import * as imaps from "imap-simple";
import * as dotenv from "dotenv";
import { BasePage } from "@pages/basePage";
dotenv.config(); // Load biến môi trường từ .env

export class BaseIncident {
    static selectTenant(tenantName: string) {
        throw new Error("Method not implemented.");
    }

    protected page: Page;
    readonly tenantDropdown: Locator;
    constructor(page: Page) {
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
    linkByText = (text: string, int: number = 1) => this.page.locator(`xpath=(//a[normalize-space()="${text}"])[${int}]`);
    btnStep = (step: string) => this.page.locator(`xpath=(//button[.//div[contains(text(),'${step}')]])`);
    btnviewlog = (text: string) => this.page.locator(`xpath=((//button[normalize-space()="${text}"])[1])`);
    //#endregion
    //#region Actions
    //Click link "Incident Detail"
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
    //Click để chọn tab ở menutab
    async clictab(tabName: string): Promise<void> {
        const button = this.tabmenu(tabName);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }

    //Chọn time range
    async selectTimerange(timerange: string): Promise<void> {
        const option = this.timerange(timerange);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    //Click để mở custom range
    async clickCustomrange(datetime: string): Promise<void> {
        const button = this.customrange(datetime);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click vào step trong workflow
    async clickStepOfWorkflow(stepName: string): Promise<void> {
        const step = this.page.locator(`text=${stepName}`).first();
        await step.waitFor({ state: "visible", timeout: 10000 });
        await step.scrollIntoViewIfNeeded();
        await step.click();
    }
    //Click để xem log của step nếu step đó là warn hoặc Error
    async clickPriorityStep(): Promise<void> {
        const steps = this.page.locator("div.flex.grow.items-center");

        await steps.first().waitFor({ state: "visible", timeout: 10000 });

        const total = await steps.count();
        console.log("Total steps:", total);

        let yellowCandidate: any = null;

        for (let i = 0; i < total; i++) {
            const step = steps.nth(i);

            // 🔴 check RED (#C2451E)
            const hasRed = await step.locator(".text-\\[\\#C2451E\\], .text-\\[\\#C2451E\\] *").count();

            if (hasRed > 0) {
                console.log("Found RED step at workflow", i);
                await step.scrollIntoViewIfNeeded();
                await step.click();
                return;
            }

            // 🟡 check YELLOW (#F59E0B)
            const hasYellow = await step.locator(".text-\\[\\#F59E0B\\], .text-\\[\\#F59E0B\\] *").count();

            if (hasYellow > 0 && !yellowCandidate) {
                yellowCandidate = step;
            }
        }

        if (yellowCandidate) {
            console.log("Click warning step (YELLOW) since no ERROR step found");
            await yellowCandidate.scrollIntoViewIfNeeded();
            await yellowCandidate.click();
            return;
        }

        throw new Error("Không tìm thấy step error hoặc warn nào trong workflow");
    }
    //Click để xem thêm log nếu log > 5 lines
    async clickButtonViewlog(text: string): Promise<void> {
        const button = this.btnviewlog(text);
        const count = await button.count();
        if (text === "View more") {
            if (count === 0) {
                console.log("No View more (log <= 5 lines)");
                return;
            }
            await button.first().scrollIntoViewIfNeeded();
            await button.first().click();
            return;
        }
        await button.first().waitFor({ state: "visible", timeout: 10000 });
        await button.first().scrollIntoViewIfNeeded();
        await button.first().click();
    }
    //Chọn option tenant
    async selectOptionFromCombobox(optionText: string): Promise<void> {
        const option = this.page.locator(`text=${optionText}`);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    //Hàm chọn ngày trong custom range
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
        await this.pickDate(1, start);
        await this.pickDate(2, end);
    }
    //Click vào Incident detail hoặc bất kỳ link nào có text cụ thể
    async clickLinkByText(text: string, index: number = 0): Promise<void> {
        const links = this.linkByText(text);

        await links.first().waitFor({
            state: "visible",
            timeout: 15000,
        });
        const count = await links.count();

        if (count <= index) {
            throw new Error(`Không tìm thấy link: ${text}, count=${count}, index=${index}`);
        }
        const target = links.nth(index);
        await target.scrollIntoViewIfNeeded();
        await target.click();
    }
    //#endregion
    //#region Actions
    //Gộp chung 1 table
    async performAction(action: string, value: string, startDate?: string, endDate?: string) {
        const actions: Record<string, () => Promise<void>> = {
            tab: async () => this.clictab(value),

            combobox: async () => this.clickButtonBycombobox(value),

            option: async () => this.selectOptionFromCombobox(value),

            timerange: async () => this.selectTimerange(value),

            custom: async () => this.clickCustomrange(value),

            dateRange: async () => {
                if (!startDate || !endDate) {
                    throw new Error("Missing startDate or endDate");
                }
                await this.selectDateRange(startDate, endDate);
                await this.clickSaveDateRange();
            },

            link: async () => this.clickLinkByText(value),
            priorityStep: async () => this.clickPriorityStep(),
            step: async () => this.clickButtonViewlog(value),
        };

        const fn = actions[action];

        if (!fn) {
            throw new Error(`Unknown action: ${action}`);
        }

        await fn();
    }
    //#endregion
    //#region Actions
    // Input email to login
    async fillInGeneralInputField(nameOrId: string, value: string | null) {
        if (!value) return;
        const input = this.txtGeneralInputField(nameOrId);
        await input.waitFor({ state: "visible" });
        await input.fill(value);
    }
    //#endregion
}
