import { Page, Locator } from "playwright/test";
import * as dotenv from "dotenv";
import { BasePage } from "../dynamicLocator/basePage";
dotenv.config(); // Load environment variables from .env

export class BaseIncident {
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
    btnByText = (text: string) => this.page.locator(`xpath=(//button[@type="submit" and normalize-space()="${text}"])`);
    addcommenttotextbox = () => this.page.locator(`xpath=(//div[contains(@class,'min-h-[110px]')]//textarea)`);
    tabmenu = (tab: string) => this.page.locator(`xpath=(//p[normalize-space()="${tab}"])`);
    customrange = () => this.page.locator(`xpath=(//div[@class="flex flex-1 flex-row items-center gap-2"]//button[@type="button"]//div[normalize-space()="Custom range"])`);
    saveButton = () => this.page.locator('//button[.//text()="Save"]');
    btnviewlog = (text: string) => this.page.locator(`xpath=((//button[normalize-space()="${text}"])[1])`);
    btnAddComment = (btnactive: string) => this.page.locator(`xpath=(//div[contains(text(),"OpenTelemetry")]/following::button[contains(., "${btnactive}")][1])`);
    btnConfirmAddComment = (confirmaddcomment: string) => this.page.locator(`xpath=(//div[contains(@class,'flex items-center gap-4')]//button[normalize-space(.)='${confirmaddcomment}'])`);
    //#endregion
    //#region Actions
    //Click link "Incident Detail"
    async clickButtonByText(text: string): Promise<void> {
        const button = this.btnByText(text);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click to select tab at menutab
    async clictab(tabName: string): Promise<void> {
        const button = this.tabmenu(tabName);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }

    //Click to open custom range
    async clickCustomrange(datetime: string): Promise<void> {
        const button = this.customrange();
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //Click steps in workflow
    async clickStepOfWorkflow(stepName: string): Promise<void> {
        const step = this.page.locator(`text=${stepName}`).first();
        await step.waitFor({ state: "visible", timeout: 10000 });
        await step.scrollIntoViewIfNeeded();
        await step.click();
    }
    //Click to view log warning or error step
    async clickPriorityStep(): Promise<void> {
        const steps = this.page.locator("div.flex.grow.items-center");

        await steps.first().waitFor({ state: "visible", timeout: 10000 });

        const total = await steps.count();
        console.log("Total steps:", total);

        let yellowCandidate: any = null;

        for (let i = 0; i < total; i++) {
            const step = steps.nth(i);
            const hasRed = await step.locator(".text-\\[\\#C2451E\\], .text-\\[\\#C2451E\\] *").count();
            if (hasRed > 0) {
                console.log("Found RED step at workflow", i);
                await step.scrollIntoViewIfNeeded();
                await step.click();
                return;
            }
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
    //Click to view more log if log > 5 lines
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
    //Select tenant option
    async selectOptionFromCombobox(optionText: string): Promise<void> {
        const option = this.page.locator(`text=${optionText}`);
        await option.waitFor({ state: "visible", timeout: 30000 });
        await option.click();
    }
    //Function to pick date in custom range
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
    async selectDateRange(start: string, end: string) {
        await this.pickDate(1, start);
        await this.pickDate(2, end);
    }
    async clickSaveDateRange() {
        await this.saveButton().waitFor({ state: "visible" });
        await this.saveButton().click();
    }

    //Click Incident detail or any link has text
    async clickLinkByIndex(index: number): Promise<void> {
        const items = this.page.locator('[data-testid="incident-item"]');

        const count = await items.count();

        if (count === 0) {
            throw new Error("No incident items found - page not loaded or wrong tab");
        }

        const item = items.nth(index);

        const link = item.locator("a", { hasText: "Incident Detail" });

        await link.waitFor({ state: "visible", timeout: 15000 });
        await link.scrollIntoViewIfNeeded();
        await link.click();
    }
    //#endregion
    //#region Actions
    //Merge the data into a table
    async performAction(action: string, value: string, datatestid: string, startDate?: string, endDate?: string) {
        const actions: Record<string, () => Promise<void>> = {
            tab: async () => this.clictab(value),
            combobox: async () => this.basePage.clickButtonBycombobox(value),
            option: async () => this.selectOptionFromCombobox(value),
            timerange: async () => this.basePage.selectTimerange(datatestid, value),
            custom: async () => this.clickCustomrange(value),
            dateRange: async () => {
                if (!startDate || !endDate) {
                    throw new Error("Missing startDate or endDate");
                }
                await this.selectDateRange(startDate, endDate);
                await this.clickSaveDateRange();
            },
            link: async () => this.clickLinkByIndex(parseInt(value)),
            priorityStep: async () => this.clickPriorityStep(),
            step: async () => this.clickButtonViewlog(value),
            openTelemetryButton: async () => {
                const btn = this.btnAddComment(value);

                if (value === "Add Comment") {
                    await btn.waitFor({ state: "visible", timeout: 10000 });
                    await btn.click();
                    return;
                }
                if (value === "Mark in progress" || value === "Mark as resolved") {
                    try {
                        await btn.waitFor({ state: "visible", timeout: 10000 });
                        await btn.click();
                    } catch {
                        await this.basePage.breadcrumb("Incidents").click();
                    }
                    return;
                }
                await btn.waitFor({ state: "visible", timeout: 10000 });
                await btn.click();
            },
            addComment: async () => this.fillInGeneralInputField(value),
            confirmaddcoment: async () => this.clickButtonConfirmAddComment(value),
        };
        const fn = actions[action];
        if (!fn) {
            throw new Error(`Unknown action: ${action}`);
        }
        await fn();
    }
    //#endregion
    //#region Actions
    // Input data into general input field (Add comment)
    async fillInGeneralInputField(value: string | null) {
        if (!value) return;
        const input = this.addcommenttotextbox();
        await input.waitFor({
            state: "visible",
            timeout: 10000,
        });
        await input.click();
        await input.fill(value);
    }
    //Confirmto add comment to incident
    async clickButtonConfirmAddComment(confirmaddcomment: string): Promise<void> {
        const button = this.btnConfirmAddComment(confirmaddcomment);
        await button.waitFor({ state: "visible", timeout: 10000 });
        await button.click();
    }
    //#endregion
}
