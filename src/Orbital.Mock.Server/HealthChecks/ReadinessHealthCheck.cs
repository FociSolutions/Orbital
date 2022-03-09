using Microsoft.Extensions.Diagnostics.HealthChecks;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.HealthChecks
{
    /// <summary>
    /// Performs a basic readiness health check on the server
    /// Returns Healthy if the pipeline is up and running and the server can take requests
    /// Returns Unhealthy if the pipeline is not running and therefore the server cannot take requests
    /// </summary>
    internal class ReadinessHealthCheck : IHealthCheck
    {
        private readonly IPipeline _pipeline;
        private bool isHealthy;

        internal ReadinessHealthCheck(IPipeline pipeline)
        {
            _pipeline = pipeline;
            isHealthy = false;
        }

        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, 
            CancellationToken cancellationToken = default
            )
        {
            isHealthy = _pipeline.GetPipelineStatus();

            if (isHealthy)
            {
                return Task.FromResult(HealthCheckResult.Healthy("The server is healthy and ready to receive requests."));
            }

            return Task.FromResult( new HealthCheckResult(context.Registration.FailureStatus, "The server is unhealthy and cannot receive requests."));
        }
    }
}
