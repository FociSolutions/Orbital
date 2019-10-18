using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;

namespace Orbital.Mock.IntegrationTests.Pipeline.EndpointMatch
{
    [FeatureDescription(
        @"When accessing a URL which contains a parameter, the correct scenario should be chosen which
          corresponds to that parameter.")]
    public partial class EndpointMatchFixtureFeature
    {
        [Scenario]
        [ClearServerScenarioDecorator]
        public void Endpoint_successful_match()
        {
            Runner.RunScenario(
                Given_a_mock_definition_with_a_parameterized_URL_component,
                Given_the_mock_definition_has_been_successfully_added,
                When_the_client_sends_a_get_request_with_a_parameterizable_component,
                Then_the_response_should_contain_the_scenario_body,
                When_the_client_sends_a_get_request_with_a_non_parameterizable_component,
                Then_the_response_should_not_contain_the_scenario_body);
        }
    }
}