using System;
using System.Net.Http;
using System.Text;
using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;

using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.Pipeline.BodyMatchJsonPath
{

    public partial class BodyMatchFixtureJsonPath_Feature : FeatureFixture
    {
        private readonly HttpClient client;

        private StringContent content;

        private HttpResponseMessage httpMessage;

        private readonly string bodyMock = @"{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}";

        private readonly JToken expected = JToken.Parse(
            JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.BodyJsonPathMock))["scenarios"][1]
            ["response"]["body"].ToString());

        public BodyMatchFixtureJsonPath_Feature()
        {
            this.client = new HttpClient();
        }

        private void Given_a_mock_definition_with_a_body_response()
        {
            content = new StringContent(CommonData.GetMockDefinitionText(CommonData.MockDefinition.BodyJsonPathMock),
                Encoding.UTF8, "application/json");
        }

        private void Given_the_mock_definition_has_been_successfully_added()
        {
            _ = client.PostAsync(CommonData.AdminUri, content).Result;
        }

        private void When_the_client_sends_a_get_request_with_a_json_path()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{CommonData.ServerBaseUri}/pets")
            {
                Content = new ByteArrayContent(Encoding.ASCII.GetBytes(bodyMock))
            };

            httpMessage = this.client.SendAsync(request).Result;
        }

        private void Then_the_response_should_not_contain_the_default_scenario_body()
        {
            Assert.True(JToken.DeepEquals(
                    JToken.Parse(httpMessage.Content.ReadAsStringAsync().Result),
                    this.expected));
        }
    }
}