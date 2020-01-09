using Orbital.Mock.Server.Pipelines.Comparers;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Comparers
{
    public class RegexComparerTests
    {
        [Fact]
        public void SuccessRegularExpressionComparison()
        {
            var regex = "[ae]";
            var valueToEvaluate = "gray";
            var actual = RegexComparer.Compare(valueToEvaluate, regex);

            Assert.True(actual);
        }

        [Fact]
        public void FailureRegularExpressionComparison()
        {
            var regex = "[ae]";
            var valueToEvaluate = "box";
            var actual = RegexComparer.Compare(valueToEvaluate, regex);

            Assert.False(actual);
        }
    }
}
