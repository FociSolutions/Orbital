﻿using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.DefaultScenarioMatch
{
    [FeatureDescription(
@"When I hit a mocked service
As a client
I want to receive the correct response based on my request url")]
    public partial class DefaultScenarioMatchFixture_Feature
    {
        [Scenario]
        [ClearServerScenarioDecorator]
        public void Successful_default_scenario_match()
        {
            Runner.RunScenario(
                    Given_the_server_has_a_mock_definition_with_scenarios_with_a_default_scenario_to_match_against,
                    When_the_client_sends_the_request,
                    Then_the_response_is_equal_to_the_scenario_expected_response
            );
        }
    }
}
