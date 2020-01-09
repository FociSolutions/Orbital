using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using Orbital.Mock.Server.Tests.Models.Validators;
using Xunit;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Models.Interfaces;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class HeaderMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFaker;

        public HeaderMatchFilterTests()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerHeaderQueryRule = new Faker<KeyValuePairRule>()
                .CustomInstantiator(f => new KeyValuePairRule(f.PickRandom<ComparerType>(), new KeyValuePair<string, string>(f.Random.String(), f.Random.String())));
            var requestMatchRulesFake = new Faker<RequestMatchRules>()
                                        .RuleFor(m => m.HeaderRules, f => fakerHeaderQueryRule.Generate(3));

            scenarioFaker = new Faker<Scenario>()
                                .RuleFor(m => m.RequestMatchRules, requestMatchRulesFake)
                                .RuleFor(m => m.Id, f => f.Random.Word());
        }


        [Fact]

        public void HeaderMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.Select(rules => rules.RuleValue);

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers

            };
            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port)
                .HeaderMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();
            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);

        }

        [Fact]
        public void HeaderMatchRulesKeysAreEqualValuesAreDifferentFailure()
        {
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.Select(rules => rules.RuleValue);

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };

            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port).HeaderMatchResults.Where(x => x.Match == MatchResultType.Fail).Select(x => x.ScenarioId).ToList();
            var Expected = new List<string>() { fakeScenario.Id };
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void HeaderMatchRulesHasMoreHeadersThenRequestHeadersFailure()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.Skip(3).Select(r => r.RuleValue);

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };
            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port).HeaderMatchResults.Where(x => x.Match == MatchResultType.Fail).Select(x => x.ScenarioId).ToList();
            var Expected = new List<string>() { fakeScenario.Id };
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void HeaderMatchRulesHasLessHeadersThenRequestHeadersSuccess()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.ToDictionary(kvp => kvp.RuleValue.Key, kvp => kvp.RuleValue.Value);

            fakeScenario.RequestMatchRules.HeaderRules = fakeScenario.RequestMatchRules.HeaderRules.Skip(3).ToList();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers
            };
            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Headers = input.Headers
            };

            var Actual = Target.Process(port)
                .HeaderMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();
            var Expected = new List<string>() { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]

        public void HeaderMatchFilterNoMatchTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = new Dictionary<string, string>()

            };

            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

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

            var Target = new HeaderMatchFilter<ProcessMessagePort>();

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
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

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
