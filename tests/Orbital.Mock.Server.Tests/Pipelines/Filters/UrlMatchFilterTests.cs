using System;
using System.Linq;
using System.Collections.Generic;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Match;

using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class UrlMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFaker;
        private IRuleMatcher ruleMatcher = new RuleMatcher();

        public UrlMatchFilterTests()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var pathfaker = new Faker();
            var path = pathfaker.Random.String();
            var fakerurlRule = new Faker<PathTypeRule>()
                .CustomInstantiator(f => new PathTypeRule() { Type = ComparerType.TEXTEQUALS, Path = f.Random.String() });
            var requestMatchRulesFake = new Faker<RequestMatchRules>()
                                        .RuleFor(m => m.UrlRules, f => fakerurlRule.Generate(5));

            scenarioFaker = new Faker<Scenario>()
                                .RuleFor(m => m.RequestMatchRules, requestMatchRulesFake)
                                .RuleFor(m => m.Id, f => f.Random.Word());
        }

        [Fact]
        public void UrlMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            var faker = new Faker();
            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = fakeScenario.RequestMatchRules.UrlRules.FirstOrDefault().Path
            };
            #endregion

            var Target = new UrlMatchFilter<ProcessMessagePort>(new RuleMatcher());

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Path = input.Path
            };

            var Actual = Target.Process(port).URLMatchResults
                .Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();
            var Expected = fakeScenario.Id;

            Assert.Contains(Expected, Actual);

        }

        [Fact]
        public void UrlMatchFilterMatchAcceptAllSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.UrlRules = fakeScenario.RequestMatchRules.UrlRules.Select(r => { r.Type = ComparerType.ACCEPTALL; return r; } ).ToList();
            var faker = new Faker();
            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = faker.Random.AlphaNumeric(TestUtils.GetRandomStringLength())
            };
            #endregion

            var Target = new UrlMatchFilter<ProcessMessagePort>(new RuleMatcher());

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Path = input.Path
            };

            var Actual = Target.Process(port).URLMatchResults
                .Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();
            var Expected = fakeScenario.Id;

            Assert.Contains(Expected, Actual);

        }

        [Fact]
        public void UrlMatchFilterNoMatchTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            var faker = new Faker();
            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = faker.Random.AlphaNumeric(TestUtils.GetRandomStringLength())
            };

            #endregion

            var Target = new UrlMatchFilter<ProcessMessagePort>(ruleMatcher);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Path = input.Path
            };

            var Actual = Target.Process(port)
                .URLMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();

            Assert.Empty(Actual);
        }



    }
}

