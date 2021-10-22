using LightBDD.Core.Configuration;
using LightBDD.Core.Dependencies;
using LightBDD.XUnit2;
using Orbital.Mock.IntegrationTests;
using Orbital.Mock.Server.IntegrationTests;
using Xunit;
using Xunit.Abstractions;
using Xunit.Sdk;

[assembly: OrbitalIntegrationConfiguration]
[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace Orbital.Mock.Server.IntegrationTests
{
    public class OrbitalIntegrationConfiguration : LightBddScopeAttribute
    {
        public ITestOutputHelper OutputHelper { get; }

        protected override void OnConfigure(LightBddConfiguration configuration)
        {
            configuration.DependencyContainerConfiguration().UseDefault(cfg =>
            {
                cfg.RegisterInstance(new TestOutputHelper(), opt => opt.As<ITestOutputHelper>());
            });

            configuration.ExecutionExtensionsConfiguration()
                .EnableScenarioDecorator<ClearServerScenarioDecorator>();
        }
    }
}