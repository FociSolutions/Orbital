using Newtonsoft.Json;
using Orbital.Mock.Server.Pipelines.Comparers;
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
        public void SuccessDeepContainsNestedJsonComparison()
        {
            var rule = "{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}";
            var valueToEvaluate = "{'a': 'b'}";
            var actual = JsonComparer.DeepContains(valueToEvaluate, rule);

            Assert.True(actual);
        }

        [Fact]
        public void FailDeepContainsComparisonString()
        {
            var rule = "{\"fruit\": \"Apple\",\"size\": \"Large\",\"color\": \"Red\"}";
            var valueToEvaluate = "\"Apple\"";
            var actual = JsonComparer.DeepContains(valueToEvaluate, rule);

            Assert.False(actual);
        }

        [Fact]
        public void FailDeepContainsComparisonNumber()
        {
            var rule = "{\"fruit\": \"Apple\",\"size\": 1,\"color\": \"Red\"}";
            var valueToEvaluate = "1";
            var actual = JsonComparer.DeepContains(valueToEvaluate, rule);

            Assert.False(actual);
        }
    }
}
