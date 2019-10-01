using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.GetMockDefinitionById
{
    [FeatureDescription(
        @"In order to view a mock definition loaded on the server
        a client hits the getbyid orbital admin endpoint")]
    [Label("Story-1")]
    public partial class GetMockDefinitionById_Feature
    {
        [Scenario]
        [Label("Ticket-1")]
        [ClearServerScenarioDecorator]
        public void No_mock_definition_loaded()
        {
            Runner.RunScenario(
                When_the_client_requests_a_mock_definition_by_id,
                Then_the_get_operation_returns_no_content_response);
        }
    }

}