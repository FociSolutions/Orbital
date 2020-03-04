using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Timers;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.PolicyMatch
{
    public partial class PolicyMatchFixture_Feature : FeatureFixture
    {
        private readonly HttpClient client;
        private Scenario scenario;
        private HttpRequestMessage request;
        private HttpResponseMessage response;
        private JToken responseBody;
        private JToken mockDefinitionUrlJson;
        private Stopwatch requestStopwatch;

        public PolicyMatchFixture_Feature()
        {
            this.client = new HttpClient();
            this.mockDefinitionUrlJson = JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.PolicyMock));
            var mockDefinition = this.mockDefinitionUrlJson.ToObject<MockDefinition>();
            this.scenario = mockDefinition.Scenarios[0];
            this.request = new HttpRequestMessage(new HttpMethod(this.scenario.Verb.ToString()), $"{CommonData.ServerBaseUri}{this.scenario.Path}");
            this.requestStopwatch = new Stopwatch();
        }

        private void Given_the_server_has_a_mockdefinition_with_a_delay_policy()
        {
            var content = new StringContent(this.mockDefinitionUrlJson.ToString(),
                Encoding.UTF8, "application/json");
            _ = this.client.PostAsync(CommonData.AdminUri, content).Result;
        }


        private void When_the_client_sends_the_request()
        {
            requestStopwatch.Start();
            this.response = this.client.SendAsync(this.request).Result;
        }

        private void Then_the_response_is_delayed_by_five_seconds()
        {
            requestStopwatch.Stop();
            Assert.True(requestStopwatch.ElapsedMilliseconds >= 5000);
        }

        private void And_the_response_is_equal_to_the_scenario_expected_response()
        {
            var ExpectedResponse = this.scenario.Response;
            Assert.Equal(ExpectedResponse.Status, (int)this.response.StatusCode);
            responseBody = JToken.Parse(this.response.Content.ReadAsStringAsync().Result);
            Assert.True(JToken.DeepEquals(JToken.Parse(ExpectedResponse.Body), responseBody));
            foreach (var key in this.scenario.Response.Headers.Keys)
            {
                Assert.True(this.response.Headers.TryGetValues(key, out var ActualValues));
                Assert.Contains(this.scenario.Response.Headers[key], ActualValues);
            }
        }
    }
}
