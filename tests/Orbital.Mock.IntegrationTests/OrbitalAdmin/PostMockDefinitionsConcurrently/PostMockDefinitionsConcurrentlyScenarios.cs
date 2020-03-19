using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PostMockDefinitionsConcurrently
{
    [FeatureDescription(
        @"The client should be able to send 50 Mockdefinitions at the same time to the server
          and the server should store and retrieve all Mockdefinitions")]
    [Label("Story-1")]
    public partial class PostMockDefinitionsConcurrently_Feature
    {
        [Scenario]
        [Label("Ticket-1")]
        [ClearServerScenarioDecorator]
        public void Post_Multiple_Mockdefinitions_Concurrently()
        {
            Runner.RunScenario(
                When_the_client_posts_many_mock_definitions_by_id,
                When_the_client_requests_all_mock_definitions,
                Then_the_getall_operation_should_be_successful,
                Then_the_getall_operation_returns_all_mock_definitions);
        }
    }
}