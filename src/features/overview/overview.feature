Feature: Kafka Monitor on Overview

    @totalpendinglag
    Scenario: Total pending lag
        Given I login to system with tenant "Thailand"
        When I perform overview actions:
            | action          | value             |
            | tab             | Overview          |
            | totalPendingLag | Total Pending Lag |
        Then "Total Pending Lag" card border turns blue

    @criticalissues
    Scenario: Critical Issues
        Given I login to system with tenant "Thailand"
        When I perform overview actions:
            | action          | value           |
            | tab             | Overview        |
            | totalPendingLag | Critical Issues |
        Then "Critical Issues" card border turns blue

    @filtertenant1country
    Scenario: Filter Tenant when user select 1 country
        Given I login to system with tenant "Thailand"
        When I perform overview actions:
            | action               | value         |
            | tab                  | Overview      |
            | dropdownTenantFilter | All Countries |
            | checkbox             | Malaysia      |
        Then I verify country filter displays "1 Country"


