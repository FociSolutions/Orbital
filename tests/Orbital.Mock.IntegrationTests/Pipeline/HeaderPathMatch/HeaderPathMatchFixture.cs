using System.Net;
using System.Net.Http;
using System.Text;

using Orbital.Mock.Definition;

using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.HeaderPathMatch
{
    public partial class HeaderPathMatchFixture_Feature : FeatureFixture
    {
        private readonly HttpClient client;
        private Scenario scenario;
        private HttpRequestMessage request;
        private HttpResponseMessage response;
        private JToken responseBody;
        private JToken mockDefinitionHeaderJson;

        public HeaderPathMatchFixture_Feature()
        {
            this.client = new HttpClient();
            this.mockDefinitionHeaderJson = JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.HeaderMock));
            var mockDefinition = this.mockDefinitionHeaderJson.ToObject<MockDefinition>();
            this.scenario = mockDefinition.Scenarios[0];
            this.request = new HttpRequestMessage(new HttpMethod(this.scenario.Verb.ToString()), $"{CommonData.ServerBaseUri}{this.scenario.Path}");
        }

        private void Given_the_server_has_a_mock_definition_with_scenarios_with_header_rules_to_match_against()
        {
            var content = new StringContent(this.mockDefinitionHeaderJson.ToString(),
                Encoding.UTF8, "application/json");
            _ = this.client.PostAsync(CommonData.AdminUri, content).Result;
        }

        private void Given_the_request_matches_against_a_scenario()
        {
            foreach (var rule in this.scenario.RequestMatchRules.HeaderRules)
            {
                this.request.Headers.Add(rule.Key, rule.Value);
            }
        }

        private void Given_the_request_header_values_do_not_match_against_a_scenario()
        {
            foreach (var rule in this.scenario.RequestMatchRules.HeaderRules)
            {
                this.request.Headers.Add(rule.Key, $"{rule.Value}-diff");
            }
        }

        private void Given_the_request_header_keys_do_not_match_against_a_scenario()
        {
            foreach (var rule in this.scenario.RequestMatchRules.HeaderRules)
            {
                this.request.Headers.Add(rule.Key.Substring(0, rule.Key.Length / 2), rule.Value);
            }
        }

        private void When_the_client_sends_the_request()
        {
            this.response = this.client.SendAsync(this.request).Result;
        }

        private void Then_the_response_is_equal_to_the_scenario_expected_response()
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

        private void Then_the_response_should_be_a_bad_request()
        {
            Assert.Equal(HttpStatusCode.BadRequest, this.response.StatusCode);
        }
    }
}