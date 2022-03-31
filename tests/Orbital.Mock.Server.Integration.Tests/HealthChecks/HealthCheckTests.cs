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

        //test that doesn't force any variables but tests the natural 
        //result of startup
        [Fact]
        public async Task NaturalServerHealthCheck_ReturnsOK()
        {
            var response = await _client.GetAsync("/health");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task ServerHealthCheckPipelineStopped_ReturnsServiceUnavailable()
        {
            _factory.FakePipeline.Stop();

            var response = await _client.GetAsync("/health");

            Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        }
    }
}
