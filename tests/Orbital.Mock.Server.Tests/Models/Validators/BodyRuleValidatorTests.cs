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
            var fakerJsonInput = new Faker<JsonInput>()
                .RuleFor(m => m.Value, f => f.Random.String());
            var fakerBodyRule = new Faker<BodyRule>()
                .RuleFor(m => m.Type, f => f.PickRandom<BodyRuleTypes>())
                .RuleFor(m => m.Rule, f => (new JObject(fakerJsonInput.Generate())));
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

        private class JsonInput
        {
            public string Value { get; set; }
        }
    }
}
