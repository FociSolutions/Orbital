using Xunit;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

using Orbital.Mock.Definition;

namespace Orbital.Mock.Server.Integration.Tests
{
    public class OrbitalAdminControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public OrbitalAdminControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            var pathVarName = $"{Constants.ENV_PREFIX}{Constants.MOCK_DEF_IMPORT_SVC_SECTION_NAME}__PATH";
            var mockDefPath = Path.Combine(".", "fixtures", "mock_definition_valid.json");
            Environment.SetEnvironmentVariable(pathVarName, mockDefPath);

            _client = factory.CreateDefaultClient();
        }

        [Fact]
        public async Task GetById_ReturnsLoadedMockDef()
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

    }
}
