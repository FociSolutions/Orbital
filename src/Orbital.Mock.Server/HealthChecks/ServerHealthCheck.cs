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
        private volatile bool isPipelineRunning;
        private volatile bool isReady;

        private readonly IPipeline<MessageProcessorInput, Task<MockResponse>> _pipeline;

        public ServerHealthCheck(IPipeline<MessageProcessorInput, Task<MockResponse>> pipeline)
        {
            _pipeline = pipeline;
            
            isPipelineRunning = false;
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
            isPipelineRunning = _pipeline.GetPipelineStatus();

            if (!isPipelineRunning)
                return Task.FromResult(HealthCheckResult.Unhealthy("The pipeline is not running yet!"));

            if (!StartupCompleted)
                return Task.FromResult(HealthCheckResult.Unhealthy("StartupBackgroundService is still configuring underlying services!"));

            if (StartupCompleted && isPipelineRunning)
                return Task.FromResult(HealthCheckResult.Healthy("Configuration is complete and the pipeline is running. The server is ready to take requests!"));

            return Task.FromResult(HealthCheckResult.Unhealthy("An unexpected error occurred."));
        }
    }
}
