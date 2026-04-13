Feature: Dashboard Page

    @OverallAvailability
    Scenario: Overall Availability
        Given I is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click filter "<filter>"
        And I selects option "<option>" on filter
        Examples:
            | tenant    | option       | filter                       |
            | Indonesia | Yara Connect | overall-availability-section |
    # | Indonesia | All DVCS     | overall-availability-section |
    # | Indonesia | Yara Farmcare       |overall-availability-section |
    # | Indonesia | Admin Portal Webapp |overall-availability-section |
    # | Indonesia | Heartbeat           |overall-availability-section |

    @latency
    Scenario: Latency
        Given I is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click filter "latency-section"
        And I selects option "<option>" on filter
        And I select "<timerange>" timerange "<datatestid>"
        Examples:
            | tenant | option       | timerange | datatestid      |
            | India  | Yara Connect | 30d       | latency-section |
    # | India  | All DVCS            |           |                 |
    # | India  | Yara Farmcare       |           |                 |
    # | India  | Admin Portal Webapp |           |                 |
    # | India  | Heartbeat           |           |                 |

    @module
    Scenario: Module
        Given I is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I select "<timerange>" timerange "<datatestid>"
        And I click status modules if they have value
        Examples:
            | tenant | timerange | timerange | datatestid          |
            | India  | 30d       | 24h       | last-results-filter |




