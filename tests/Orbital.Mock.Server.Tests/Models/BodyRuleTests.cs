using Bogus;
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
            this.fakerBodyRule = new Faker<BodyRule>()
                .RuleFor(m => m.Type, f => f.PickRandom<BodyRuleTypes>())
                .RuleFor(m => m.Rule, f => f.Random.String());
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
                Rule = Target.Rule + "diff"
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
    }
}
