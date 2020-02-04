using Orbital.Mock.Server.Pipelines.Comparers;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Comparers
{
    public class TextComparerTests
    {
        [Fact]
        public void SuccessEqualsComparison()
        {
            var rule = "gray";
            var valueToEvaluate = "gray";
            var actual = TextComparer.Equals(valueToEvaluate, rule);

            Assert.True(actual);
        }

        [Fact]
        public void FailureEqualsComparison()
        {
            var rule = "boxes";
            var valueToEvaluate = "box";
            var actual = TextComparer.Equals(valueToEvaluate, rule);

            Assert.False(actual);
        }

        [Fact]
        public void SuccessContainsComparison()
        {
            var rule = "gray";
            var valueToEvaluate = "a";
            var actual = TextComparer.Contains(rule, valueToEvaluate);

            Assert.True(actual);
        }

        [Fact]
        public void FailureContainsComparison()
        {
            var rule = "boxes";
            var valueToEvaluate = "not";
            var actual = TextComparer.Contains(valueToEvaluate, rule);

            Assert.False(actual);
        }

        [Fact]
        public void SuccessStartsWithComparison()
        {
            var rule = "gray";
            var valueToEvaluate = "gra";
            var actual = TextComparer.StartsWith(rule, valueToEvaluate);

            Assert.True(actual);
        }

        [Fact]
        public void FailureStartsWithComparison()
        {
            var rule = "boxes";
            var valueToEvaluate = "es";
            var actual = TextComparer.StartsWith(valueToEvaluate, rule);

            Assert.False(actual);
        }

        [Fact]
        public void SuccessEndsWithComparison()
        {
            var rule = "gray";
            var valueToEvaluate = "ay";
            var actual = TextComparer.EndsWith(rule, valueToEvaluate);

            Assert.True(actual);
        }

        [Fact]
        public void FailureEndsWithComparison()
        {
            var rule = "boxes";
            var valueToEvaluate = "bo";
            var actual = TextComparer.EndsWith(valueToEvaluate, rule);

            Assert.False(actual);
        }
    }
}
