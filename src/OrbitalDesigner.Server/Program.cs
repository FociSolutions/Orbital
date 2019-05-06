using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;

namespace OrbitalDesigner.Server
{
    public class Program
    {
        private const string DEVELOPMENT = "Development";
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration(ConfigAppConfiguration)
                .UseSerilog()
                .UseStartup<Startup>()
                .Build();
        }

        private static void ConfigAppConfiguration(WebHostBuilderContext context, IConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.AddEnvironmentVariables();
            //var config = configurationBuilder.Build();
            var loggerConfiguration = new LoggerConfiguration()
            .MinimumLevel.Information()
            .Enrich.FromLogContext()
            .WriteTo.Console();

            var env = context.HostingEnvironment.EnvironmentName;
            if (string.Compare(env, DEVELOPMENT, true) == 0)
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
