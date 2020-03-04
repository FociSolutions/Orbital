using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.PolicyMatch
{
    [FeatureDescription(
@"When I hit a mocked service
As a client
I want to receive the correct response based on my request url
And the response should be delayed due to the policy")]
    public partial class PolicyMatchFixture_Feature
    {
        [Scenario]
        [ClearServerScenarioDecorator]
        public void Successful_url_match()
        {
            Runner.RunScenario(
                    Given_the_server_has_a_mockdefinition_with_a_delay_policy,
                    When_the_client_sends_the_request,
                    Then_the_response_is_delayed_by_five_seconds,
                    And_the_response_is_equal_to_the_scenario_expected_response
            );
        }
    }
}
