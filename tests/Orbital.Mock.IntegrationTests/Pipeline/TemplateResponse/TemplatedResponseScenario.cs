using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.TemplateResponse
{
    [FeatureDescription(
@"When I hit a mocked service
As a client
I want to receive the correct response with the templated data provided in my request")]
    public partial class TemplatedResponseFixture_Feature
    {
        [Scenario]
        [ClearServerScenarioDecorator]
        public void Successful_teplated_response()
        {
            Runner.RunScenario(
                    Given_the_server_has_a_mock_definition_with_scenarios_with_templated_response,
                    Given_the_request_contains_the_templated_data,
                    When_the_client_sends_the_request,
                    Then_the_response_is_contains_data_from_the_request_body
            );
        }
    }
}
