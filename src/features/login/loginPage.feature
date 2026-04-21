Feature: Login Page

    @Login
    Scenario: Login
        Given I am on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard






