using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using System.Net.Http;
using System.Text;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.TemplateResponse
{
    public partial class TemplatedResponseFixture_Feature : FeatureFixture
    {
        private readonly HttpClient client;
        private Scenario scenario;
        private HttpRequestMessage request;
        private HttpResponseMessage response;
        private string responseBody;
        private JToken mockDefinitionTRJson;

        public TemplatedResponseFixture_Feature()
        {
            this.client = new HttpClient();
            this.mockDefinitionTRJson = JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.TemplatedResponseMock));
            var mockDefinition = this.mockDefinitionTRJson.ToObject<MockDefinition>();
            this.scenario = mockDefinition.Scenarios[0];
            this.request = new HttpRequestMessage(new HttpMethod(this.scenario.Verb.ToString()), $"{CommonData.ServerBaseUri}/petTResponse");
        }

        private void Given_the_server_has_a_mock_definition_with_scenarios_with_templated_response()
        {
            var content = new StringContent(this.mockDefinitionTRJson.ToString(),
                Encoding.UTF8, "application/json");
            _ = this.client.PostAsync(CommonData.AdminUri, content).Result;
        }

        private void Given_the_request_contains_the_templated_data()
        {

            this.request.Content = new StringContent("{\"dogname\":\"Andy\"}", Encoding.UTF8, "application/json");
        }


        private void When_the_client_sends_the_request()
        {
            this.response = this.client.SendAsync(this.request).Result;
        }

        private void Then_the_response_is_contains_data_from_the_request_body()
        {
            var ExpectedResponse = this.scenario.Response;
            Assert.Equal(ExpectedResponse.Status, (int)this.response.StatusCode);
            responseBody = this.response.Content.ReadAsStringAsync().Result;

            Assert.Contains("Andy", responseBody);
        }
    }
}
