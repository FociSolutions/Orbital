using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Diagnostics.HealthChecks;

using Orbital.Mock.Definition.Response;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;

namespace Orbital.Mock.Server.HealthChecks
{
    internal class ServerHealthCheck : IHealthCheck
    {
        private volatile bool isReady;

        private readonly IPipeline<MessageProcessorInput, Task<MockResponse>> _pipeline;

        public ServerHealthCheck(IPipeline<MessageProcessorInput, Task<MockResponse>> pipeline)
        {
            _pipeline = pipeline;
            isReady = false;
        }

        // returns true when the StartupBackgroundService has completed
        public bool StartupCompleted
        {
            get => isReady;
            set => isReady = value;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            if (!StartupCompleted)
                return Task.FromResult(HealthCheckResult.Unhealthy("StartupBackgroundService is still configuring underlying services!"));

            if (!_pipeline.GetPipelineStatus())
                return Task.FromResult(HealthCheckResult.Unhealthy("The pipeline is either stopped or faulted."));

            return Task.FromResult(HealthCheckResult.Healthy("Configuration is complete and the pipeline is running. The server is ready to take requests!"));
        }
    }
}
