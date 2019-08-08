using Bogus;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models
{
    public class RequestMatchRulesTests
    {
        private Faker<RequestMatchRules> requestMatchRulesFake;

        public RequestMatchRulesTests()
        {
            this.requestMatchRulesFake = new Faker<RequestMatchRules>()
                .RuleFor(m => m.HeaderRules, f => new Dictionary<string, string>())
                .RuleFor(m => m.QueryRules, f => new Dictionary<string, string>())
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
