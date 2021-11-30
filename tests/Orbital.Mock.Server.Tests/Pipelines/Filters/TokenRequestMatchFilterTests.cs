using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Collections.Generic;

using Microsoft.Net.Http.Headers;

using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.RuleMatchers;

using Xunit;
using Assert = Xunit.Assert;

using Bogus;
using Scriban;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using Orbital.Mock.Server.Factories.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class TokenRequestMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFaker;
        private IRuleMatcher ruleMatcher = new RuleMatcher();
        private IAssertFactory assertFactory = new AssertFactory();

        public TokenRequestMatchFilterTests()
        {
            var fakeTokenRequestMatchRules = new Faker<KeyValuePairRule>()
                .CustomInstantiator(f => new KeyValuePairRule()
                {
                    Type = ComparerType.TEXTEQUALS,
                    RuleValue = new KeyValuePair<string, string>(f.Random.Word(), f.Random.Word())
                });
            var fakeTokenRule = new Faker<TokenRuleInfo>()
                .RuleFor(t => t.Rules, f => fakeTokenRequestMatchRules.Generate(5));

            scenarioFaker = new Faker<Scenario>()
                                .RuleFor(m => m.TokenRule, fakeTokenRule)
                                .RuleFor(m => m.Id, f => Guid.NewGuid().ToString());
        }

        [Fact]
        public void TokenMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.TokenRule.ValidationType = TokenValidationType.REQUEST_MATCH;

            string secret = TestUtils.GetRandomString(new Faker(), minLen: 64);
            var rules = fakeScenario.TokenRule.Rules.Select(r => r.RuleValue);
            var jwtString = TestUtils.GenerateJwt(secret, claims: rules.ToList());
            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = jwtString,
                SigningKeys = new List<string>(),
                Scenarios = new List<Scenario>() { fakeScenario },
                Token = new JwtSecurityToken(jwtString)
            };
            #endregion

            var Target = new TokenRequestMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);
            Target.Process(port);

            Assert.Equal(rules.Count(), port.TokenMatchResults.Where(x => x.Match == MatchResultType.Success).Count());
            Assert.False(port.TokenMatchResults.Where(x => x.Match == MatchResultType.Fail).Any());
        }

        [Fact]
        public void TokenMatchInvalidMatchFailureTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.TokenRule.ValidationType = TokenValidationType.REQUEST_MATCH;
            fakeScenario.TokenRule.CheckExpired = true;

            string secret = TestUtils.GetRandomString(new Faker(), minLen: 64);
            var rules = fakeScenario.TokenRule.Rules.Select(r => KeyValuePair.Create(r.RuleValue.Key, "test")).Take(4).ToList();
            var jwtString = TestUtils.GenerateJwt(secret, claims: rules);

            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = jwtString,
                SigningKeys = new List<string>(),
                Scenarios = new List<Scenario>() { fakeScenario },
                Token = new JwtSecurityToken(jwtString)
            };
            #endregion

            var Target = new TokenRequestMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);
            Target.Process(port);

            Assert.Null(port.Token);
            Assert.True(port.TokenMatchResults.Select(x => x.Match == MatchResultType.Fail).Any());
        }

        [Fact]
        public void JWTValidationFailedCheckTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.TokenRule.ValidationType = TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH;

            string secret = TestUtils.GetRandomString(new Faker(), minLen: 64);
            var rules = fakeScenario.TokenRule.Rules.Select(r => r.RuleValue);
            var jwtString = TestUtils.GenerateJwt(secret, claims: rules.ToList());
            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = jwtString,
                SigningKeys = new List<string>(),
                Scenarios = new List<Scenario>() { fakeScenario },
                Token = null
            };
            #endregion

            var Target = new TokenRequestMatchFilter<ProcessMessagePort>(assertFactory, ruleMatcher);
            Target.Process(port);

            Assert.Single(port.TokenMatchResults);
            Assert.True(port.TokenMatchResults.Select(x => x.Match == MatchResultType.Fail).Any());
        }

    }
}
