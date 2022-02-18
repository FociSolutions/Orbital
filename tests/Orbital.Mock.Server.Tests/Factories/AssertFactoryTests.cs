using Bogus;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Models.Rules;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Assert = Xunit.Assert;
using AssertOrbital = Orbital.Mock.Server.Models.Assert;

namespace Orbital.Mock.Server.Tests.Factories
{
    public class AssertFactoryTests
    {
        [Fact]
        public void AssertFactoryReturnsListForQueries()
        {
            #region TestSetup
            var Target = new AssertFactory();
            var faker = new Faker();
            var fakerQueryRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() { Type = f.PickRandom<ComparerType>(), Key = f.Random.String(), Value = f.Random.String() });

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    QueryRules = fakerQueryRule.Generate(10)
                })
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();
            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Query = fakeScenario.RequestMatchRules.QueryRules.Select(r => r.GenerateKeyValuePair())
            };
            var actual = new List<AssertOrbital>();
            #endregion
            foreach (var rule in fakeScenario.RequestMatchRules.QueryRules)
            {
                actual.AddRange(Target.CreateAssert(rule, input.Query));
                
            }

            foreach (var expected in input.Query)
            {
                Assert.NotNull(actual.Select(a => a.Expect == expected.Key));
                Assert.NotNull(actual.Select(a => a.Expect == expected.Value));
                Assert.NotNull(actual.Select(a => a.Actual == expected.Key));
                Assert.NotNull(actual.Select(a => a.Actual == expected.Value));
            }

        }

        [Fact]
        public void AssertFactoryReturnsListForHeaders()
        {
            #region TestSetup
            var Target = new AssertFactory();
            var faker = new Faker();
            var fakerHeaderRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() { Type = f.PickRandom<ComparerType>(), Key = f.Random.String(), Value = f.Random.String() });

            var scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, f => new RequestMatchRules
                {
                    HeaderRules = fakerHeaderRule.Generate(10)
                })
                .RuleFor(m => m.Id, f => f.Random.Word());

            var fakeScenario = scenarioFaker.Generate();
            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Header = fakeScenario.RequestMatchRules.HeaderRules.Select(r => r.GenerateKeyValuePair())
            };
            var actual = new List<AssertOrbital>();
            #endregion

            foreach(var rule in fakeScenario.RequestMatchRules.HeaderRules)
            {
                actual.AddRange(Target.CreateAssert(rule, input.Header));
            }
            
            foreach (var expected in input.Header)
            {
                Assert.NotNull(actual.Select(a => a.Expect == expected.Key));
                Assert.NotNull(actual.Select(a => a.Expect == expected.Value));
                Assert.NotNull(actual.Select(a => a.Actual == expected.Key));
                Assert.NotNull(actual.Select(a => a.Actual == expected.Value));
            }
        }

        [Fact]
        public void AssertFactoryReturnsListForBody()
        {
            #region TestSetup
            var Target = new AssertFactory();
            var fakerJObject = new Faker<JObject>()
                           .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3));
            Faker<Scenario> scenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, _ => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Id, n => n.Random.ToString());
            var fakeScenario = scenarioFaker.Generate();

            var input = new
            {
                Scenarios = new List<Scenario>() { fakeScenario },
                Body = fakeScenario.RequestMatchRules.BodyRules.ToList()[0].Value
            };
            var actual = new List<AssertOrbital>();
            #endregion

            foreach(var rule in fakeScenario.RequestMatchRules.BodyRules)
            {
                actual.AddRange(Target.CreateAssert(rule, input.Body));
            }
            
            Assert.NotNull(actual.Select(a => a.Expect == input.Body));
        }
    }
}
