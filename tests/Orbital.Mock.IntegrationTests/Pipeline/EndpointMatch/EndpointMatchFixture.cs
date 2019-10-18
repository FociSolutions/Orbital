using System.Net.Http;
using System.Text;
using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.IntegrationTests;
using Xunit;

namespace Orbital.Mock.IntegrationTests.Pipeline.EndpointMatch
{

    public partial class EndpointMatchFixtureFeature : FeatureFixture
    {
        private readonly HttpClient client;

        private StringContent content;

        private HttpResponseMessage httpMessage;

        private readonly string bodyMock = "{}";

        private readonly JToken expected = "{\"success\": \"true\"}";

        public EndpointMatchFixtureFeature()
        {
            this.client = new HttpClient();
        }

        private void Given_a_mock_definition_with_a_parameterized_URL_component()
        {
            content = new StringContent(CommonData.GetMockDefinitionText(CommonData.MockDefinition.EndpointMock),
                Encoding.UTF8, "application/json");
        }

        private void Given_the_mock_definition_has_been_successfully_added()
        {
            _ = client.PostAsync(CommonData.AdminUri, content).Result;
        }

        private void When_the_client_sends_a_get_request_with_a_parameterizable_component()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{CommonData.ServerBaseUri}/pets/xyz123")
            {
                Content = new ByteArrayContent(Encoding.ASCII.GetBytes(bodyMock))
            };

            httpMessage = this.client.SendAsync(request).Result;
        }

        private void Then_the_response_should_contain_the_scenario_body()
        {

            Assert.True(JToken.DeepEquals(expected, httpMessage.Content.ReadAsStringAsync().Result));
        }

        private void When_the_client_sends_a_get_request_with_a_non_parameterizable_component()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{CommonData.ServerBaseUri}/pets/")
            {
                Content = new ByteArrayContent(Encoding.ASCII.GetBytes(""))
            };

            httpMessage = this.client.SendAsync(request).Result;
        }
        private void Then_the_response_should_not_contain_the_scenario_body()
        {
            Assert.False(JToken.DeepEquals(expected, httpMessage.Content.ReadAsStringAsync().Result));
        }
    }
}