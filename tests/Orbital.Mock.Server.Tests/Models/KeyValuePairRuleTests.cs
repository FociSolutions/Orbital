using Bogus;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Models.Rules;
using System.Collections.Generic;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models
{
    public class KeyValuePairRuleTests
    {
        private Faker<KeyValuePairRule> fakerKeyValuePairRule;

        public KeyValuePairRuleTests()
        {
            this.fakerKeyValuePairRule = new Faker<KeyValuePairRule>()
                .CustomInstantiator(f => new KeyValuePairRule() { Type = f.PickRandom<ComparerType>(), RuleValue = new KeyValuePair<string, string>(f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()), f.Random.AlphaNumeric(TestUtils.GetRandomStringLength())) });
        }

        [Fact]
        public void KeyValuePairRuleEqualsSuccessTest()
        {
            var Target = this.fakerKeyValuePairRule.Generate();

            var input = new KeyValuePairRule() { Type = Target.Type, RuleValue = Target.RuleValue };

            Assert.True(Target.Equals(input));
        }

        [Fact]
        public void KeyValuePairRuleEqualsRuleFailsTest()
        {
            var Target = this.fakerKeyValuePairRule.Generate();
            var input = new KeyValuePairRule() { Type = Target.Type, RuleValue = new KeyValuePair<string, string>() } as object;
            Assert.False(Target.Equals(input));
        }

        [Fact]
        public void KeyValuePairRuleEqualsTypeFailsTest()
        {
            var Target = this.fakerKeyValuePairRule.Generate();
            Target.Type = ComparerType.TEXTEQUALS;
            var input = new KeyValuePairRule() { Type = ComparerType.TEXTCONTAINS, RuleValue = Target.RuleValue };
            Assert.False(Target.Equals(input));
        }
    }
}
