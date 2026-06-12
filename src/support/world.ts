import { Browser, BrowserContext, Page } from "@playwright/test";
import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { config } from "../support/config";
import { BaseDashboard } from "../pages/dashboard/baseDashboard";
import { BaseIncident } from "../pages/incident/baseIncident";
import { BasePage } from "../pages/dynamicLocator/basePage";
import { BaseOverview } from "../pages/overview/baseOverview";
export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    baseDashboard!: BaseDashboard;
    baseIncident!: BaseIncident;
    basePage!: BasePage;
    baseOverview!: BaseOverview;

    config = config;
    accessToken: string | undefined;

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(CustomWorld);
