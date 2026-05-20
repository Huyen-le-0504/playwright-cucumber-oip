Feature: Module on Dashboard

    @verifysubmodulewithtimerange
    Scenario Outline: verify submodule with timerange
        Given I login to system with tenant "Thailand"
        And I click to expand module "<module>"
        And I click "<submodule>" submodule
        And I select "<timerange>" timerange "<datatestid>"
        Examples:
            | module                 | submodule | timerange | datatestid          |
            | YFC - Campaign manager | Rewards   | 30d       | last-results-filter |

    @verifysubmodulerunresults
    Scenario Outline: verify submodule run results
        Given I login to system with tenant "Thailand"
        And I click to expand module "<module>"
        And I click "<submodule>" submodule
        And I select "<timerange>" timerange "<datatestid>"
        And I click "<runresult>" run result
        And I click to expand run result at "<titleresult>"
        Examples:
            | module                 | submodule | timerange | datatestid          | runresult | titleresult        |
            | YFC - Campaign manager | Rewards   | 30d       | last-results-filter | 2         | JSON API Response: |

    @verifysubmodulewhenclickbarchart
    Scenario Outline: verify submodule when click bar chart
        Given I login to system with tenant "India"
        And I select "<timerange>" timerange "<datatestid>"
        And I click to expand module "<module>"
        And I click barchart <barchartindex> in module or submodule "<barchart>"
        Examples:
            | module                 | timerange | datatestid          | barchart | barchartindex |
            | YFC - Campaign manager | 30d       | last-results-filter | Rewards  | 1             |

    @verifysubmodulewhenclickboxstatus
    Scenario Outline: verify submodule when click status box
        Given I login to system with tenant "India"
        And I select "<timerange>" timerange "<datatestid>"
        And I click to expand module "<module>"
        And I click status box <index> in module or submodule "<submodule>"
        Examples:
            | module           | timerange | datatestid          | submodule    | index |
            | YC - Home Screen | 30d       | last-results-filter | Home loading | 1     |



