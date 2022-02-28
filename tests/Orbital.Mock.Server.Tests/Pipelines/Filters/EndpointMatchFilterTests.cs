using System;
using System.Linq;
using System.Collections.Generic;

using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Response;

using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class EndpointMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFaker;

        public EndpointMatchFilterTests()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            this.scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete }
                    ));
        }
        [Fact]
        public void EndpointMatchFilterSuccessTest()
        {
            #region TestSetup
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
            var httpMethods = new List<HttpMethod>
            {
                HttpMethod.Get,
                HttpMethod.Post,
                HttpMethod.Put,
                HttpMethod.Delete
            };
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

            var input = new
            {
                Scenarios = new List<Scenario>(),
                Path = faker.Lorem.Word(),
                Verb = HttpMethod.Get
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
