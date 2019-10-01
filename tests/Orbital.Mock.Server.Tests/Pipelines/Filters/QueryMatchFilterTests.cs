using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Extensions.Primitives;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Orbital.Mock.Server.Tests.Models.Validators;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class QueryMatchFilterTests
    {
        [Fact]
        public void QueryMatchFilterMatchSuccessTest()
        {
            #region TestSetup
            var faker = new Faker();

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    QueryRules = faker.Make(10, () => faker.Random.AlphaNumeric(TestUtils.GetRandomStringLength())).ToDictionary<string, string>(val => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                })
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Query = fakeScenario.RequestMatchRules.QueryRules.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString())
            };
            #endregion
            var Target = new QueryMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort {Scenarios = input.Scenarios, Query = input.Query})
                .QueryMatchResults.Where(x =>x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId).ToList();

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void QueryMatchFilterNoMatchTest()
        {
            #region TestSetup
            var faker = new Faker();

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    QueryRules = faker.Make(10, () => faker.Random.AlphaNumeric(TestUtils.GetRandomStringLength())).ToDictionary<string, string>(val => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                })
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Query = new Dictionary<string, string>()
            };
            #endregion
            var Target = new QueryMatchFilter<ProcessMessagePort>();

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
            var Target = new QueryMatchFilter<ProcessMessagePort>();

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
            var Target = new QueryMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Faults = input.Faults }).QueryMatchResults;

            Assert.Empty(Actual);
        }
    }
}
