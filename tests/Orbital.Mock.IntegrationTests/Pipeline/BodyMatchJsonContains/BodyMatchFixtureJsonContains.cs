using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.BodyMatchJsonContains
{
    [FeatureDescription(
        @"When GETting a mock definition from the server with a body, the server will
        respond with the appropriate scenario response")]
    public partial class BodyMatchFixtureJsonContains_Feature
    {
        [Scenario]
        [ClearServerScenarioDecorator]
        public void Body_successful_match()
        {
            Runner.RunScenario(
                Given_a_mock_definition_with_a_body_response,
                Given_the_mock_definition_has_been_successfully_added,
                When_the_client_sends_a_get_request_with_a_body,
                Then_the_response_should_contain_the_scenario_body);
        }
    }
}