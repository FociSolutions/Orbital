using Bogus;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class BodyRuleTests
    {
        private Faker<BodyRule> fakerBodyRule;

        public BodyRuleTests()
        {
            var fakerJsonInput = new Faker<JsonInput>()
                .RuleFor(m => m.Value, f => f.Random.String());
            var fakerBodyRule = new Faker<BodyRule>()
                .RuleFor(m => m.Type, f => f.PickRandom<BodyRuleTypes>())
                .RuleFor(m => m.Rule, f => (new JObject(fakerJsonInput.Generate())));
        }
        [Fact]
        public void EqualsSuccessTest()
        {
            var Target = this.fakerBodyRule.Generate();

            var input = new BodyRule()
            {
                Type = Target.Type,
                Rule = Target.Rule
            } as object;

            Assert.True(Target.Equals(input));
        }

        [Fact]
        public void EqualsRuleFailsTest()
        {
            var Target = this.fakerBodyRule.Generate();
            var input = new BodyRule()
            {
                Type = Target.Type,
                Rule = new JObject(new { value = "" })
            } as object;
            Assert.False(Target.Equals(input));
        }

        [Fact]
        public void EqualsTypeFailsTest()
        {
            var Target = this.fakerBodyRule.Generate();
            Target.Type = BodyRuleTypes.BodyEquality;
            var input = new BodyRule()
            {
                Type = BodyRuleTypes.JsonPath,
                Rule = Target.Rule
            } as object;
            Assert.False(Target.Equals(input));
        }

        private class JsonInput
        {
            public string Value { get; set; }
        }
    }
}
