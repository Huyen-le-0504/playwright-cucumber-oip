Feature: Overall Availability on Dashboard

    @verifyuptimematchwithAPI
    Scenario: Verify Overall Availability uptime for Last 24h
        Given I login to system with tenant "Thailand"
        And I click filter "<filter>"
        And I selects "<option>" option on filter
        Then I verify uptime for "<timeLabel>" matches API field "<timerange>"
        Examples:
            | tenant   | option   | filter                       | timeLabel | timerange |
            | Thailand | All DVCS | overall-availability-section | Last 1h:  | 1h        |
            | Thailand | All DVCS | overall-availability-section | Last 24h: | 24h       |
            | Thailand | All DVCS | overall-availability-section | Last 7d:  | 7d        |
            | Thailand | All DVCS | overall-availability-section | Last 30d: | 30d       |


