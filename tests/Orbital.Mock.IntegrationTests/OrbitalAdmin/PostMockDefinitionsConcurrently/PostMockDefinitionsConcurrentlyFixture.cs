using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using LightBDD.XUnit2;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Orbital.Mock.Server.IntegrationTests.OrbitalAdmin.PostMockDefinitionsConcurrently
{
    public partial class PostMockDefinitionsConcurrently_Feature : FeatureFixture
    {
        private readonly HttpClient Client;

        private HttpResponseMessage GetAllResult;

        private List<Task<HttpResponseMessage>> PostResults;

        public PostMockDefinitionsConcurrently_Feature()
        {
            Client = new HttpClient();
        }

        private void When_the_client_posts_many_mock_definitions_by_id()
        {
            var mockDefinition = JObject.Parse(CommonData.GetMockDefinitionText(CommonData.MockDefinition.DefaultMock));

            var mockDefinitions = new List<StringContent>();
            for (int i = 0; i < 50; i++)
            {
                var modifiedMock = mockDefinition;
                modifiedMock["metadata"]["title"] = "PostMockDefinitionsConcurrently_Feature" + i.ToString();
                var Content = new StringContent(modifiedMock.ToString(), Encoding.UTF8, "application/json");
                mockDefinitions.Add(Content);
            }
            
            PostResults = mockDefinitions.Select(mockDefinitionToPost => Client.PostAsync(CommonData.AdminUri, mockDefinitionToPost)).ToList();
            Task.WaitAll(PostResults.ToArray());
        }

        private void When_the_client_requests_all_mock_definitions()
        {
            GetAllResult = Client.GetAsync(CommonData.AdminUri).Result;
        }

        private void Then_the_getall_operation_should_be_successful()
        {
            Assert.True(GetAllResult.IsSuccessStatusCode);
        }

        private void Then_the_getall_operation_returns_all_mock_definitions()
        {
            var content = GetAllResult.Content.ReadAsStringAsync().Result;
            var result = JArray.Parse(content);
            Assert.Equal(50, result.Count);
        }
    }
}