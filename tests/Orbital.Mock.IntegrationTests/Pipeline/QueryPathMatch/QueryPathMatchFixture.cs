using System.Text;
using System.Net.Http;

using Orbital.Mock.Definition;

using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.QueryPathMatch
{
    public partial class QueryPathMatchFixture_Fixture : FeatureFixture
    {
        private readonly HttpClient Client;
        private Scenario scenario;
        private HttpResponseMessage PostResult;
        private JToken mockDefinitionQueryJson;

        public QueryPathMatchFixture_Fixture()
        {
            Client = new HttpClient();
        }

        private void When_setup_query_content_starts()
        {
            this.mockDefinitionQueryJson = JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.QueryMock));
            var mockDefinition = this.mockDefinitionQueryJson.ToObject<MockDefinition>();
            this.scenario = mockDefinition.Scenarios[0];
            var content = new StringContent(this.mockDefinitionQueryJson.ToString(),
                Encoding.UTF8, "application/json");
            PostResult = Client.PostAsync(CommonData.AdminUri, content).Result;
        }

        private void When_client_returns_all_queries()
        {
            var mockDefinitionQueryJson = JObject.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.QueryMock));
            var scenarios = mockDefinitionQueryJson["scenarios"];
            var request = new HttpRequestMessage(new HttpMethod(this.scenario.Verb.ToString()), $"{CommonData.ServerBaseUri}{this.scenario.Path}");
            var response = Client.SendAsync(request).Result;
            var ExpectedResponse = this.scenario.Response;
            var scenarioBody = JToken.Parse(ExpectedResponse.Body);
            var responseBody = JToken.Parse(response.Content.ReadAsStringAsync().Result);

            Assert.Equal(ExpectedResponse.Status, (int)response.StatusCode);

            Assert.True(JToken.DeepEquals(JToken.Parse(ExpectedResponse.Body), responseBody));
        }
    }
}
