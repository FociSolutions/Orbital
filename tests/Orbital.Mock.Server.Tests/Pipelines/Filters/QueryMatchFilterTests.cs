using Bogus;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Extensions.Primitives;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class QueryMatchFilterTests
    {
        [Fact]
        public void QueryMatchFilterSuccessTest()
        {
            #region TestSetup
            var fakeString = new Faker<string>().RuleFor(x => x, f => f.Lorem.Word());

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    QueryRules = fakeString.Generate(10).ToDictionary<string, string>(val => f.Lorem.Word())
                })
                .RuleFor(m => m.Id, f => f.Lorem.Word());

            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Query = new QueryCollection(fakeScenario.RequestMatchRules.QueryRules.)
            }
            #endregion
        }
    }
}
