Feature: Dashboard Page

    @OverallAvailability
    Scenario: Overall Availability
        Given user is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And user should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click filter
        And I selects option "<option>" on filter
        Examples:
            | tenant    | option              | nameoffilter           |
            | Indonesia | All DVCS            | space-y-2              |
            | Indonesia | Yara Connect        | space-y-3 lg:space-y-5 |
            | Indonesia | Yara Farmcare       |                        |
            | Indonesia | Admin Portal Webapp |                        |
            | Indonesia | Heartbeat           |                        |

    @latency
    Scenario: Latency
        Given user is on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And user should be on dashboard
        And I click button to select tenant
        And I selects tenant "<tenant>"
        And I click open filter
        And I selects option "<option>" on filter
        Examples:
            | tenant | option              |
            | India  | All DVCS            |
            | India  | Yara Connect        |
            | India  | Yara Farmcare       |
            | India  | Admin Portal Webapp |
            | India  | Heartbeat           |


