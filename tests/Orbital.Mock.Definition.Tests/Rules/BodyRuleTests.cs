using Orbital.Mock.Definition.Rules;

using Bogus;
using Xunit;
using Newtonsoft.Json.Linq;

using Assert = Xunit.Assert;

namespace Orbital.Mock.Definition.Tests.Rules
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

            var input = new BodyRule(Target.Type, Target.Value) as object;

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
            var input = new BodyRule(ComparerType.JSONCONTAINS, Target.Value) as object;
            Assert.False(Target.Equals(input));
        }
    }
}
