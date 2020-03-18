using Newtonsoft.Json.Linq;
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

        [Fact]
        public void SuccessSchemaMatchValidSchemaMatches()
        {
            var rule = @"{
              'name': 'James',
              'hobbies': ['A', 'B', 'C', 'D', 'E']
            }";
            var valueToEvaluate = "{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"hobbies\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}}";
            var actual = JsonComparer.MatchesSchema(rule, valueToEvaluate);
            Assert.True(actual);
        }
        
        [Fact]
        public void SuccessPathExistsJsonComparison()
        {
            var rule = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}");
            var path = "\"$..x\"";
            var actual = JsonComparer.PathEqual(path, rule);

            Assert.True(actual);
        }

        [Fact]
        public void FailSchemaMatchValidSchemaDoesNotMatch()
        {
            var rule = @"{
              'name': 'James',
              'hobbies': {}
            }";
            var valueToEvaluate = "{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"hobbies\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}}";
            var actual = JsonComparer.MatchesSchema(rule, valueToEvaluate);
        }

        [Fact]
        public void FailurePathExistsButIsNotInDoubleQuotesJsonComparison()
        {
            var rule = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}");
            var path = "$..x";
            var actual = JsonComparer.PathEqual(path, rule);

            Assert.False(actual);
        }

        [Fact]
        public void FailurePathIsInvalidJsonComparison()
        {
            var rule = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}");
            var path = "\"$...\"";
            var actual = JsonComparer.PathEqual(path, rule);

            Assert.False(actual);
        }

        [Fact]
        public void FailurePathDoesNotExistJsonComparison()
        {
            var rule = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}");
            var path = "\"$..y\"";
            var actual = JsonComparer.PathEqual(path, rule);

            Assert.False(actual);
        }

        [Fact]
        public void SuccessPathWithSingleQuotes()
        {
            string json = "{\n" +
            "  \"firstName\": \"John\",\n" +
            "  \"lastName\" : \"doe\",\n" +
            "  \"age\"      : 26,\n" +
            "  \"address\"  : {\n" +
            "    \"streetAddress\": \"naist street\",\n" +
            "    \"city\"         : \"Nara\",\n" +
            "    \"postalCode\"   : \"630-0192\"\n" +
            "  },\n" +
            "  \"phoneNumbers\": [\n" +
            "    {\n" +
            "      \"type\"  : \"iPhone\",\n" +
            "      \"number\": \"0123-4567-8888\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"type\"  : \"home\",\n" +
            "      \"number\": \"0123-4567-8910\"\n" +
            "    }\n" +
            "  ]\n" +
            "}";

            var rule = JObject.Parse(json);
            var path = "\"$.phoneNumbers[?(@.type=='iPhone')].type\"";
            var actual = JsonComparer.PathEqual(path, rule);

            Assert.True(actual);
        }
    }
}
