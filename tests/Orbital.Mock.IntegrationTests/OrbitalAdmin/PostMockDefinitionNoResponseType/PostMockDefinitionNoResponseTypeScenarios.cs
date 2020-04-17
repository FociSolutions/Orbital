using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PostMockDefinitionNoResponseType
{
    [FeatureDescription(
        @"In order to add a mock definition on the server
        a client hits the post orbital admin endpoint")]
    [Label("Story-1")]
    public partial class PostMockDefinitionNoResponseType_Feature
    {
        [Scenario]
        [Label("Ticket-1")]
        [ClearServerScenarioDecorator]
        public void Post_mockdefinition_with_no_response_type()
        {
            Runner.RunScenario(
                When_the_client_posts_a_mock_definition_with_no_response_type,
                Then_the_post_operation_returns_created,
                Then_the_get_operation_returns_mock_with_responsetype_custom);
        }
    }

}