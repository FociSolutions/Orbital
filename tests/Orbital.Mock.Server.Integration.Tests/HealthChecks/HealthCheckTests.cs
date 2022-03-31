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
            factory.ClientOptions.BaseAddress = new Uri($"http://localhost{Constants.ADMIN_ENDPOINT_URL}");
            
            _client = factory.CreateClient();
            _factory = factory;
        }

        [Fact]
        public async Task HealthEndpoint_ReturnsOK()
        {
            var response = await _client.GetAsync("/health");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task HealthEndpointPipelineStopped_ReturnsServiceUnavailable()
        {
            _factory.FakePipeline.Stop();

            var response = await _client.GetAsync("/health");

            Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        }

        [Fact]
        public async Task readyz_ReturnsOK()
        {
            var response = await _client.GetAsync("/readyz");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task readyzPipelineStopped_ReturnsServiceUnavailable()
        {
            _factory.FakePipeline.Stop();
            
            var response = await _client.GetAsync("/readyz");

            Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        }

        [Fact]
        public async Task livez_ReturnsOK()
        {
            var response = await _client.GetAsync("/livez");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task livezPipelineStopped_ReturnsServiceUnavailable()
        {
            _factory.FakePipeline.Stop();

            var response = await _client.GetAsync("/livez");

            Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        }
    }
}
