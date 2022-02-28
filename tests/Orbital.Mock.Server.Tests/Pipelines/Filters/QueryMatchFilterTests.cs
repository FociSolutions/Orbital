using System.Linq;
using System.Collections.Generic;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Match;

using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.RuleMatchers;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class QueryMatchFilterTests
    {
        private RuleMatcher ruleMatcher = new RuleMatcher();

        static readonly ComparerType[] Comparisons = new[] { ComparerType.JSONCONTAINS, ComparerType.JSONEQUALITY, ComparerType.JSONPATH, ComparerType.JSONSCHEMA, ComparerType.REGEX };

        [Fact]
        public void QueryMatchFilterMatchSuccessTest()
        {
            #region TestSetup
            var faker = new Faker();
            var fakerQueryRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() 
                { 
                    Type = f.PickRandomWithout(Comparisons),
                    Key = f.Random.AlphaNumeric(15),
                    Value = f.Random.AlphaNumeric(15) 
                });

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
                Query = fakeScenario.RequestMatchRules.QueryRules.Select(r => r.GenerateKeyValuePair())
            };
            #endregion

            var Target = new QueryMatchFilter<ProcessMessagePort>(ruleMatcher);

            var Actual = Target.Process(new ProcessMessagePort {Scenarios = input.Scenarios, Query = input.Query})
                .QueryMatchResults.Where(x =>x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();

            var Expected = fakeScenario.Id;

            Assert.Contains(Expected, Actual);
        }

        [Fact]
        public void QueryMatchFilterNoMatchTest()
        {
            #region TestSetup
            var faker = new Faker();
            var fakerQueryRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() 
                { 
                    Type = f.PickRandom<ComparerType>(),
                    Key = f.Random.String(),
                    Value = f.Random.String() 
                });

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

            var Target = new QueryMatchFilter<ProcessMessagePort>(ruleMatcher);

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

            var Target = new QueryMatchFilter<ProcessMessagePort>(ruleMatcher);

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

            var Target = new QueryMatchFilter<ProcessMessagePort>(ruleMatcher);

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Faults = input.Faults }).QueryMatchResults;

            Assert.Empty(Actual);
        }
    }
}
