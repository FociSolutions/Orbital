using Bogus;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System.Collections.Generic;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models.Validators
{
    public class ScenarioValidatorTests
    {
        private Faker<Scenario> scenarioFaker;

        public ScenarioValidatorTests()
        {
            this.scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()))
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete }
                    ));
        }
        [Fact]
        public void ScenarioValidatorSuccessTest()
        {
            #region TestSetup
            var input = new
            {
                scenario = scenarioFaker.Generate()
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.True(Actual.IsValid);
        }

        [Fact]
        public void ScenarioValidatorFaildIdNotNullTest()
        {
            #region TestSetup
            var scenario = scenarioFaker.Generate();
            scenario.Id = null;
            var input = new
            {
                scenario = scenario
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.False(Actual.IsValid);
        }

        [Fact]
        public void ScenarioValidatorFaildResponseNotNullTest()
        {
            #region TestSetup

            var scenario = scenarioFaker.Generate();
            scenario.Response = null;

            var input = new
            {
                scenario = scenario
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.False(Actual.IsValid);
        }

        [Fact]
        public void ScenarioValidatorFaildPathNotNullTest()
        {
            #region TestSetup

            var scenario = scenarioFaker.Generate();
            scenario.Path = null;
            var input = new
            {
                scenario = scenario
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.False(Actual.IsValid);
        }

        [Fact]
        public void ScenarioValidatorVerbNotSupportedTest()
        {
            #region TestSetup
            var scenario = scenarioFaker.Generate();
            scenario.Verb = HttpMethod.Options;
            var input = new
            {
                scenario = scenario
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.False(Actual.IsValid);
        }
    }
}
