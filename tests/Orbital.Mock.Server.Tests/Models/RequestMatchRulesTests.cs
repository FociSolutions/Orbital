using System;
using System.Collections.Generic;

using Orbital.Mock.Definition.Rules;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Models
{
    public class RequestMatchRulesTests
    {
        private Faker<RequestMatchRules> requestMatchRulesFake;

        public RequestMatchRulesTests()
        {
            this.requestMatchRulesFake = new Faker<RequestMatchRules>()
                .RuleFor(m => m.UrlRules, f => new List<PathTypeRule>())
                .RuleFor(m => m.HeaderRules, f => new List<KeyValueTypeRule>())
                .RuleFor(m => m.QueryRules, f => new List<KeyValueTypeRule>())
                .RuleFor(m => m.BodyRules, f => new List<BodyRule>());
        }
        [Fact]
        public void EqualsSuccessTest()
        {
            #region TestSetup
            var Target = requestMatchRulesFake.Generate();

            var input = new
            {
                requestMatchRule = Target as Object
            };
            #endregion

            var Actual = Target.Equals(input.requestMatchRule);

            Assert.True(Actual);
        }

        [Fact]
        public void EqualsFailsHeaderRulesTest()
        {
            #region TestSetup
            var Target = requestMatchRulesFake.Generate();

            var input = new
            {
                requestMatchRule = new
                {
                    QueryRules = Target.QueryRules,
                    BodyRules = Target.BodyRules
                }
            };
            #endregion

            var Actual = Target.Equals(input.requestMatchRule);

            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsQueryRulesTest()
        {
            #region TestSetup
            var Target = requestMatchRulesFake.Generate();

            var input = new
            {
                requestMatchRule = new
                {
                    HeaderRules = Target.HeaderRules,
                    BodyRules = Target.BodyRules
                }
            };
            #endregion

            var Actual = Target.Equals(input.requestMatchRule);

            Assert.False(Actual);
        }

        [Fact]
        public void EqualsFailsBodyRulesTest()
        {
            #region TestSetup
            var Target = requestMatchRulesFake.Generate();

            var input = new
            {
                requestMatchRule = new
                {
                    QueryRules = Target.QueryRules,
                    HeaderRules = Target.HeaderRules
                }
            };
            #endregion

            var Actual = Target.Equals(input.requestMatchRule);

            Assert.False(Actual);
        }
    }

}
