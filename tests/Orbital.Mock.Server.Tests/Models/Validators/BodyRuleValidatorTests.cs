using Bogus;
using Newtonsoft.Json.Linq;
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
            var fakerJObject = new Faker<JObject>()
                .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(40) }));
            this.fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<BodyRuleTypes>(), fakerJObject.Generate()));
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
