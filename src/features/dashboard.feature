Feature: Dashboard Page

    @Login
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
            | tenant    | option              |
            | Indonesia | All DVCS            |
            | Indonesia | Yara Connect        |
            | Indonesia | Yara Farmcare       |
            | Indonesia | Admin Portal Webapp |
            | Indonesia | Heartbeat           |
# | India     |
# | Thailand  |
# | Kenya     |
# | Tanzania  |
