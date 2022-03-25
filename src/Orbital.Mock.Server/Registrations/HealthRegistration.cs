﻿using System.Diagnostics.CodeAnalysis;

using Microsoft.Extensions.DependencyInjection;

using Orbital.Mock.Server.HealthChecks;

namespace Orbital.Mock.Server.Registrations
{
    [ExcludeFromCodeCoverage]
    public static class HealthRegistration
    {
        public static void ConfigureService(IServiceCollection services)
        {
            services.AddSingleton<StartupHealthCheck>();
            services.AddHealthChecks()
                    .AddCheck<StartupHealthCheck>("Startup", tags: new[] { "ready" })
                    .AddCheck<ReadinessHealthCheck>("Readiness_Health_Check"); //< TODO :: Verify need of this check
        }
    }
}
