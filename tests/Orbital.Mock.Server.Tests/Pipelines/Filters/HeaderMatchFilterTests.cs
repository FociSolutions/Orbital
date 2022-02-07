using Bogus;
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
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Factories;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class HeaderMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFaker;
        private IRuleMatcher ruleMatcher = new RuleMatcher();
        private IAssertFactory assertFactory = new AssertFactory();

        public HeaderMatchFilterTests()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);

            var fakerHeaderRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() 
                {
                    Type = ComparerType.TEXTEQUALS,
                    Key = f.Random.String(),
                    Value = f.Random.String() 
                });
            var requestMatchRulesFake = new Faker<RequestMatchRules>()
                                        .RuleFor(m => m.HeaderRules, f => fakerHeaderRule.Generate(5));

            scenarioFaker = new Faker<Scenario>()
                                .RuleFor(m => m.RequestMatchRules, requestMatchRulesFake)
                                .RuleFor(m => m.Id, f => f.Random.Word());
        }


        [Fact]

        public void HeaderMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.Select(rules => rules.GenerateKeyValuePair());

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };
            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port)
                .HeaderMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();
            var Expected = fakeScenario.Id;

            Assert.Contains(Expected, Actual);

        }

        [Fact]
        public void HeaderMatchRulesKeysAreEqualValuesAreDifferentFailure()
        {
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.Select(x =>
                                                        new KeyValuePair<string, string>(x.Key, x.Value + "-unique"));

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };

            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port).HeaderMatchResults.Where(x => x.Match == MatchResultType.Fail).Select(x => x.ScenarioId).ToList();
            var Expected = fakeScenario.Id;
            Assert.Contains(Expected, Actual);
        }

        [Fact]
        public void HeaderMatchRulesHasMoreHeadersThanRequestHeadersIgnore()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.Skip(3).Select(r => r.GenerateKeyValuePair());

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };
            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port).HeaderMatchResults.Where(x => x.Match == MatchResultType.Ignore).Select(x => x.ScenarioId).ToList();
            var Expected = fakeScenario.Id;
            Assert.Contains(Expected, Actual);
        }

        [Fact]
        public void HeaderMatchRulesHasLessHeadersThanRequestHeadersSuccess()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            fakeScenario.RequestMatchRules.HeaderRules = fakeScenario.RequestMatchRules.HeaderRules.Skip(3).ToList();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };
            #endregion

            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port)
                .HeaderMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();
            var Expected =  fakeScenario.Id;

            Assert.Contains(Expected, Actual);
        }

        [Fact]

        public void HeaderMatchFilterNoMatchTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate() ;

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = fakeScenario.RequestMatchRules.HeaderRules.Select(x =>
                                                        new KeyValuePair<string, string>(x.Key, x.Value + "-unique"))
            };

            #endregion

            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port)
                .HeaderMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();

            Assert.Empty(Actual);
        }

        [Fact]

        public void HeaderMatchFilterNoScenarioTest()
        {
            #region Test Setup
            var input = new
            {
                Scenarios = new List<Scenario>(),
                Headers = new Dictionary<string, string>()

            };
            #endregion

            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };
            var Actual = Target.Process(port).HeaderMatchResults;

            Assert.Empty(Actual);

        }

        [Fact]
        public void HeaderMatchFilterInvalidPortTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Faults = new List<string> { "fault" }

            };
            #endregion

            var Target = new HeaderMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Faults = input.Faults
            };

            var Actual = Target.Process(port).HeaderMatchResults;

            Assert.Empty(Actual);
        }
    }
}
