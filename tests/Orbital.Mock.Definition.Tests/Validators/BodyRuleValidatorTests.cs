﻿using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Validators;

using Xunit;
using Bogus;
using Newtonsoft.Json.Linq;

using Assert = Xunit.Assert;

namespace Orbital.Mock.Definition.Tests.Validators
{
    public class BodyRuleValidatorTests
    {
        private Faker<BodyRule> fakerBodyRule;

        public BodyRuleValidatorTests()
        {
            var fakerJObject = new Faker<JObject>()
                .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(40) }));
            this.fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
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
            input.Value = null;
            var Target = new BodyRuleValidator();
            var Actual = Target.Validate(input);
            Assert.False(Actual.IsValid);
        }
    }
}
