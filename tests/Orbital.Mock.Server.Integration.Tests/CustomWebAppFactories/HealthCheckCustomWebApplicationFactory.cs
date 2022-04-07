using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

using System.Threading.Tasks;

using Orbital.Mock.Server.Integration.Tests.Fakes;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Definition.Response;

namespace Orbital.Mock.Server.Integration.Tests.CustomWebApplicationFactories
{
    public class HealthCheckCustomWebApplicationFactory<TStartup>
        : WebApplicationFactory<TStartup> where TStartup : class
    {

        internal FakePipeline FakePipeline { get; }

        public HealthCheckCustomWebApplicationFactory()
        {
            FakePipeline = new FakePipeline();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddSingleton<IPipeline<MessageProcessorInput, Task<MockResponse>>>(FakePipeline);
            });
        }
    }
}
