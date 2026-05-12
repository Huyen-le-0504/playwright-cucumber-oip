Feature: Dashboard Page

    Background: login and select tenant
        Given I am on dashboard
        When I fill input "email" with "huyen.le@yara.com"
        And I click button "Send login link"
        And I wait for magic link and navigate
        And I should be on dashboard
        And I click button to select tenant


    #Overall Availability
    @verifyoverallavailabilitywithfilter
    Scenario: Overall Availability
        And I selects tenant "<tenant>"
        And I click filter "<filter>"
        And I selects "<option>" option on filter
        Examples:
            | tenant    | option       | filter                       |
            | Indonesia | Yara Connect | overall-availability-section |

    @verifyoverallavailabilitywithfilter
    Scenario: Overall Availability with filter
        And I selects tenant "<tenant>"
        And I click filter "<filter>"
        And I selects "<option>" option on filter
        Examples:
            | tenant    | option       | filter                       |
            | Indonesia | Yara Connect | overall-availability-section |


    #latency
    @verifylatencywithfilter
    Scenario: Latency
        And I selects tenant "<tenant>"
        And I click filter "latency-section"
        And I selects "<option>" option on filter
        And I select "<timerange>" timerange "<datatestid>"
        Examples:
            | tenant | option       | timerange | datatestid      |
            | India  | Yara Connect | 30d       | latency-section |

    @verifytopservicelatencywithfilter
    Scenario: Latency top service
        And I selects tenant "India"
        And I click view all services
        And I click to close popup Services latency


    #modules/submodules
    @verifylistofmoduleswithfilter
    Scenario: Module
        And I selects tenant "<tenant>"
        And I click view all services
        And I click to close popup Services latency
        And I select "<timerange>" timerange "<datatestid>"
        And I click status modules if they have value
        Examples:
            | tenant | timerange | datatestid          |
            | India  | 30d       | last-results-filter |

    @verifyexpandorcollapsemodule
    Scenario: Expand or collapse module
        And I selects tenant "<tenant>"
        And I click to collapse or expand project "<project>"
        And I click to expand module "<module>"
        Examples:
            | tenant    | project       | module                   |
            | Indonesia | Yara Farmcare | YC - Identity Management |

    @verifysubmodulewithtimerange
    Scenario: verify submodule with timerange
        And I selects tenant "<tenant>"
        And I click to expand module "<module>"
        And I click "<submodule>" submodule
        And I select "<timerange>" timerange "<datatestid>"
        Examples:
            | tenant   | module                 | submodule | timerange | datatestid          |
            | Thailand | YFC - Campaign manager | Rewards   | 30d       | last-results-filter |

    @verifysubmodulerunresults
    Scenario: verify submodule run results
        And I selects tenant "<tenant>"
        And I click to expand module "<module>"
        And I click "<submodule>" submodule
        And I select "<timerange>" timerange "<datatestid>"
        And I click "<runresult>" run result
        And I click to expand run result at "<titleresult>"
        Examples:
            | tenant   | module                 | submodule | timerange | datatestid          | runresult | titleresult        |
            | Thailand | YFC - Campaign manager | Rewards   | 30d       | last-results-filter | 2         | JSON API Response: |




