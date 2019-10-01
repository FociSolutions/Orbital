using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.DeleteMockDefinition
{
    [FeatureDescription(
        @"In order to delete a mock definition loaded on the server
        a client hits the delete orbital admin endpoint")]
    [Label("Story-1")]
    public partial class DeleteMockDefinition_Feature
    {

        [Scenario]
        [Label("Ticket-1")]
        [ClearServerScenarioDecorator]
        public void No_mock_definitions_loaded()
        {
            Runner.RunScenario(
                When_the_client_deletes_a_mock_definition_by_id,
                Then_the_delete_operation_returned_ok);
        }
    }

}