using System.Diagnostics;

using Orbital.Mock.Definition.Policies;
using Orbital.Mock.Server.Pipelines.Policies;

using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.LongRunningTests
{
    public class PolicyFilterTests
    {

        /// <summary>
        /// A policy with a delay of five seconds should delay the request by five seconds
        /// </summary>
        [Fact]
        public void PolicyFilterDelaysRequestByFiveSecondsTestSuccess()
        {
            Policy policy = new Policy
            {
                Type = PolicyType.DELAYRESPONSE,
                Value = 5000
            };

            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            PolicyExecuter.ExecutePolicy(policy);
            stopwatch.Stop();
            Assert.True(stopwatch.ElapsedMilliseconds >= 5000);
        }

        /// <summary>
        /// If no policies are specified, then the app should not crash and should complete the request
        /// </summary>
        [Fact]
        public void PolicyFilterNoPolicySuccessTest()
        {
            Policy policy = new Policy
            {
                Type = PolicyType.NONE,
            };

            var Actual = PolicyExecuter.ExecutePolicy(policy);
            Assert.True(Actual);
        }
    }
}
