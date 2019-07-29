using Bogus;
using Microsoft.Extensions.Primitives;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class HeaderMatchFilterTests
    {

        [Fact]

        public void HeaderMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var faker = new Faker();

            var scenarioFake = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    HeaderRules = faker.Make(10, () => faker.Random.String()).ToDictionary<string, string>(val => f.Random.String())
                }).RuleFor(m => m.Id, f => f.Lorem.Word());

            var fakeScenario = scenarioFake.Generate();

            var headers = new NameValueCollection();

            fakeScenario.RequestMatchRules.HeaderRules

            /*               foreach(HeaderRules in scenarioFake)
                       {

                       }
           */
            var input = new
            {
                /* Scenarios = new List<Scenario> { fakeScenario },
                 Query = new NameValueCollection(fakeScenario.RequestMatchRules.HeaderRules
                  .Select(pair => new KeyValuePair<string, StringValues>(pair.Key, new StringValues(pair.Value))).ToDictionary(x => x.Key, x => x.Value))*/

            };

            #endregion
        }

    }
}
