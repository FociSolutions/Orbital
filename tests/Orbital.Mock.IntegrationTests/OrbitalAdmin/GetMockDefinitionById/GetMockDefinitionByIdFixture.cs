using System.Net;
using System.Net.Http;
using Bogus;
using LightBDD.XUnit2;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.GetMockDefinitionById
{
    public partial class GetMockDefinitionById_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpResponseMessage GetResult;

        public GetMockDefinitionById_Feature()
        {
            Client = new HttpClient();
        }

        private void When_the_client_requests_a_mock_definition_by_id()
        {
            var f = new Faker();
            var id = f.Random.AlphaNumeric(40);
            GetResult = Client.GetAsync($"{CommonData.AdminUri}/{id}").Result;
        }

        private void Then_the_get_operation_returns_no_content_response()
        {
            Assert.Equal(HttpStatusCode.NoContent, GetResult.StatusCode);
        }
    }
}