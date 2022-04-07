
using System.Diagnostics.CodeAnalysis;

using Microsoft.AspNetCore.Hosting;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;

using Serilog;
using Serilog.Events;

namespace Orbital.Mock.Server
{
    [ExcludeFromCodeCoverage]
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
           Host.CreateDefaultBuilder(args)
               .ConfigureAppConfiguration(ConfigAppConfiguration)
               .UseSerilog()
               .ConfigureWebHostDefaults(webBuilder =>
               {
                   webBuilder.UseStartup<Startup>();
               });

        private static void ConfigureEnvironmentVariables(IConfigurationBuilder configurationBuilder)
        {
            // Gather any vars with the DOTNET_ prefix
            configurationBuilder.AddEnvironmentVariables();
            // Also gather vars with the app specific prefix
            configurationBuilder.AddEnvironmentVariables(Constants.ENV_PREFIX);
        }

        private static void ConfigAppConfiguration(HostBuilderContext context, IConfigurationBuilder configurationBuilder)
        {
            ConfigureEnvironmentVariables(configurationBuilder);

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
