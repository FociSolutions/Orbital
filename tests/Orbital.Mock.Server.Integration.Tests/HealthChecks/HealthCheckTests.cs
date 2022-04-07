using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

using Orbital.Mock.Server.Integration.Tests.CustomWebApplicationFactories;

using Xunit;

namespace Orbital.Mock.Server.Integration.Tests.HealthChecks
{
    public class HealthCheckTests : IClassFixture<HealthCheckCustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly HealthCheckCustomWebApplicationFactory<Startup> _factory;

        public HealthCheckTests(HealthCheckCustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
            _factory = factory;
        }

        [Fact]
        public async Task HealthEndpoint_ReturnsOK()
        {
            string expected = "Healthy";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/health");

            _factory.FakePipeline.Start();

            var response = await _client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(expected, content);
        }

        [Fact]
        public async Task HealthEndpointPipelineStopped_ReturnsServiceUnavailable()
        {
            string expected = "Unhealthy";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/health");

            _factory.FakePipeline.Stop();

            var response = await _client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
            Assert.Equal(expected, content);
        }

        [Fact]
        public async Task ReadinessCheck_ReturnsOK()
        {
            string expected = "Healthy";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/readyz");

            _factory.FakePipeline.Start();

            var response = await _client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(expected, content);
        }

        [Fact]
        public async Task ReadinessCheckPipelineStopped_ReturnsServiceUnavailable()
        {
            string expected = "Unhealthy";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/readyz");

            _factory.FakePipeline.Stop();

            var response = await _client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
            Assert.Equal(expected, content);
        }

        [Fact]
        public async Task LivelinessCheckPipelineRunning_ReturnsOK()
        {
            string expected = "Healthy";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/livez");

            _factory.FakePipeline.Start();

            var response = await _client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(expected, content);
        }

        [Fact]
        public async Task LivelinessCheckPipelineStopped_ReturnsOK()
        {
            string expected = "Healthy";
            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.ADMIN_ENDPOINT_URL}/livez");

            _factory.FakePipeline.Stop();

            var response = await _client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            //< Should still be healthy even though the pipeline is stopped
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(expected, content);
        }
    }
}
