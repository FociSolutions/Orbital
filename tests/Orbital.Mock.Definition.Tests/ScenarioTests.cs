﻿using System.Collections.Generic;

using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

using Orbital.Mock.Definition.Response;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Definition.Tests
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
