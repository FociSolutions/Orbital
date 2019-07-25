using Bogus;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class ScenarioTests
    {
        [Fact]
        public void ScenarioEqualsSuccessTest()
        {
            #region TestSetup
            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String());

            var Target = scenarioFake.Generate();

            var input = new
            {
                scenario = Target as object
            };
            #endregion

            var Actual = Target.Equals(input.scenario);
            Assert.True(Actual);
        }

        [Fact]
        public void ScenarioEqualsFailsTest()
        {
            #region TestSetup
            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.String());

            var Target = scenarioFake.Generate();

            var input = new
            {
                scenario = scenarioFake.Generate()
            };

            input.scenario.Id = Target.Id + "diff";
            #endregion

            var Actual = Target.Equals(input.scenario);
            Assert.False(Actual);
        }
    }
}
