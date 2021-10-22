using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Authentication;
using System.Diagnostics.CodeAnalysis;

using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Serilog;
using Serilog.Events;

namespace Orbital.Mock.Server
{
    [ExcludeFromCodeCoverage]
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }


        public static IWebHostBuilder CreateWebHostBuilder(string[] args) => WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration(ConfigAppConfiguration)
                .UseSerilog()
                .ConfigureKestrel(serverOptions =>
                {
                    serverOptions.ConfigureHttpsDefaults(configOptions =>
                    {
                        configOptions.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
                    });
                    // max size of header
                    serverOptions.Limits.MaxRequestHeadersTotalSize = int.MaxValue - 2;
                    // max size for request buffer size
                    serverOptions.Limits.MaxRequestBufferSize = null;
                })
                .UseStartup<Startup>();

        private static void ConfigAppConfiguration(WebHostBuilderContext context, IConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.AddEnvironmentVariables();
            var loggerConfiguration = new LoggerConfiguration()
            .MinimumLevel.Information() 
            .Enrich.FromLogContext()
            .WriteTo.Console();

            if (context.HostingEnvironment.IsDevelopment())
            {
                loggerConfiguration
                    .MinimumLevel.Override("Microsoft", LogEventLevel.Debug);
            }
            else
            {
                loggerConfiguration
                    .MinimumLevel.Override("Microsoft", LogEventLevel.Information);
            }

            Log.Logger = loggerConfiguration.CreateLogger();
            Log.Information("Logging Started");
        }

    }
}
