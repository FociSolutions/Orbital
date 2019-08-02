using Bogus;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models.Validators
{
    public class BodyRuleValidatorTests
    {
        private Faker<BodyRule> fakerBodyRule;

        public BodyRuleValidatorTests()
        {
            this.fakerBodyRule = new Faker<BodyRule>()
                .RuleFor(m => m.Type, f => f.PickRandom<BodyRuleTypes>())
                .RuleFor(m => m.Rule, f => f.Random.String());
        }
        [Fact]
        public void BodyRuleValidatorSuccessTest()
        {
            var input = fakerBodyRule.Generate();
            var Target = new BodyRuleValidator();
            var Actual = Target.Validate(input);
            Assert.True(Actual.IsValid);
        }

        [Fact]
        public void BodyRuleValidatorFailsNullRuleTest()
        {
            var input = fakerBodyRule.Generate();
            input.Rule = null;
            var Target = new BodyRuleValidator();
            var Actual = Target.Validate(input);
            Assert.False(Actual.IsValid);
        }


    }
}
