﻿using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using System.Net.Http;
using System.Text;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.DefaultScenarioMatch
{
    public partial class DefaultScenarioMatchFixture_Feature : FeatureFixture
    {
        private readonly HttpClient client;
        private Scenario scenario;
        private HttpRequestMessage request;
        private HttpResponseMessage response;
        private JToken responseBody;
        private JToken mockDefinitionDefaultScenarioJson;

        public DefaultScenarioMatchFixture_Feature()
        {
            this.client = new HttpClient();
            this.mockDefinitionDefaultScenarioJson = JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.DefaultScenarioMock));
            var mockDefinition = this.mockDefinitionDefaultScenarioJson.ToObject<MockDefinition>();
            this.scenario = mockDefinition.Scenarios[1];
            this.request = new HttpRequestMessage(new HttpMethod(this.scenario.Verb.ToString()), $"{CommonData.ServerBaseUri}{this.scenario.Path}");
        }

        private void Given_the_server_has_a_mock_definition_with_scenarios_with_a_default_scenario_to_match_against()
        {
            var content = new StringContent(this.mockDefinitionDefaultScenarioJson.ToString(),
                Encoding.UTF8, "application/json");
            _ = this.client.PostAsync(CommonData.AdminUri, content).Result;
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

    }
}
