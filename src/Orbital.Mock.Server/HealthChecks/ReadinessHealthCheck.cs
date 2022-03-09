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
    public class ReadinessHealthCheck : IHealthCheck
    {
        private readonly IPipeline _pipeline;

        public ReadinessHealthCheck(IPipeline pipeline)
        {
            _pipeline = pipeline;
        }

        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, 
            CancellationToken cancellationToken = default
            )
        {
            var isHealthyResult = false;

            _pipeline.

            if (isHealthyResult)
                {
                    return Task.FromResult(
                        HealthCheckResult.Healthy("The server is reachable and has succeeded the health check."));
                }

            return Task.FromResult( new HealthCheckResult(context.Registration.FailureStatus, "The server is unreachable and has failed the health check."));
        }
    }
}
