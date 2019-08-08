using Bogus;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Validators;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Models.Validators
{
    public class RequestMatchRulesValidatorTests
    {
        private Faker<RequestMatchRules> requestMatchRulesFake;

        public RequestMatchRulesValidatorTests()
        {
            this.requestMatchRulesFake = new Faker<RequestMatchRules>()
                .RuleFor(m => m.HeaderRules, f => new Dictionary<string, string>())
                .RuleFor(m => m.QueryRules, f => new Dictionary<string, string>())
                .RuleFor(m => m.BodyRules, f => new List<BodyRule>());
        }
        [Fact]
        public void RequestMatchRulesValidatorSuccessTest()
        {
            #region TestSetup
            var input = new
            {
                requestMatchRules = requestMatchRulesFake.Generate()
            };
            #endregion
            var Target = new RequestMatchRulesValidator();

            var Actual = Target.Validate(input.requestMatchRules);
            Assert.True(Actual.IsValid);
        }

        [Fact]
        public void RequestMatchRulesValidatorHeaderRulesNullTest()
        {
            #region TestSetup
            var requestMatchRules = this.requestMatchRulesFake.Generate();
            requestMatchRules.HeaderRules = null;
            var input = new
            {
                requestMatchRules
            };
            #endregion
            var Target = new RequestMatchRulesValidator();

            var Actual = Target.Validate(input.requestMatchRules);
            Assert.False(Actual.IsValid);
        }

        [Fact]
        public void RequestMatchRulesValidatorQueryRulesNullTest()
        {
            #region TestSetup
            var requestMatchRules = this.requestMatchRulesFake.Generate();
            requestMatchRules.QueryRules = null;
            var input = new
            {
                requestMatchRules
            };
            #endregion
            var Target = new RequestMatchRulesValidator();

            var Actual = Target.Validate(input.requestMatchRules);
            Assert.False(Actual.IsValid);
        }

        [Fact]
        public void RequestMatchRulesValidatorBodyRulesNullTest()
        {
            #region TestSetup
            var requestMatchRules = this.requestMatchRulesFake.Generate();
            requestMatchRules.BodyRules = null;
            var input = new
            {
                requestMatchRules
            };
            #endregion
            var Target = new RequestMatchRulesValidator();

            var Actual = Target.Validate(input.requestMatchRules);
            Assert.False(Actual.IsValid);
        }
    }
}
