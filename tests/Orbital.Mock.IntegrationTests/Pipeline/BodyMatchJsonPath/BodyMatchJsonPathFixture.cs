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

        private readonly string bodyMock = "{'store':{'book':[{'category':'reference','author':'Nigel Rees','title':'Sayings of the Century','price':8.95},{'category':'fiction','author':'Evelyn Waugh','title':'Sword of Honour','price':12.99},{'category':'fiction','author':'Herman Melville','title':'Moby Dick','isbn':'0-553-21311-3','price':8.99},{'category':'fiction','author':'J. R. R. Tolkien','title':'The Lord of the Rings','isbn':'0-395-19395-8','price':22.99}],'bicycle':{'color':'red','price':19.95}}}";

        private readonly JToken expected = JToken.Parse(
            JToken.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.BodyJsonPathMock))["scenarios"][7]
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
            var request = new HttpRequestMessage(HttpMethod.Post, $"{CommonData.ServerBaseUri}/pets")
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