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
            CreateHostBuild(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuild(string[] args) =>
           Host.CreateDefaultBuilder(args)
               .ConfigureAppConfiguration(ConfigAppConfiguration)
               .UseSerilog()
               .ConfigureWebHostDefaults(webBuilder =>
               {
                   webBuilder.UseStartup<Startup>();
               });

        private static void ConfigAppConfiguration(HostBuilderContext context, IConfigurationBuilder configurationBuilder)
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
