﻿using Bogus;
using Newtonsoft.Json.Linq;
using Xunit;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Models.Interfaces;

using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models
{
    public class BodyRuleTests
    {
        private Faker<BodyRule> fakerBodyRule;

        public BodyRuleTests()
        {
            var fakerJObject = new Faker<JObject>()
                .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            this.fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
        }
        [Fact]
        public void BodyRuleEqualsSuccessTest()
        {
            var Target = this.fakerBodyRule.Generate();

            var input = new BodyRule(Target.Type, Target.RuleValue) as object;

            Assert.True(Target.Equals(input));
        }

        [Fact]
        public void BodyRuleEqualsRuleFailsTest()
        {
            var Target = this.fakerBodyRule.Generate();
            var input = new BodyRule(Target.Type, new JObject()) as object;
            Assert.False(Target.Equals(input));
        }

        [Fact]
        public void BodyRuleEqualsTypeFailsTest()
        {
            var Target = this.fakerBodyRule.Generate();
            Target.Type = ComparerType.JSONEQUALITY;
            var input = new BodyRule(ComparerType.JSONCONTAINS, Target.RuleValue) as object;
            Assert.False(Target.Equals(input));
        }
    }
}
