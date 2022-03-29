using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Hosting;

using Orbital.Mock.Definition.Response;

using Orbital.Mock.Server.HealthChecks;
using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;

namespace Orbital.Mock.Server.Services
{
    internal class StartupBackgroundService : BackgroundService
    {
        private readonly ServerHealthCheck healthCheck;
        private readonly IMockDefinitionImportService mockDefService;
        private readonly IPipeline<MessageProcessorInput, Task<MockResponse>> pipeline;

        public StartupBackgroundService(ServerHealthCheck healthCheck, IMockDefinitionImportService mockDefService,
                                            IPipeline<MessageProcessorInput, Task<MockResponse>> pipeline)
        {
            this.healthCheck = healthCheck;
            this.mockDefService = mockDefService;
            this.pipeline = pipeline;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //< Load any existing MockDefinitions into MemoryCache
            mockDefService.ImportAllIntoMemoryCache();

            //< Verify that the pipeline has been configured and started
            if (!pipeline.GetPipelineStatus()) pipeline.Start();

            //< Set the readiness check as 'healthy'
            healthCheck.StartupCompleted = true;

            return Task.CompletedTask;
        }
    }
}
