using Bogus;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
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
    public class QueryMatchFilterTests
    {
        private AssertFactory assertFactory = new AssertFactory();
        private RuleMatcher ruleMatcher = new RuleMatcher();

        [Fact]
        public void QueryMatchFilterMatchSuccessTest()
        {
            #region TestSetup
            var faker = new Faker();
            var fakerQueryRule = new Faker<KeyValuePairRule>()
                .CustomInstantiator(f => new KeyValuePairRule() { Type = f.PickRandomWithout<ComparerType>(ComparerType.JSONCONTAINS,ComparerType.JSONEQUALITY, ComparerType.JSONPATH, ComparerType.JSONSCHEMA, ComparerType.REGEX), RuleValue = new KeyValuePair<string, string>(f.Random.AlphaNumeric(15), f.Random.AlphaNumeric(15)) });

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    QueryRules = fakerQueryRule.Generate(10)
                })
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Query = fakeScenario.RequestMatchRules.QueryRules.Select(r => r.RuleValue)
            };
            #endregion
            var Target = new QueryMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var Actual = Target.Process(new ProcessMessagePort {Scenarios = input.Scenarios, Query = input.Query})
                .QueryMatchResults.Where(x =>x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();

            var Expected = fakeScenario.Id;

            Assert.Contains(Expected, Actual);
        }

        [Fact]
        public void QueryMatchFilterNoMatchTest()
        {
            #region TestSetup
            var assertFactory = new AssertFactory();
            var faker = new Faker();
            var fakerQueryRule = new Faker<KeyValuePairRule>()
                .CustomInstantiator(f => new KeyValuePairRule() { Type = f.PickRandom<ComparerType>(), RuleValue = new KeyValuePair<string, string>(f.Random.String(), f.Random.String()) });


            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    QueryRules = fakerQueryRule.Generate(10)
                })
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Query = new Dictionary<string, string>()
            };
            #endregion
            var Target = new QueryMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var Actual = Target.Process(new ProcessMessagePort {Scenarios = input.Scenarios, Query = input.Query})
                .QueryMatchResults.Where(x => x.Match == MatchResultType.Success).Select(y => y.ScenarioId).ToList();

            Assert.Empty(Actual);
        }

        [Fact]
        public void QueryMatchFilterNoScenariosMatchTest()
        {
            #region TestSetup
            var input = new
            {
                Scenarios = new List<Scenario>(),
                Query = new Dictionary<string, string>()
            };
            #endregion
            var Target = new QueryMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Query = input.Query }).QueryMatchResults;

            Assert.Empty(Actual);
        }

        [Fact]
        public void QueryMatchFilterInvalidPortTest()
        {
            #region TestSetup
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Faults = new List<string>() { "fault" }
            };
            #endregion
            var Target = new QueryMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Faults = input.Faults }).QueryMatchResults;

            Assert.Empty(Actual);
        }
    }
}
