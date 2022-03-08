using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.HealthChecks
{
    /// <summary>
    /// Performs a basic availability health check on the server and returns a
    /// Health Check Result with a message
    /// </summary>
    public class DefaultHealthCheck : IHealthCheck
    {
        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, 
            CancellationToken cancellationToken = default)
        {
            var isHealthyResult = false;

            if (isHealthyResult)
            {
                return Task.FromResult(
                    HealthCheckResult.Healthy("The server is healthy."));
            }

            return Task.FromResult( new HealthCheckResult(context.Registration.FailureStatus, "The server is not healthy."));
        }
    }
}
