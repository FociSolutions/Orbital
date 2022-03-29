using Xunit;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

using Newtonsoft.Json;

using Orbital.Mock.Definition;

namespace Orbital.Mock.Server.Integration.Tests
{
    public class MockDefinitionImportServiceTests : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public MockDefinitionImportServiceTests(CustomWebApplicationFactory<Startup> factory)
        {
            var pathVarName = $"{Constants.ENV_PREFIX}{Constants.MOCK_DEF_IMPORT_SVC_SECTION_NAME}__PATH";
            var mockDefPath = Path.Combine(".", "fixtures", "mock_definition_valid.json");
            Environment.SetEnvironmentVariable(pathVarName, mockDefPath);

            _client = factory.CreateDefaultClient();
        }

        [Fact]
        public async Task MockDefImportSvcConfig_LoadsTestMockDef()
        {
            #region Test Setup
            var expected = "Pet Store Tests";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/{expected}");
            #endregion

            var response = await _client.SendAsync(request);

            Assert.True(response.IsSuccessStatusCode);

            var responseBody = await response.Content.ReadAsStringAsync();
            var mockDef = MockDefinition.CreateFromJsonString(responseBody);

            Assert.Equal(expected, mockDef.Metadata.Title);
        }

        [Fact]
        public async Task MockDefImportSvcConfig_LoadsOnlyOneMockDef()
        {
            #region Test Setup
            var request = new HttpRequestMessage(HttpMethod.Get, Constants.ADMIN_ENDPOINT_URL);
            #endregion

            var response = await _client.SendAsync(request);

            Assert.True(response.IsSuccessStatusCode);

            var responseBody = await response.Content.ReadAsStringAsync();
            var mockDefList = JsonConvert.DeserializeObject<MockDefinition[]>(responseBody);

            Assert.Single(mockDefList);
        }
    }
}
