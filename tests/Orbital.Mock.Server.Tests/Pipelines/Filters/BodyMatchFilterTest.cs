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
        [Fact]
        public void BodyMatchFilterMatchSuccess()
        {
            #region

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, n => new RequestMatchRules
                {
                    BodyRules = n.Random.String()
                })
                .RuleFor(m => m.Id, n => n.Random.ToString()
                );

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = fakeScenario.RequestMatchRules.BodyRules
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
            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, n => new RequestMatchRules
                {
                    BodyRules = n.Random.String()
                })
                .RuleFor(m => m.Id, n => n.Random.ToString()
                );

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
