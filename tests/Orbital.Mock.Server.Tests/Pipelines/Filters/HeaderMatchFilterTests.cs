using Bogus;
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

        [Fact]

        public void HeaderMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var faker = new Faker();

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    HeaderRules = faker.Make(10, () => faker.Random.String()).ToDictionary<string, string>(val => f.Random.String())
                }).RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFake.Generate();

            var headers = new NameValueCollection();


            foreach (var headerRules in fakeScenario.RequestMatchRules.HeaderRules)
            {
                headers.Add(headerRules.Key, headerRules.Value);
            }

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = headers

            };

            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort(input.Scenarios) { Headers = input.Headers }).HeaderMatchResults;
            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);

        }

        [Fact]

        public void HeaderMatchFilterNoMatchTest()
        {
            #region Test Setup
            var faker = new Faker();

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    HeaderRules = faker.Make(10, () => faker.Random.String()).ToDictionary<string, string>(val => f.Random.String())
                }).RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFake.Generate();

            var headers = new NameValueCollection();


            foreach (var headerRules in fakeScenario.RequestMatchRules.HeaderRules)
            {
                headers.Add(headerRules.Key, headerRules.Value);
            }

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Headers = new NameValueCollection()

            };

            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort(input.Scenarios) { Headers = input.Headers }).HeaderMatchResults;
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
                Headers = new NameValueCollection()

            };

            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort(input.Scenarios) { Headers = input.Headers }).Scenarios;

            Assert.Empty(Actual);

        }

        [Fact]
        public void HeaderMatchFilterInvalidPortTest()
        {
            #region Test Setup
            var faker = new Faker();

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    HeaderRules = faker.Make(10, () => faker.Random.String()).ToDictionary<string, string>(val => f.Random.String())
                }).RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFake.Generate();

            var headers = new NameValueCollection();


            foreach (var headerRules in fakeScenario.RequestMatchRules.HeaderRules)
            {
                headers.Add(headerRules.Key, headerRules.Value);
            }

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Faults = new List<string> { "fault" }

            };

            #endregion
            var Target = new HeaderMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort(input.Scenarios) { Faults = input.Faults }).Scenarios;
            var Expected = new List<Scenario> { fakeScenario };

            Assert.Equal(Expected, Actual);

        }

    }
}
