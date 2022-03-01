using System;
using System.Net;
using System.Net.Http;
using System.Text;

using Orbital.Mock.Definition.Response;

using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PostMockDefinitionNoResponseType
{
    public partial class PostMockDefinitionNoResponseType_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpContent Content;

        private HttpResponseMessage PostResult;

        private string GetResult;

        public PostMockDefinitionNoResponseType_Feature()
        {
            Client = new HttpClient();
        }

        private void When_the_client_posts_a_mock_definition_with_no_response_type()
        {
            var mockWithNoResponseType = JObject.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.DefaultMock));
            mockWithNoResponseType["scenarios"][0]["response"]["type"].Parent.Remove();
            Content = new StringContent(mockWithNoResponseType.ToString(),
                Encoding.UTF8, "application/json");
            PostResult = Client.PostAsync(CommonData.AdminUri, Content).Result;
        }

        private void Then_the_post_operation_returns_created()
        {
            Assert.Equal(HttpStatusCode.Created, PostResult.StatusCode);
        }

        private void Then_the_get_operation_returns_mock_with_responsetype_custom()
        {
            GetResult = Client.GetAsync(CommonData.AdminUri).Result.Content.ReadAsStringAsync().Result;
            var scenarioResponseType = Convert.ToInt32(JArray.Parse(GetResult)[0]["scenarios"][0]["response"]["type"].ToString());
            Assert.Equal(scenarioResponseType, (int)MockResponseType.CUSTOM);
        }
    }
}