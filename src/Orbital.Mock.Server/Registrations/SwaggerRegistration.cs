﻿using System;
using System.IO;
using System.Reflection;
using System.Diagnostics.CodeAnalysis;

using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.DependencyInjection;

using Swashbuckle.AspNetCore.Filters;

using Orbital.Mock.Definition.Examples;

namespace Orbital.Mock.Server.Registrations
{
    [ExcludeFromCodeCoverage]
    public static class SwaggerRegistration
    {
        /// <summary>
        /// Configures the service for swagger documentation
        /// </summary>
        /// <param name="services">Service collection</param>
        public static void ConfigureService(IServiceCollection services)
        {
            services.AddSwaggerGen(o =>
            {
                var provider = services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();
                var assemblyProduct = Assembly.GetExecutingAssembly().GetCustomAttribute<AssemblyProductAttribute>();
                var assemblyDescription = Assembly.GetExecutingAssembly().GetCustomAttribute<AssemblyDescriptionAttribute>();
                foreach (var version in provider.ApiVersionDescriptions)
                {
                    o.SwaggerDoc(version.GroupName, new OpenApiInfo()
                    {
                        Title = $"{assemblyProduct.Product} {version.ApiVersion}",
                        Version = version.ApiVersion.ToString(),
                        Description = version.IsDeprecated ? $"{assemblyDescription.Description} - DEPRECATED" : assemblyDescription.Description
                    });
                }

                var file = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var path = Path.Combine(AppContext.BaseDirectory, file);
                o.IncludeXmlComments(path);
                o.ExampleFilters();
            });
            services.AddSwaggerExamplesFromAssemblyOf<MockDefinitionsModelExamples>();
        }
    }
}
