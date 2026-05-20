Feature: Incident History on Incident Page

    @Incidentselecttimerange
    Scenario Outline: Select timerange
        Given I login to system with tenant "Thailand"
        When I perform actions:
            | action    | value     |
            | tab       | Incidents |
            | timerange | <range>   |

        Examples:
            | range |
            | 1h    |
            | 24h   |
            | 7d    |
            | 30d   |


    @Incidentselectcustomrange
    Scenario Outline: Select custom date range and open incident
        Given I login to system with tenant "Thailand"
        When I perform actions:
            | action    | value     | startDate   | endDate   |
            | tab       | Incidents |             |           |
            | custom    |           |             |           |
            | dateRange |           | <startDate> | <endDate> |
            | link      | 2         |             |           |

        Examples:
            | startDate  | endDate    |
            | 2026-02-01 | 2026-04-05 |

