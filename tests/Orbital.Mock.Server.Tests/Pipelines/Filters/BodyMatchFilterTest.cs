using Bogus;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Models.Interfaces;

using Assert = Xunit.Assert;
using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Pipelines.RuleMatchers;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class BodyMatchFilterTest
    {
        private readonly Faker<Scenario> scenarioFaker;

        public BodyMatchFilterTest()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerJObject = new Faker<JObject>()
                            .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3));
            this.scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, _ => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Id, n => n.Random.ToString());
        }

        [Fact]
        public void BodyMatchFilterMatchSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = fakeScenario.RequestMatchRules.BodyRules.ToList()[0].RuleValue.ToString()
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
                                {
                                    Scenarios = input.Scenarios, Body = input.Body
                                })
                                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success))
                                                 .Select(x => x.ScenarioId);

            var Expected = fakeScenario.Id ;

            Assert.Equal(Expected, Actual.First());
        }

        /// <summary>
        /// Accept empty JSON bodies (because the designer's JSON validator parses
        /// JSON in terms of javascript's interpretation rather than ours)
        /// </summary>
        [Fact]
        public void BodyMatchFilterEmptyJsonMatchSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule>{new BodyRule(ComparerType.JSONEQUALITY, new JObject())};

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = new JObject()
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
                    { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains the exact JSON object that is the response is successful
        /// </summary>
        [Fact]
        public void BodyMatchContainsExactTestSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONCONTAINS, JObject.Parse("{'a': 'b'}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'a': 'b'}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains a subset of the nested JSON object that is the response is a fail
        /// </summary>
        [Fact]
        public void BodyMatchContainsPartialTestFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONCONTAINS, JObject.Parse("{'x': {'a': 'b'}}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'a': 'b'}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Empty(Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains a superset of the nested JSON object that is the response is a success
        /// </summary>
        [Fact]
        public void BodyMatchContainsPartialTestSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONCONTAINS, JObject.Parse("{'a': 'b'}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'x': {'a': 'b'}}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected =  fakeScenario.Id;

            Assert.Contains(Expected, Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains a superset of the nested JSON object in a triply-nested object that is the response is a success
        /// </summary>
        [Fact]
        public void BodyMatchContainsPartialTripleNestedTestSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONCONTAINS, JObject.Parse("{'a': 'b'}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Checks if matching a JSON object does not appear in a JSON string literal (where the JSON object is itself an escaped string) does not match
        /// </summary>
        [Fact]
        public void BodyMatchContainsPartialTripleNestedLiteralJSONTestFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONCONTAINS, JObject.Parse("{\"a\": \"b\"}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': '{\"a\": \"b\"}'}}}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Empty(Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains a JSON object must equal response does not fire when the response contains the object
        /// </summary>
        [Fact]
        public void BodyMatchEqualitysPartialTripleNestedTestFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONEQUALITY, JObject.Parse("{'a': 'b'}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'x': {'a': 'c'}, 'xy': {'a': 'd', 'b': {'a': 'b'}}}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Empty(Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains a non-nested JSON object must equal response does fire when the response equals the object
        /// </summary>
        [Fact]
        public void BodyMatchEqualityTestSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONEQUALITY, JObject.Parse("{'a': 'b'}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'a': 'b'}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Checks if a scenario which contains a nested JSON object must equal response does fire when the response equals the object
        /// </summary>
        [Fact]
        public void BodyMatchEqualityNestedJSONTestSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONEQUALITY, JObject.Parse("{'a': 'b', 'c': 'd', 'e': {'f': 'g'}}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'a': 'b', 'c': 'd', 'e': {'f': 'g'}}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Checks if a scenario whose value's first element is the non-nested JSON's value does not match if it contains a key-value pair
        /// </summary>
        [Fact]
        public void BodyMatchEqualityNestedJSONKeyValueFirstTestFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONEQUALITY, JObject.Parse("{'a': 'b', 'c': 'd', 'e': {'f': 'g'}}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'e': 'f'}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Empty(Actual);
        }

        /// <summary>
        /// Checks if a scenario whose value's first element is the non-nested JSON's value does not match if it contains a key-value pair
        /// </summary>
        [Fact]
        public void BodyMatchContainsNestedJSONKeyValueFirstTestFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONCONTAINS, JObject.Parse("{'a': 'b', 'c': 'd', 'e': {'f': 'g'}}")) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = JObject.Parse("{'e': 'f'}")
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
            { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Empty(Actual);
        }

        [Fact]
        public void BodyMatchFilterNullJsonMatchSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule(ComparerType.JSONEQUALITY,null) };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = new JObject()
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
                    { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void BodyMatchFilterMatchFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = "{}"
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>(new AssertFactory(), new RuleMatcher());

            var Actual = Target.Process(new ProcessMessagePort()
                    { Scenarios = input.Scenarios, Body = input.Body })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Fail)).Select(x => x.ScenarioId).ToList();

            Assert.Contains(fakeScenario.Id, Actual);
        }
    }
}
