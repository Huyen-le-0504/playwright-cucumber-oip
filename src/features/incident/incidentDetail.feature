Feature: Incident Detail on Incident Page


    @Incidentdetailcustomrange
    Scenario Outline: Open incident and handle workflow
        Given I login to system with tenant "India"
        When I perform actions:
            | action       | value     | startDate   | endDate   |
            | tab          | Incidents |             |           |
            | custom       |           |             |           |
            | dateRange    |           | <startDate> | <endDate> |
            | link         | 3         |             |           |
            | priorityStep |           |             |           |
            | step         | View more |             |           |
            | step         | View      |             |           |

        Examples:
            | startDate  | endDate    |
            | 2026-02-01 | 2026-04-05 |

    @Incidentdetailtimerange
    Scenario Outline: Open incident and handle workflow
        Given I login to system with tenant "Thailand"
        When I perform actions:
            | action       | value     | datatestid              |
            | tab          | Incidents |                         |
            | timerange    | 7d        | date-range-quick-filter |
            | link         | 3         |                         |
            | priorityStep |           |                         |
            | step         | View more |                         |
            | step         | View      |                         |

    @Incidentdetailaddcmt
    Scenario Outline: Open incident detail and add comment
        Given I login to system with tenant "India"
        When I perform actions:
            | action              | value           | datatestid           |
            | tab                 | Incidents       |                      |
            | timerange           | 30d             | specific-user-filter |
            | link                | 3               |                      |
            | openTelemetryButton | Add Comment     |                      |
            | addComment          | test automation |                      |
            | confirmaddcoment    | Add Comment     |                      |


    @Incidentdetailmarkinprogress
    Scenario Outline: Open incident detail and mark as in progress
        Given I login to system with tenant "Thailand"
        When I perform actions:
            | action              | value            | datatestid           |
            | tab                 | Incidents        |                      |
            | timerange           | 30d              | specific-user-filter |
            | link                | 3                |                      |
            | openTelemetryButton | Mark in Progress |                      |


    @Incidentdetailmarkasresolved
    Scenario Outline: Open incident detail and mark as resolved
        Given I login to system with tenant "India"
        When I perform actions:
            | action              | value            | datatestid           |
            | tab                 | Incidents        |                      |
            | timerange           | 30d              | specific-user-filter |
            | link                | 6                |                      |
            | openTelemetryButton | Mark as Resolved |                      |
