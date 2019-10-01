using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.HeaderPathMatch
{
    [FeatureDescription(
@"When I hit a mocked service
As a client
I want to receive the correct response based on my request headers")]
    public partial class HeaderPathMatchFixture_Feature
    {
        [Scenario]
        [ClearServerScenarioDecorator]
        public void Successful_header_match()
        {
            Runner.RunScenario(
                    Given_the_server_has_a_mock_definition_with_scenarios_with_header_rules_to_match_against,
                    Given_the_request_matches_against_a_scenario,
                    When_the_client_sends_the_request,
                    Then_the_response_is_equal_to_the_scenario_expected_response
            );
        }

        [Scenario]
        [ClearServerScenarioDecorator]
        public void Unsuccessful_header_match_request_has_different_header_values()
        {
            Runner.RunScenario(
                Given_the_server_has_a_mock_definition_with_scenarios_with_header_rules_to_match_against,
                Given_the_request_header_values_do_not_match_against_a_scenario,
                When_the_client_sends_the_request,
                Then_the_response_should_be_a_bad_request
            );
        }

        [Scenario]
        [ClearServerScenarioDecorator]
        public void Unsuccessful_header_match_request_has_different_header_keys()
        {
            Runner.RunScenario(
                Given_the_server_has_a_mock_definition_with_scenarios_with_header_rules_to_match_against,
                Given_the_request_header_keys_do_not_match_against_a_scenario,
                When_the_client_sends_the_request,
                Then_the_response_should_be_a_bad_request
            );
        }
    }
}