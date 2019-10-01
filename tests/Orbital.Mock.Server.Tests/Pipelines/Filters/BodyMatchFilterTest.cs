using Bogus;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Orbital.Mock.Server.Tests.Models.Validators;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class BodyMatchFilterTest
    {
        private readonly Faker<Scenario> scenarioFaker;

        public BodyMatchFilterTest()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerJObject = new Faker<JObject>()
                            .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<BodyRuleTypes>(), fakerJObject.Generate()));
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

            var Actual = Target.Process(new ProcessMessagePort()
                    {Scenarios = input.Scenarios, Body = input.Body.ToString()})
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Accept empty JSON bodies (because the designer's JSON validator parses
        /// JSON in terms of javascript's interpretation rather than ours)
        /// </summary>
        [Fact]
        public void BodyMatchFilterEmptyJsonMatchSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule>{new BodyRule(BodyRuleTypes.BodyEquality, new JObject())};

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = new JObject()
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort()
                    { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

            var Expected = new List<string> { fakeScenario.Id };

            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void BodyMatchFilterNullJsonMatchSuccess()
        {
            #region
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.RequestMatchRules.BodyRules =
                new List<BodyRule> { new BodyRule() };

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = new JObject()
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort()
                    { Scenarios = input.Scenarios, Body = input.Body.ToString() })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Success)).Select(x => x.ScenarioId);

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
                Body = "{}"
            };

            #endregion

            var Target = new BodyMatchFilter<ProcessMessagePort>();

            var Actual = Target.Process(new ProcessMessagePort()
                    { Scenarios = input.Scenarios, Body = input.Body })
                .BodyMatchResults.Where(x => x.Match.Equals(MatchResultType.Fail)).Select(x => x.ScenarioId).ToList();

            Assert.Contains(fakeScenario.Id, Actual);
        }
    }
}
