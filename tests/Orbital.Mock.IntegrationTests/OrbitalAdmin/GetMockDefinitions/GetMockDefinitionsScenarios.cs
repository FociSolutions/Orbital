using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.GetMockDefinitions
{
    [FeatureDescription(
        @"In order to view the mock definitions loaded on the server
        a client hits the getall orbital admin endpoint")]
    [Label("Story-1")]
    public partial class GetMockDefinitions_Feature
    {
        [Scenario]
        [Label("Ticket-1")]
        [ClearServerScenarioDecorator]
        public void No_mock_definitions_loaded()
        {
            Runner.RunScenario(
                When_the_client_request_all_mock_definitions,
                Then_the_getall_operation_should_be_successful,
                Then_the_getall_operation_returned_empty_list);
        }
    }
}