using Bogus;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class PathValidationFilterTest
    {
        private readonly List<string> VALIDMETHODS = new List<string> { HttpMethods.Get.ToUpper(), HttpMethods.Put.ToUpper(), HttpMethods.Post.ToUpper(), HttpMethods.Delete.ToUpper() };

        [Fact]
        public void PathValidationFilterSuccessTest()
        {
            #region TestSetup

            var scenarioFaker = new Faker<Scenario>()
            .RuleFor(m => m.Path, f => f.Lorem.Text())
            .RuleFor(m => m.Verb, f => f.PickRandom(VALIDMETHODS))
            .RuleFor(m => m.Id, f => f.Random.String());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Path = fakeScenario.Path,
                Verb = fakeScenario.Verb
            };

            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;
            var Expected = new List<Scenario> { fakeScenario };

            Assert.Equal(Expected, Actual);

        }

        [Fact]
        public void PathValidationFilterFailTest()
        {
            #region TestSetup

            var scenarioFaker = new Faker<Scenario>()
            .RuleFor(m => m.Path, f => f.Lorem.Text())
            .RuleFor(m => m.Verb, f => f.PickRandom(VALIDMETHODS))
            .RuleFor(m => m.Id, f => f.Random.String());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>(),
                Path = fakeScenario.Path,
                Verb = fakeScenario.Verb
            };

            #endregion

            var Target = new PathValidationFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;
            var Expected = new List<Scenario> { fakeScenario };

            Assert.NotEqual(Expected, Actual);

        }

        [Fact]
        public void PathValidationFilterPathNullTest()
        {
            #region TestSetup
            var faker = new Faker();

            var input = new
            {
                Scenarios = new List<Scenario>(),
                Path = faker.Lorem.Word(),
                Verb = faker.PickRandom(VALIDMETHODS)
            };
            #endregion
            var Target = new PathValidationFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb }).Scenarios;

            Assert.Empty(Actual);
        }

        [Fact]
        public void PathValidationInvalidPortTest()
        {

            #region TestSetup
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Path, f => f.Lorem.Word())
                .RuleFor(m => m.Verb, f => f.PickRandom(VALIDMETHODS))
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
            var Target = new PathValidationFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort { Scenarios = input.Scenarios, Path = input.Path, Verb = input.Verb, Faults = input.Faults }).Scenarios;
            var Expected = new List<Scenario> { fakeScenario };

            Assert.Equal(Expected, Actual);
        }
    }
}
