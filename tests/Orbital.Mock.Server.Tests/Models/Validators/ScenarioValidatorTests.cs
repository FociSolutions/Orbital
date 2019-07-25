using Bogus;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models.Validators
{
    public class ScenarioValidatorTests
    {
        [Fact]
        public void ScenarioValidatorSuccessTest()
        {
            #region TestSetup

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String())
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.String())
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<string>{
                        HttpMethods.Get,
                        HttpMethods.Put,
                        HttpMethods.Post,
                        HttpMethods.Delete }));

            var input = new
            {
                scenario = scenarioFake.Generate()
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

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => null)
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.String())
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<string>{
                        HttpMethods.Get,
                        HttpMethods.Put,
                        HttpMethods.Post,
                        HttpMethods.Delete }));

            var input = new
            {
                scenario = scenarioFake.Generate()
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

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String())
                .RuleFor(m => m.Response, f => null)
                .RuleFor(m => m.Path, f => f.Random.String())
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<string>{
                        HttpMethods.Get,
                        HttpMethods.Put,
                        HttpMethods.Post,
                        HttpMethods.Delete }));

            var input = new
            {
                scenario = scenarioFake.Generate()
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

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String())
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => null)
                .RuleFor(m => m.Verb, f => f.PickRandom(
                    new List<string>{
                        HttpMethods.Get,
                        HttpMethods.Put,
                        HttpMethods.Post,
                        HttpMethods.Delete }));

            var input = new
            {
                scenario = scenarioFake.Generate()
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.False(Actual.IsValid);
        }

        [Fact]
        public void ScenarioValidatorVerbNotNullTest()
        {
            #region TestSetup

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String())
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.String())
                .RuleFor(m => m.Verb, f => null);

            var input = new
            {
                scenario = scenarioFake.Generate()
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

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String())
                .RuleFor(m => m.Response, f => new MockResponse())
                .RuleFor(m => m.Path, f => f.Random.String())
                .RuleFor(m => m.Verb, f => HttpMethods.Options);

            var input = new
            {
                scenario = scenarioFake.Generate()
            };
            #endregion
            var Target = new ScenarioValidator();
            var Actual = Target.Validate(input.scenario);
            Assert.False(Actual.IsValid);
        }
    }
}
