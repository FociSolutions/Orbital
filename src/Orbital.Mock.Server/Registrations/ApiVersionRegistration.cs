using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.Registrations
{
    [ExcludeFromCodeCoverage]
    public static class ApiVersionRegistration
    {
        /// <summary>
        /// Configures the service for API version
        /// </summary>
        /// <param name="services">Service collection</param>
        public static void ConfigureService(IServiceCollection services)
        {
            services.AddVersionedApiExplorer(o =>
            {
                o.GroupNameFormat = "'v'VVV";
                o.SubstituteApiVersionInUrl = true;
            });
            services.AddApiVersioning(o =>
            {
                o.ReportApiVersions = true;
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
            });
        }
    }
}
