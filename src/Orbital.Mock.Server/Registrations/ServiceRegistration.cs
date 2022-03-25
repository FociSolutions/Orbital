using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Orbital.Mock.Definition.Response;

using Orbital.Mock.Server.Functions;
using Orbital.Mock.Server.Services;
using Orbital.Mock.Server.Services.Interfaces;

using Orbital.Mock.Server.Pipelines;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

using Bogus;
using Scriban;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Registrations
{
    [ExcludeFromCodeCoverage]
    public static class ServiceRegistration
    {
        public static void ConfigureService(IServiceCollection services, IConfiguration config)
        {
            services.Configure<MockDefinitionImportServiceConfig>(config.GetSection(Constants.MOCK_DEF_IMPORT_SVC_SECTION_NAME));
            services.AddSingleton<IMockDefinitionImportService, MockDefinitionImportService>();

            services.Configure<PublicKeyServiceConfig>(config.GetSection(Constants.PUB_KEY_SVC_SECTION_NAME));
            services.AddSingleton<IPublicKeyService, PublicKeyService>();

            services.AddSingleton<IGitCommands, GitCommands>();
            services.AddSingleton<IRuleMatcher, RuleMatcher>();
            services.AddSingleton<IPipeline<MessageProcessorInput, Task<MockResponse>>>(s =>
            {
                var processor = new MockServerProcessor(new RuleMatcher(), ConfigureTemplateContext(), s.GetService<IPublicKeyService>());
                processor.Start();
                return processor;
            });

            services.AddHostedService<StartupBackgroundService>();
        }

        /// <summary>
        /// This method creates the template context with buildin functions needed for templaded responses to work..
        /// </summary>
        private static TemplateContext ConfigureTemplateContext()
        {
            var globalContext = new TemplateContext();

            var scriptObjectOrbital = new BuiltinOrbitalFunctions();
            var scriptObjectFaker = new ScriptObject();
            scriptObjectFaker.Import(new Faker());

            globalContext.PushGlobal(scriptObjectFaker);
            globalContext.PushGlobal(scriptObjectOrbital);

            return globalContext;
        }
    }
}
