using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Orbital.Mock.Server.HealthChecks
{
    public class StartupHealthCheck : IHealthCheck
    {
        private volatile bool isReady;

        public bool StartupCompleted
        {
            get => isReady;
            set => isReady = value;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            if (StartupCompleted) return Task.FromResult(HealthCheckResult.Healthy("StartupBackgroundService has completed configuration!"));

            return Task.FromResult(HealthCheckResult.Unhealthy("StartupBackgroundService is still configuring underlying services!"));
        }
    }
}
