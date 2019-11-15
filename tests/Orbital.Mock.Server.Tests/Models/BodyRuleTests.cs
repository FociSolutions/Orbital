using Bogus;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Orbital.Mock.Server.Tests.Models.Validators;
using Xunit;

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
                .CustomInstantiator(f => new BodyRule(f.PickRandom<BodyRuleTypes>(), fakerJObject.Generate()));
        }
        [Fact]
        public void BodyRuleEqualsSuccessTest()
        {
            var Target = this.fakerBodyRule.Generate();

            var input = new BodyRule(Target.Type, Target.Rule) as object;

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
            Target.Type = BodyRuleTypes.BodyEquality;
            var input = new BodyRule(BodyRuleTypes.BodyContains, Target.Rule) as object;
            Assert.False(Target.Equals(input));
        }
    }
}
