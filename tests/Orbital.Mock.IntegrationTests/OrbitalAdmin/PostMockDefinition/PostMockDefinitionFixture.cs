using System.Net;
using System.Net.Http;
using System.Text;
using LightBDD.XUnit2;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PostMockDefinition
{
    public partial class PostMockDefinition_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpContent Content;

        private HttpResponseMessage PostResult;

        public PostMockDefinition_Feature()
        {
            Client = new HttpClient();
        }


        private void When_the_client_posts_a_mock_definition_by_id()
        {
            Content = new StringContent(CommonData.GetMockDefinitionText(CommonData.MockDefinition.DefaultMock),
                Encoding.UTF8, "application/json");
            PostResult = Client.PostAsync(CommonData.AdminUri, Content).Result;
        }

        private void Then_the_post_operation_returns_created()
        {
            Assert.Equal(HttpStatusCode.Created, PostResult.StatusCode);
        }
    }
}