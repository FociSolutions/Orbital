﻿using Xunit;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

using Orbital.Mock.Definition;
using Bogus;
using System.Text;
using Microsoft.AspNetCore.Http;

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
            mockDefPath = Path.Combine(".", "fixtures", "mock_definition_valid.json");
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
            var mockDef = MockDefinition.CreateFromJsonArrayString(responseBody).Where(x => x.Metadata.Title == expected).Single();

            Assert.Equal(expected, mockDef.Metadata.Title);
        }

        [Fact]
        public async Task PutExistingMockDef_UpdatesMockDef()
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

        [Fact]
        public async Task PutNewMockDef_CreatesMockDef()
        {
            #region Test Setup
            var mockDef = MockDefinition.CreateFromFile(mockDefPath);
            var expected = faker.Lorem.Sentence();
            mockDef.Metadata.Title = expected;
            var requestContent = new StringContent(mockDef.ToJson(), Encoding.UTF8, "application/json");
            var getRequest = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/{mockDef.Metadata.Title}");
            #endregion

            var putResponse = await _client.PutAsync(Constants.ADMIN_ENDPOINT_URL, requestContent);
            var getResponse = await _client.SendAsync(getRequest);

            Assert.Equal(System.Net.HttpStatusCode.Created, putResponse.StatusCode);
            Assert.True(getResponse.IsSuccessStatusCode);

            var responseBody = await getResponse.Content.ReadAsStringAsync();
            var responseMockDef = MockDefinition.CreateFromJsonString(responseBody);

            Assert.Equal(expected, responseMockDef.Metadata.Title);
        }

        [Fact]
        public async Task PutNewMockDef_ReturnsMockDef()
        {
            #region Test Setup
            var mockDef = MockDefinition.CreateFromFile(mockDefPath);
            var expected = faker.Lorem.Sentence();
            mockDef.Metadata.Title = expected;
            var requestContent = new StringContent(mockDef.ToJson(), Encoding.UTF8, "application/json");
            #endregion

            var putResponse = await _client.PutAsync(Constants.ADMIN_ENDPOINT_URL, requestContent);

            Assert.Equal(System.Net.HttpStatusCode.Created, putResponse.StatusCode);

            var responseBody = await putResponse.Content.ReadAsStringAsync();
            var responseMockDef = MockDefinition.CreateFromJsonString(responseBody);

            Assert.Equal(expected, responseMockDef.Metadata.Title);
        }

        [Fact]
        public async Task PutExistingMockDef_ReturnsMockDef()
        {
            #region Test Setup
            var mockDef = MockDefinition.CreateFromFile(mockDefPath);
            var expected = faker.Lorem.Sentence();
            mockDef.Metadata.Description = expected;
            var requestContent = new StringContent(mockDef.ToJson(), Encoding.UTF8, "application/json");
            #endregion

            var putResponse = await _client.PutAsync(Constants.ADMIN_ENDPOINT_URL, requestContent);

            Assert.Equal(System.Net.HttpStatusCode.OK, putResponse.StatusCode);

            var responseBody = await putResponse.Content.ReadAsStringAsync();
            var responseMockDef = MockDefinition.CreateFromJsonString(responseBody);

            Assert.Equal(expected, responseMockDef.Metadata.Description);
        }

        [Fact]
        public async Task Post_CreatesMockDef()
        {
            #region Test Setup
            var mockDef = MockDefinition.CreateFromFile(mockDefPath);
            var expected = faker.Lorem.Sentence();
            mockDef.Metadata.Title = expected;

            var requestContent = new StringContent(mockDef.ToJson(), Encoding.UTF8, "application/json");
            var getRequest = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/{mockDef.Metadata.Title}");
            #endregion

            var postResponse = await _client.PostAsync(Constants.ADMIN_ENDPOINT_URL, requestContent);
            var getResponse = await _client.SendAsync(getRequest);

            Assert.True(postResponse.IsSuccessStatusCode);
            Assert.True(getResponse.IsSuccessStatusCode);

            var responseBody = await getResponse.Content.ReadAsStringAsync();
            var postResponseBody = await postResponse.Content.ReadAsStringAsync();

            var getResponseMockDef = MockDefinition.CreateFromJsonString(responseBody);
            var postResponseMockDef = MockDefinition.CreateFromJsonString(postResponseBody);

            Assert.Equal(expected, getResponseMockDef.Metadata.Title);
            Assert.Equal(expected, postResponseMockDef.Metadata.Title);
            Assert.Equal(getResponseMockDef.Metadata.Title, postResponseMockDef.Metadata.Title);
        }

        [Fact]
        public async Task DeleteById_ReturnsNoContentStatusCode()
        {
            #region Test Setup
            var mockDef = MockDefinition.CreateFromFile(mockDefPath);
            var title = faker.Lorem.Sentence();
            mockDef.Metadata.Title = title;

            var requestContent = new StringContent(mockDef.ToJson(), Encoding.UTF8, "application/json");
            var delRequest = new HttpRequestMessage(HttpMethod.Delete, $"{Constants.ADMIN_ENDPOINT_URL}/{title}");
            #endregion

            var postResponse = await _client.PostAsync(Constants.ADMIN_ENDPOINT_URL, requestContent);
            var delResponse = await _client.SendAsync(delRequest);

            Assert.True(postResponse.IsSuccessStatusCode);
            Assert.True(delResponse.IsSuccessStatusCode);

            var getReq = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/{title}");
            var newResponse = await _client.SendAsync(getReq);
            var responseBody = await newResponse.Content.ReadAsStringAsync();

            Assert.Equal(StatusCodes.Status204NoContent, (int)newResponse.StatusCode);
            Assert.Empty(responseBody);
        }
    }
}
