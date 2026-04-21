Feature: Incident Page

    Background: login
        Given I am on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard

    @Incidentselecttimerange
    Scenario Outline: Select timerange
        When I perform actions:
            | action    | value     |
            | tab       | Incidents |
            | combobox  | Tenant    |
            | option    | <tenant>  |
            | timerange | <range>   |

        Examples:
            | tenant    | range |
            | Indonesia | 1h    |
            | Indonesia | 24h   |
            | Indonesia | 7d    |
            | Indonesia | 30d   |


    @Incidentselectcustomrange
    Scenario Outline: Select custom date range and open incident
        When I perform actions:
            | action    | value           | startDate   | endDate   |
            | tab       | Incidents       |             |           |
            | combobox  | Tenant          |             |           |
            | option    | <tenant>        |             |           |
            | custom    |                 |             |           |
            | dateRange |                 | <startDate> | <endDate> |
            | link      | Incident Detail |             |           |

        Examples:
            | tenant    | startDate  | endDate    |
            | Indonesia | 2026-02-01 | 2026-04-05 |


    @Incidentdetailcustomrange
    Scenario Outline: Open incident and handle workflow
        When I perform actions:
            | action       | value           | startDate   | endDate   | index |
            | tab          | Incidents       |             |           |       |
            | combobox     | Tenant          |             |           |       |
            | option       | <tenant>        |             |           |       |
            | custom       |                 |             |           |       |
            | dateRange    |                 | <startDate> | <endDate> |       |
            | link         | Incident Detail |             |           | 2     |
            | priorityStep |                 |             |           |       |
            | step         | View more       |             |           |       |
            | step         | View            |             |           |       |

        Examples:
            | tenant | startDate  | endDate    |
            | India  | 2026-02-01 | 2026-04-05 |

    @Incidentdetailtimerange
    Scenario Outline: Open incident and handle workflow
        When I perform actions:
            | action       | value           | index |
            | tab          | Incidents       |       |
            | combobox     | Tenant          |       |
            | option       | <tenant>        |       |
            | timerange    | <timerange>     |       |
            | link         | Incident Detail | 2     |
            | priorityStep |                 |       |
            | step         | View more       |       |
            | step         | View            |       |

        Examples:
            | tenant | timerange |
            | India  | 30d       |


