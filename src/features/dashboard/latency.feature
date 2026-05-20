Feature: Latency on Dashboard

    @verifylatencywithfilter
    Scenario: Latency
        Given I login to system with tenant "Thailand"
        And I click filter "latency-section"
        And I selects "<option>" option on filter
        And I select "<timerange>" timerange "<datatestid>"
        Examples:
            | option       | timerange | datatestid      |
            | Yara Connect | 30d       | latency-section |

    @verifytopservicelatencywithfilter
    Scenario: Latency top service
        Given I login to system with tenant "Thailand"
        And From "<datatestid>" I click "<text>"
        And I click to close popup Services latency
        Examples:
            | datatestid      | text              |
            | latency-section | View all services |