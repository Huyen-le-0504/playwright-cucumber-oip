Feature: Module on Dashboard

    @verifylistofmoduleswithfilter
    Scenario: Module
        Given I login to system with tenant "Thailand"
        And I select "<timerange>" timerange "<datatestid>"
        And I click status modules if they have value
        Examples:
            | timerange | datatestid          |
            | 30d       | last-results-filter |

    @verifyexpandorcollapsemodule
    Scenario: Expand or collapse module
        Given I login to system with tenant "Thailand"
        And I click to collapse or expand project "<project>"
        And I click to expand module "<module>"
        Examples:
            | tenant   | project       | module                   |
            | Thailand | Yara Farmcare | YC - Identity Management |

    @verifybmodulewhenclickbarchart
    Scenario Outline: verify submodule when click bar chart
        Given I login to system with tenant "Thailand"
        And I select "<timerange>" timerange "<datatestid>"
        And I click barchart <barchartindex> in module or submodule "<barchart>"
        Examples:
            | timerange | datatestid          | barchart               | barchartindex |
            | 30d       | last-results-filter | YFC - Campaign manager | 1             |

    @verifybmodulewhenclickboxstatus
    Scenario Outline: verify submodule when click status box
        Given I login to system with tenant "India"
        And I select "<timerange>" timerange "<datatestid>"
        And I click status box <index> in module or submodule "<submodule>"
        Examples:
            | timerange | datatestid          | submodule        | index |
            | 30d       | last-results-filter | YC - Home Screen | 1     |




