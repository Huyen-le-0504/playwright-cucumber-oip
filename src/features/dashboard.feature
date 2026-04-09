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
        Examples:
            | tenant    |
            | Indonesia |
# | India     |
# | Thailand  |
# | Kenya     |
# | Tanzania  |
