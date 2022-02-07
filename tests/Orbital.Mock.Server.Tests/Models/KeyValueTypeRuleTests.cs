using Bogus;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Models.Rules;
using System.Collections.Generic;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models
{
    public class KeyValueTypeRuleTests
    {
        private Faker<KeyValueTypeRule> fakerKeyValueTypeRule;

        public KeyValueTypeRuleTests()
        {
            this.fakerKeyValueTypeRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() 
                { 
                    Type = f.PickRandom<ComparerType>(), 
                    Key = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()),
                    Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength())
                });
        }

        [Fact]
        public void KeyValuePairRuleEqualsSuccessTest()
        {
            var Target = this.fakerKeyValueTypeRule.Generate();

            var input = new KeyValueTypeRule() { Type = Target.Type, Key = Target.Key, Value = Target.Value };

            Assert.True(Target.Equals(input));
            Assert.True(Target.Equals(input as object));
        }

        [Fact]
        public void KeyValuePairRuleEqualsRuleFailsTest()
        {
            var Target = this.fakerKeyValueTypeRule.Generate();
            var input = new KeyValueTypeRule() { Type = Target.Type, Key = Target.Key, Value = Target.Value + "-wrong" };

            Assert.False(Target.Equals(input));
            Assert.False(Target.Equals(input as object));
        }

        [Fact]
        public void KeyValuePairRuleEqualsTypeFailsTest()
        {
            var Target = this.fakerKeyValueTypeRule.Generate();
            Target.Type = ComparerType.TEXTEQUALS;
            var input = new KeyValueTypeRule() { Type = ComparerType.TEXTCONTAINS, Key = Target.Key, Value = Target.Value };
            Assert.False(Target.Equals(input));
        }
    }
}
