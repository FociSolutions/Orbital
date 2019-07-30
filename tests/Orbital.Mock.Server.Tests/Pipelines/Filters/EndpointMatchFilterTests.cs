using Bogus;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class EndpointMatchFilterTests
    {
        [Fact]
        public void EndpointMatchFilterSuccessTest()
        {
            #region TestSetup
            var httpMethods = new List<string>
            {
                HttpMethods.Get,
                HttpMethods.Post,
                HttpMethods.Put,
                HttpMethods.Delete
            };
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Path, f => f.Lorem.Word())
                .RuleFor(m => m.Verb, f => f.PickRandom(httpMethods))
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = fakeScenario.Path,
                Verb = fakeScenario.Verb
            };
            #endregion
            var Target = new EndpointMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;
            var Expected = new List<Scenario> { fakeScenario };

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void EndpointMatchFilterNoPathMatchTest()
        {
            #region TestSetup
            var httpMethods = new List<string>
            {
                HttpMethods.Get,
                HttpMethods.Post,
                HttpMethods.Put,
                HttpMethods.Delete
            };
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Path, f => f.Lorem.Word())
                .RuleFor(m => m.Verb, f => f.PickRandom(httpMethods))
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = fakeScenario.Path + "/diff",
                Verb = fakeScenario.Verb
            };
            #endregion
            var Target = new EndpointMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;

            Assert.Empty(Actual);
        }

        [Fact]
        public void EndpointMatchFilterNoMethodMatchTest()
        {
            #region TestSetup
            var faker = new Faker();
            var httpMethods = new List<string>
            {
                HttpMethods.Get,
                HttpMethods.Post,
                HttpMethods.Put,
                HttpMethods.Delete
            };
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Path, f => f.Lorem.Word())
                .RuleFor(m => m.Verb, f => f.PickRandom(httpMethods))
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = fakeScenario.Path,
                Verb = faker.PickRandom(httpMethods.Where(method => !method.Equals(fakeScenario.Verb)))
            };
            #endregion
            var Target = new EndpointMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;

            Assert.Empty(Actual);
        }

        [Fact]
        public void EndpointMatchFilterNoScenariosMatchTest()
        {
            #region TestSetup
            var faker = new Faker();
            var httpMethods = new List<string>
            {
                HttpMethods.Get,
                HttpMethods.Post,
                HttpMethods.Put,
                HttpMethods.Delete
            };

            var input = new
            {
                Scenarios = new List<Scenario>(),
                Path = faker.Lorem.Word(),
                Verb = faker.PickRandom(httpMethods)
            };
            #endregion
            var Target = new EndpointMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;

            Assert.Empty(Actual);
        }

        [Fact]
        public void EndpointMatchFilterInvalidPortTest()
        {
            #region TestSetup
            var httpMethods = new List<string>
            {
                HttpMethods.Get,
                HttpMethods.Post,
                HttpMethods.Put,
                HttpMethods.Delete
            };
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Path, f => f.Lorem.Word())
                .RuleFor(m => m.Verb, f => f.PickRandom(httpMethods))
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = fakeScenario.Path,
                Verb = fakeScenario.Verb,
                Faults = new List<string>() { "fault" }
            };
            #endregion
            var Target = new EndpointMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb, Faults = input.Faults }).Scenarios;
            var Expected = new List<Scenario> { fakeScenario };

            Assert.Equal(Expected, Actual);
        }
    }
}
