using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

using Orbital.Mock.Server.Integration.Tests.Fakes;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;

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
                services.AddSingleton<IPipeline>(FakePipeline);
            });
        }
    }
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> 1cfa87f (finished setting up fake pipeline and custom web factory for health check integration tests)
=======
}
>>>>>>> a81465720ae120830dfd9a7e968fdac780c25375
