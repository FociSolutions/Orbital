using Orbital.Mock.Server.Pipelines.Comparers;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Comparers
{
    public class JsonComparerTests
    {
        [Fact]
        public void SuccessDeepEqualsComparison()
        {
            var rule = "{\"fruit\": \"Apple\",\"size\": \"Large\",\"color\": \"Red\"}";
            var valueToEvaluate = "{\"fruit\": \"Apple\",\"size\": \"Large\",\"color\": \"Red\"}";
            var actual = JsonComparer.DeepEqual(valueToEvaluate, rule);

            Assert.True(actual);
        }

        [Fact]
        public void FailDeepEqualsComparison()
        {
            var rule = "{\"fruit\": \"Apple\",\"size\": \"Large\",\"color\": \"Red\"}";
            var valueToEvaluate = "{\"fruit\": \"Banana\",\"size\": \"Medium\",\"color\": \"Yellow\"}";
            var actual = JsonComparer.DeepEqual(valueToEvaluate, rule);

            Assert.False(actual);
        }

        [Fact]
        public void SuccessDeepContainsComparison()
        {
            var rule = "{\"fruit\": \"Apple\",\"size\": \"Large\",\"color\": \"Red\"}";
            var valueToEvaluate = "{\"fruit\": \"Apple\"}";
            var actual = JsonComparer.DeepContains(valueToEvaluate, rule);

            Assert.True(actual);
        }

        [Fact]
        public void FailDeepContainsComparison()
        {
            var rule = "{\"fruit\": \"Apple\",\"size\": \"Large\",\"color\": \"Red\"}";
            var valueToEvaluate = "{\"Apple\"}";
            var actual = JsonComparer.DeepContains(valueToEvaluate, rule);

            Assert.False(actual);
        }
    }
}
