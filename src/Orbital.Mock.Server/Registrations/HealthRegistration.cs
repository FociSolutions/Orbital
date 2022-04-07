using System.Diagnostics.CodeAnalysis;

using Microsoft.Extensions.DependencyInjection;

using Orbital.Mock.Server.HealthChecks;

namespace Orbital.Mock.Server.Registrations
{
    [ExcludeFromCodeCoverage]
    public static class HealthRegistration
    {
        public static void ConfigureService(IServiceCollection services)
        {
            services.AddSingleton<ServerHealthCheck>();
            services.AddHealthChecks()
                    .AddCheck<ServerHealthCheck>("Server_Health_Check", tags: new[] { "ready" });
        }
    }
}
