using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using Bogus;
using Orbital.Mock.Server.Models;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class MatcherTests
    {
        public MatcherTests()
        {
            _faker = new Faker();
        }

        private readonly Faker _faker;

        [Fact]
        public void MatcherDictionaryDifferentContentFailure()
        {
           var requestDictionary = GenerateRandomDictionary();
           var matchRules = GenerateRandomDictionary();
           var randomScenarioId = _faker.Random.Guid().ToString();
           var Actual = Matcher.MatchByKeyValuePair(requestDictionary, matchRules, randomScenarioId);

           var Expected = new MatchResult(MatchResultType.Fail, randomScenarioId);
           Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MatcherDictionaryMissingOneFailure()
        {
            var requestDictionary = GenerateRandomDictionary();
            var matchRules = requestDictionary;

            requestDictionary.Remove(requestDictionary.First().Key);

            var randomScenarioId = _faker.Random.Guid().ToString();
            var Actual = Matcher.MatchByKeyValuePair(requestDictionary, matchRules, randomScenarioId);

            var Expected = new MatchResult(MatchResultType.Fail, randomScenarioId);
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MatcherDictionaryDeepEqualsSuccess()
        {
            var requestDictionary = GenerateRandomDictionary();
            var matchRules = requestDictionary;
            var randomScenarioId = _faker.Random.Guid().ToString();
            var Actual = Matcher.MatchByKeyValuePair(requestDictionary, matchRules, randomScenarioId);

            var Expected = new MatchResult(MatchResultType.Success, randomScenarioId);
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MatcherDictionaryContainsMatchRulesSuccess()
        {
            var requestDictionary = GenerateRandomDictionary();
            var matchRules = requestDictionary;
            matchRules.Remove(matchRules.First().Key);


            var randomScenarioId = _faker.Random.Guid().ToString();
            var Actual = Matcher.MatchByKeyValuePair(requestDictionary, matchRules, randomScenarioId);

            var Expected = new MatchResult(MatchResultType.Success, randomScenarioId);
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MatcherDictionaryDeepEqualsIgnoreSuccess()
        {
            var requestDictionary = GenerateRandomDictionary();
            var matchRules = new Dictionary<string, string>();
            var randomScenarioId = _faker.Random.Guid().ToString();
            var Actual = Matcher.MatchByKeyValuePair(requestDictionary, matchRules, randomScenarioId);

            var Expected = new MatchResult(MatchResultType.Ignore, randomScenarioId);
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MatcherEmptyDictionaryDeepEqualsIgnoreSuccess()
        {
            var requestDictionary = new Dictionary<string, string>();
            var matchRules = new Dictionary<string, string>();
            var randomScenarioId = _faker.Random.Guid().ToString();
            var Actual = Matcher.MatchByKeyValuePair(requestDictionary, matchRules, randomScenarioId);

            var Expected = new MatchResult(MatchResultType.Ignore, randomScenarioId);
            Assert.Equal(Expected, Actual);
        }

        private Dictionary<string, string> GenerateRandomDictionary()
        {
            var output = new Dictionary<string, string>();
            for (var i = 0; i < 10; i++)
            {
                output[_faker.Random.AlphaNumeric(10)] = _faker.Random.AlphaNumeric(40);
            }

            return output;
        }
    }
}
