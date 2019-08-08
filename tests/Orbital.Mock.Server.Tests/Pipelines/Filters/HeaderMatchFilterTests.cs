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
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class HeaderMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFake;

        public HeaderMatchFilterTests()
        {
            var requestMatchRulesFake = new Faker<RequestMatchRules>()
                                        .RuleFor(r => r.HeaderRules, f => f.Make(10, () => f.Random.String()).ToDictionary(k => k));

            scenarioFake = new Faker<Scenario>()
                                .RuleFor(m => m.RequestMatchRules, requestMatchRulesFake)
                                .RuleFor(m => m.Id, f => f.Random.Word());
        }


        [Fact]

        public void HeaderMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFake.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

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

            var Actual = Target.Process(port).HeaderMatchResults;
            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);

        }

        [Fact]
        public void HeaderMatchRulesHasMoreHeadersThenRequestHeadersFailure()
        {
            #region Test Setup
            var fakeScenario = scenarioFake.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);


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

            var Actual = Target.Process(port).HeaderMatchResults;
            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void HeaderMatchRulesHasLessHeadersThenRequestHeadersSuccess()
        {
            #region Test Setup
            var fakeScenario = scenarioFake.Generate();

            var headers = fakeScenario.RequestMatchRules.HeaderRules.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            fakeScenario.RequestMatchRules.HeaderRules = new Dictionary<string, string>(fakeScenario.RequestMatchRules.HeaderRules.Skip(3));

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

            var Actual = Target.Process(port).HeaderMatchResults;
            var Expected = new List<string>() { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]

        public void HeaderMatchFilterNoMatchTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFake.Generate();

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

            var Actual = Target.Process(port).HeaderMatchResults;
            var Expected = new List<string> { fakeScenario.Id };

            Assert.NotEqual(Expected, Actual);
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
            var Actual = Target.Process(port).Scenarios;

            Assert.Empty(Actual);

        }

        [Fact]
        public void HeaderMatchFilterInvalidPortTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFake.Generate();

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
            var Expected = port.HeaderMatchResults;

            Assert.Equal(Expected, Actual);
        }
    }
}
