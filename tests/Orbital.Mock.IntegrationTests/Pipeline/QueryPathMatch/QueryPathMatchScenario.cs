using LightBDD.Framework;
using LightBDD.Framework.Scenarios;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.QueryPathMatch
{
    [FeatureDescription(
        @"From a mock definition, obtain query values and pass them to the server
        when client hits the post orbital admin endpoint")]
    [Label("Story-3")]
    public partial class QueryPathMatchFixture_Fixture
    {
        [Scenario]
        [Label("Ticket-3")]
        [ClearServerScenarioDecorator]
        public void Mock_definitions_loaded()
        {
            Runner.RunScenario(
                When_setup_query_content_starts,
                When_client_returns_all_queries);
        }
    }
}
