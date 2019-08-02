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
            Assert.True(Target.Equals(new { Type = Target.Type, Rule = Target.Rule }));
        }

        [Fact]
        public void EqualsRuleFailsTest()
        {
            var Target = this.fakerBodyRule.Generate();
            Assert.False(Target.Equals(new { Type = Target.Type, Rule = Target.Rule + "diff" }));
        }

        [Fact]
        public void EqualsTypeFailsTest()
        {
            var Target = this.fakerBodyRule.Generate();
            Target.Type = BodyRuleTypes.BodyEquality;
            Assert.False(Target.Equals(new { Type = BodyRuleTypes.JsonPath, Rule = Target.Rule }));
        }
    }
}
