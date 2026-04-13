Feature: Dashboard Page

    @OverallAvailability
    Scenario: Overall Availability
        Given user is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click filter "overall-availability-section"
        And I selects option "<option>" on filter
        Examples:
            | tenant    | option              |
            | Indonesia | All DVCS            |
            | Indonesia | Yara Connect        |
            | Indonesia | Yara Farmcare       |
            | Indonesia | Admin Portal Webapp |
            | Indonesia | Heartbeat           |

    @latency
    Scenario: Latency
        Given user is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click filter "latency-section"
        And I selects option "<option>" on filter
        Examples:
            | tenant | option              |
            | India  | All DVCS            |
            | India  | Yara Connect        |
            | India  | Yara Farmcare       |
            | India  | Admin Portal Webapp |
            | India  | Heartbeat           |

# @Module
# Scenario: Module
#     Given user is on dashboard
#     When I fill input "email" with "huyen.le@yara.com"
#     And I click button "Send login link"
#     And I wait for magic link and navigate
#     And I should be on dashboard
#     And I click button to select tenant
#     And I selects tenant "<tenant>"
#     And I select timerange "<timerange>"
#     Examples:
#         | tenant | timerange |
#         | India  | 30d       |




