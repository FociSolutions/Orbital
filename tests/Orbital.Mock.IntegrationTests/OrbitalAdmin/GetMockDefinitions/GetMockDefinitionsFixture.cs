using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.GetMockDefinitions
{
    public partial class GetMockDefinitions_Feature : FeatureFixture
    {
        public GetMockDefinitions_Feature()
        {
            Client = new HttpClient();
        }

        private HttpClient Client;

        private HttpResponseMessage GetAllResult;

        public object Uri { get; }

        private void When_the_client_request_all_mock_definitions()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, CommonData.ServerBaseUri);
            GetAllResult = Client.SendAsync(request).Result;
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