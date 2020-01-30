using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using System.Net.Http;
using System.Text;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.QueryPathMatch
{
    public partial class QueryPathMatchFixture_Fixture : FeatureFixture
    {
        private readonly HttpClient Client;
        private HttpContent Content;
        private HttpResponseMessage PostResult;
        private string queryStringMatch = "{\r\n  \"animal-type\": \"cat\"\r\n}";

        public QueryPathMatchFixture_Fixture()
        {
            Client = new HttpClient();
        }

        private void When_setup_query_content_starts()
        {
            Content = new StringContent(CommonData.GetMockDefinitionText(CommonData.MockDefinition.QueryMock),
                Encoding.UTF8, "application/json");
            PostResult = Client.PostAsync(CommonData.AdminUri, Content).Result;
        }

        private void When_client_returns_all_queries()
        {
            var mockDefinitionQueryJson = JObject.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.QueryMock));
            var scenarios = mockDefinitionQueryJson["scenarios"];
            var scenario = scenarios[1];
            var request = new HttpRequestMessage(new HttpMethod(scenario["verb"].ToString()), CommonData.AdminUri + scenario["path"]);
            var response = Client.SendAsync(request).Result;
            var scenarioResponse = scenario["response"].ToObject<MockResponse>();
            var scenarioBody = JObject.Parse(scenarioResponse.Body);
            var responseBody = JObject.Parse(response.Content.ReadAsStringAsync().Result);
            var responseQuery = JObject.Parse(responseBody["scenarios"][1]["requestMatchRules"]["queryRules"].ToString());

            Assert.Equal(scenarioResponse.Status, (int)response.StatusCode);
            Assert.Equal(queryStringMatch, responseQuery.ToString());
            var responseBodySelected = JObject.Parse(responseBody["scenarios"][1]["response"]["body"].ToString());
            Assert.True(JToken.DeepEquals(scenarioBody, responseBodySelected));
        }
    }
}
