using System.Net;
using System.Net.Http;
using Bogus;
using LightBDD.XUnit2;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.DeleteMockDefinition
{
    public partial class DeleteMockDefinition_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpResponseMessage DeleteResult;

        public DeleteMockDefinition_Feature()
        {
            Client = new HttpClient();
        }


        private void When_the_client_deletes_a_mock_definition_by_id()
        {
            var f = new Faker();
            var id = f.Random.AlphaNumeric(10);
            DeleteResult = Client.DeleteAsync($"{CommonData.AdminUri}/{id}").Result;
        }

        private void Then_the_delete_operation_returned_ok()
        {
            Assert.Equal(HttpStatusCode.OK, DeleteResult.StatusCode);
        }
    }
}