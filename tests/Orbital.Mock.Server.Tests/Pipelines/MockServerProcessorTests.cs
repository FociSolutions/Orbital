using Orbital.Mock.Server.Pipelines;
using Orbital.Mock.Server.Pipelines.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines
{
    public class MockServerProcessorTests
    {
        [Fact]
        public void MockServerProcessorStopAfterStart()
        {
            var Target = new MockServerProcessor();
            Target.Start();
            var Actual = Target.Stop();

            Assert.True(Actual);
        }

        [Fact]
        public void MockServerProcessorStopBeforeStart()
        {
            var Target = new MockServerProcessor();
            var Actual = Target.Stop();
            Assert.True(Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithValidInput()
        {
            #region TestSetup
            #endregion
            var Target = new MockServerProcessor();
            Target.Start();

        }
    }
}
