using System.Net;
using System.Net.Http;
using System.Text;
using LightBDD.XUnit2;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PutMockDefinition
{
    public partial class PutMockDefinition_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpContent Content;

        private HttpResponseMessage PutResult;

        public PutMockDefinition_Feature()
        {
            Client = new HttpClient();
        }


        private void When_the_client_puts_a_mock_definition_by_id()
        {
            Content = new StringContent(CommonData.GetMockDefinitionText(CommonData.MockDefinition.DefaultMock),
                Encoding.UTF8, "application/json");
            PutResult = Client.PutAsync(CommonData.AdminUri, Content).Result;
        }

        private void Then_the_put_operation_returns_created()
        {
            Assert.Equal(HttpStatusCode.Created, PutResult.StatusCode);
        }
    }
}