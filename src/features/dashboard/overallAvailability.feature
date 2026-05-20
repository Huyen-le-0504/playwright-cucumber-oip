Feature: Overall Availability on Dashboard

    @verifyoverallavailabilitywithfilter
    Scenario: Overall Availability
        Given I login to system with tenant "Thailand"
        And I click filter "<filter>"
        And I selects "<option>" option on filter
        Examples:
            | tenant   | option       | filter                       |
            | Thailand | Yara Connect | overall-availability-section |

    @verifyoverallavailabilitywithfilter
    Scenario: Overall Availability with filter
        Given I login to system with tenant "Thailand"
        And I click filter "<filter>"
        And I selects "<option>" option on filter
        Examples:
            | tenant   | option       | filter                       |
            | Thailand | Yara Connect | overall-availability-section |
