using Bogus;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class ResponseSelectorFilterTests
    {
        [Fact]
        public void ResponseSelectFilterSuccessSingleResponseTest()
        {
            #region TestSetup
            var fakeScenario = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Guid().ToString());
            var scenarioList = fakeScenario.Generate(10);

            var random = new Random();
            var scenario = scenarioList[random.Next(scenarioList.Count)];


            #endregion
        }
    }

}
