using Bogus;
using Microsoft.Extensions.Primitives;
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
    public class BodyMatchFilterTest
    {
        private Faker<Scenario> scenarioFaker;

        public BodyMatchFilterTest()
        {
            var fakerBodyRule = new Faker<BodyRule>()
                .RuleFor(m => m.Type, f => f.PickRandom<BodyRuleTypes>())
                .RuleFor(m => m.Rule, f => f.Random.String());
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3));
            this.scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, _ => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Id, n => n.Random.ToString());
        }

        [Fact]
        public void BodyMatchFilterMatchSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = fakeScenario.RequestMatchRules.BodyRules.ToList()[0].Rule
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort() { Scenarios = input.Scenarios, Body = input.Body }).BodyMatch;
            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void BodyMatchFilterMatchFail()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = ""
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort() { Scenarios = input.Scenarios, Body = input.Body.ToString() }).BodyMatch;
            var Expected = new List<string> { fakeScenario.Id };

            Assert.NotEqual(Expected, Actual);
        }

    }
}
