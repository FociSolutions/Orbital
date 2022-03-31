using Xunit;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

using Orbital.Mock.Definition;
using Bogus;
using System.Text;

namespace Orbital.Mock.Server.Integration.Tests
{
    public class OrbitalAdminControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly string mockDefPath;
        private readonly Faker faker;


        public OrbitalAdminControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            var pathVarName = $"{Constants.ENV_PREFIX}{Constants.MOCK_DEF_IMPORT_SVC_SECTION_NAME}__PATH";
            mockDefPath = Path.Combine(".", "fixtures");
            Environment.SetEnvironmentVariable(pathVarName, mockDefPath);

            faker = new Faker();

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
        
        [Fact]
        public async Task GetAll_ReturnsLoadedMockDef()
        {
            #region Test Setup
            var expected = "Pet Store Tests";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/");
            #endregion

            var response = await _client.SendAsync(request);

            Assert.True(response.IsSuccessStatusCode);

            var responseBody = await response.Content.ReadAsStringAsync();
            var mockDef = MockDefinition.CreateFromJsonArrayString(responseBody).Single();

            Assert.Equal(expected, mockDef.Metadata.Title);
        }

        [Fact]
        public async Task PutMockDef_UpdatesMockDef()
        {
            #region Test Setup
            var mockDef = MockDefinition.CreateFromFile(mockDefPath);
            var expected = faker.Lorem.Sentence();
            mockDef.Metadata.Description = expected;

            var requestContent = new StringContent(mockDef.ToJson(), Encoding.UTF8, "application/json");
            var getRequest = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/{mockDef.Metadata.Title}");
            #endregion

            var putResponse = await _client.PutAsync(Constants.ADMIN_ENDPOINT_URL, requestContent);
            var getResponse = await _client.SendAsync(getRequest);

            Assert.True(putResponse.IsSuccessStatusCode);
            Assert.True(getResponse.IsSuccessStatusCode);

            var responseBody = await getResponse.Content.ReadAsStringAsync();
            var responseMockDef = MockDefinition.CreateFromJsonString(responseBody);

            Assert.Equal(expected, responseMockDef.Metadata.Description);
        }

    }
}
