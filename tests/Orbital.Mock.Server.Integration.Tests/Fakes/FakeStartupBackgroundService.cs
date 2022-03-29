using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace Orbital.Mock.Server.Integration.Tests.Fakes
{
    public class FakeStartupBackgroundService : BackgroundService
    {
        public FakeStartupBackgroundService()
        {
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            throw new NotImplementedException();
        }
    }
}
