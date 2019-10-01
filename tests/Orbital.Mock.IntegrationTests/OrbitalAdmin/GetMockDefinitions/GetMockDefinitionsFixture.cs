using System.Net.Http;
using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.GetMockDefinitions
{
    public partial class GetMockDefinitions_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpResponseMessage GetAllResult;

        public GetMockDefinitions_Feature()
        {
            Client = new HttpClient();
        }

        private void When_the_client_request_all_mock_definitions()
        {
            GetAllResult = Client.GetAsync(CommonData.AdminUri).Result;
        }

        private void Then_the_getall_operation_should_be_successful()
        {
            Assert.True(GetAllResult.IsSuccessStatusCode);
        }

        private void Then_the_getall_operation_returned_empty_list()
        {
            var content = GetAllResult.Content.ReadAsStringAsync().Result;
            var result = JArray.Parse(content);
            Assert.Empty(result);
        }
    }
}