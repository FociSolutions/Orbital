using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
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
        }

    }
}
