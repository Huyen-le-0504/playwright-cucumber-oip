Feature: Incident Page

    @Incidentselecttimerange
    Scenario: Incidentselecttimerange
        Given user is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And user should be on dashboard
        And I click tab "Incidents" to menutab
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I selects timerange "<timerange>"
        Examples:
            | tenant    | timerange |
            | Indonesia | 1h        |
            | Indonesia | 24h       |
            | Indonesia | 7d        |
            | Indonesia | 30d       |

    @Incidentselectcustomrange
    Scenario: Incidentselectcustomrange
        Given user is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And user should be on dashboard
        And I click tab "Incidents" to menutab
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click custom range
        And I selects and saves date range from "<startDate>" to "<endDate>"
        Examples:
            | tenant    | startDate  | endDate    |
            | Indonesia | 2026-02-01 | 2026-04-05 |
            | India     | 2026-04-05 | 2026-04-09 |
            | Thailand  | 2026-03-25 | 2026-04-08 |
            | Kenya     | 2026-04-05 | 2026-04-09 |