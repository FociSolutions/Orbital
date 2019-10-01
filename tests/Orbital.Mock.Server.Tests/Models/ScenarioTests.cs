using Bogus;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Orbital.Mock.Server.Tests.Models.Validators;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class ScenarioTests
    {
        private Faker<Scenario> scenarioFake;

        public ScenarioTests()
        {
            this.scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete }
                    ));
        }
        [Fact]
        public void ScenarioEqualsSuccessTest()
        {
            var Target = scenarioFake.Generate();

            var input = new
            {
                scenario = Target as object
            };

            var Actual = Target.Equals(input.scenario);
            Assert.True(Actual);
        }

        [Fact]
        public void ScenarioEqualsFailsTest()
        {
            var Target = scenarioFake.Generate();

            var input = new
            {
                scenario = scenarioFake.Generate()
            };

            input.scenario.Id = Target.Id + "diff";

            var Actual = Target.Equals(input.scenario);
            Assert.False(Actual);
        }
    }
}
