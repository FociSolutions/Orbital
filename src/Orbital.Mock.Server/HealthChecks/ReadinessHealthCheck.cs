using Microsoft.Extensions.Diagnostics.HealthChecks;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.HealthChecks
{
    /// <summary>
    /// Performs a basic availability health check on the server and returns a
    /// Health Check Result with a message
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
