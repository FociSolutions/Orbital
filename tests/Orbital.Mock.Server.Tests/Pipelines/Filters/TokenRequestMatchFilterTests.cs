using System;
using System.Linq;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Match;
using Orbital.Mock.Definition.Tokens;

using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class TokenRequestMatchFilterTests
    {
        private readonly Faker<Scenario> scenarioFaker;
        private IRuleMatcher ruleMatcher = new RuleMatcher();

        public TokenRequestMatchFilterTests()
        {
            var fakeTokenRequestMatchRules = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule()
                {
                    Type = ComparerType.TEXTEQUALS,
                    Key = f.Random.Word(),
                    Value = f.Random.Word()
                });
            var fakeTokenRule = new Faker<TokenRules>()
                .RuleFor(t => t.Rules, f => fakeTokenRequestMatchRules.Generate(5));

            scenarioFaker = new Faker<Scenario>()
                                .RuleFor(m => m.TokenRules, fakeTokenRule)
                                .RuleFor(m => m.Id, f => Guid.NewGuid().ToString());
        }

        [Fact]
        public void TokenMatchFilterMatchSuccessTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.TokenRules.ValidationType = TokenValidationType.REQUEST_MATCH;

            string secret = TestUtils.GetRandomString(new Faker(), minLen: 64);
            var rules = fakeScenario.TokenRules.Rules.Select(r => r.GenerateKeyValuePair());
            var jwtString = TestUtils.GenerateJwt(secret, claims: rules.ToList());
            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = jwtString,
                Scenarios = new List<Scenario>() { fakeScenario },
                Token = new JwtSecurityToken(jwtString)
            };
            #endregion

            var Target = new TokenRequestMatchFilter<ProcessMessagePort>(ruleMatcher);
            Target.Process(port);

            Assert.Equal(rules.Count(), port.TokenMatchResults.Where(x => x.Match == MatchResultType.Success).Count());
            Assert.False(port.TokenMatchResults.Where(x => x.Match == MatchResultType.Fail).Any());
        }

        [Fact]
        public void TokenMatchInvalidMatchFailureTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.TokenRules.ValidationType = TokenValidationType.REQUEST_MATCH;
            fakeScenario.TokenRules.CheckExpired = true;

            string secret = TestUtils.GetRandomString(new Faker(), minLen: 64);
            var rules = fakeScenario.TokenRules.Rules.Select(r => KeyValuePair.Create(r.Key, "test")).Take(4).ToList();
            var jwtString = TestUtils.GenerateJwt(secret, claims: rules);

            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = jwtString,
                Scenarios = new List<Scenario>() { fakeScenario },
                Token = new JwtSecurityToken(jwtString)
            };
            #endregion

            var Target = new TokenRequestMatchFilter<ProcessMessagePort>(ruleMatcher);
            Target.Process(port);

            Assert.Null(port.Token);
            Assert.True(port.TokenMatchResults.Select(x => x.Match == MatchResultType.Fail).Any());
        }

        [Fact]
        public void JWTValidationFailedCheckTest()
        {
            #region Test Setup
            var fakeScenario = scenarioFaker.Generate();
            fakeScenario.TokenRules.ValidationType = TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH;

            string secret = TestUtils.GetRandomString(new Faker(), minLen: 64);
            var rules = fakeScenario.TokenRules.Rules.Select(r => r.GenerateKeyValuePair());
            var jwtString = TestUtils.GenerateJwt(secret, claims: rules.ToList());
            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = jwtString,
                Scenarios = new List<Scenario>() { fakeScenario },
                Token = null
            };
            #endregion

            var Target = new TokenRequestMatchFilter<ProcessMessagePort>(ruleMatcher);
            Target.Process(port);

            Assert.Single(port.TokenMatchResults);
            Assert.True(port.TokenMatchResults.Select(x => x.Match == MatchResultType.Fail).Any());
        }

    }
}
