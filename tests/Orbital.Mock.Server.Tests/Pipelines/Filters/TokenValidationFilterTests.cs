using System;
using System.Linq;
using System.Collections.Generic;

using Microsoft.IdentityModel.Tokens;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Match;
using Orbital.Mock.Definition.Tokens;

using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Services.Interfaces;

using Bogus;
using Xunit;
using Assert = Xunit.Assert;
using NSubstitute;
using Newtonsoft.Json.Linq;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class TokenValidationFilterTests
    {
        readonly Faker WordFaker;
        readonly Faker<Scenario> ScenarioFaker;

        const int MinSecretSize = 64;

        readonly SymmetricSecurityKey symmetricKey;
        readonly AsymmetricSecurityKey asymmetricKey;

        readonly JsonWebKey symmetricJwk;
        readonly JsonWebKey asymmetricJwk;

        public TokenValidationFilterTests()
        {

            WordFaker = new Faker();

            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerJObject = new Faker<JObject>()
                            .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3));
            var fakerTokenRule = new Faker<TokenRules>()
                .RuleFor(t => t.ValidationType, v => TokenValidationType.JWT_VALIDATION);

            ScenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, _ => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Id, n => n.Random.ToString())
                .RuleFor(m => m.TokenRules, () => fakerTokenRule);

            asymmetricKey = JwtUtils.CreateAsymmetricJwk();
            asymmetricJwk = JsonWebKeyConverter.ConvertFromSecurityKey(asymmetricKey);

            symmetricKey = JwtUtils.CreateSymmetricJwk(TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize));
            symmetricJwk = JsonWebKeyConverter.ConvertFromSecurityKey(symmetricKey);
        }


        static IPublicKeyService GetPublicKeyServiceMock(JsonWebKey publicKey)
        {
            var mock = Substitute.For<IPublicKeyService>();
            mock.GetKey(default).ReturnsForAnyArgs(publicKey);
            mock.IssuerSigningKeyResolver(default, default, default, default)
                .ReturnsForAnyArgs(new List<SecurityKey> { publicKey });
            return mock;
        }

        /// <summary>
        /// A utility method that creates a ProcessMessagePort for testing. 
        /// The port includes a default scenario and a default JWT signed by the asymmetricKey.
        /// </summary>
        ProcessMessagePort GetPort(string tokenParameter = null, string tokenScheme = TokenConstants.Bearer, List<Scenario> scenarios = null)
        {
            return new ProcessMessagePort()
            {
                TokenParameter = tokenParameter ?? JwtUtils.CreateEncodedJwt(asymmetricKey),
                TokenScheme = tokenScheme,
                Scenarios = scenarios ?? new List<Scenario>() { ScenarioFaker.Generate() },
            };
        }


        [Fact]
        public void TokenValidationFilterValidAsymmetricTokenSuccessTest()
        {
            #region Test Setup
            var port = GetPort();
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(asymmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Success;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterValidSymmetricTokenSuccessTest()
        {
            #region Test Setup
            var port = GetPort(JwtUtils.CreateEncodedJwt(symmetricKey));
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(symmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Success;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterNoMatchingKeyFailTest()
        {
            #region Test Setup
            var port = GetPort();
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(null));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterKeyidKeyMismatchFailTest()
        {
            #region Test Setup
            var port = GetPort();
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(symmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterExpiredTokenFailureTest()
        {
            #region Test Setup
            var port = GetPort(JwtUtils.CreateEncodedJwt(asymmetricKey, -10));
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(asymmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterTokenWithNoExpirationFailTest()
        {
            #region Test Setup
            var port = GetPort(JwtUtils.CreateEncodedJwt(asymmetricKey, 0));
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(asymmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterWithNoneValidationType()
        {
            #region Test Setup
            var fakeScenario = ScenarioFaker.Generate();
            fakeScenario.TokenRules.ValidationType = TokenValidationType.NONE;
            var port = GetPort(scenarios: new List<Scenario>() { fakeScenario });
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(null));
            var Actual = Target.Process(port);
            var ExpectedMatch = MatchResultType.Ignore;

            // Validation type set to null should ignore everything
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterWithJwtValidationType()
        {
            #region Test Setup
            var port = GetPort();
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(null));
            var Actual = Target.Process(port);
            var ExpectedMatch = MatchResultType.Fail;

            // Validation type set to JWT_VALIDATION should fail everything when there is no verification key available
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterWithJwtValidationAndReqMatchType()
        {
            #region Test Setup
            var fakeScenario = ScenarioFaker.Generate();
            fakeScenario.TokenRules.ValidationType = TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH;
            var port = GetPort(scenarios: new List<Scenario>() { fakeScenario });
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(null));
            var Actual = Target.Process(port);
            var ExpectedMatch = MatchResultType.Fail;

            // Validation type set to JWT_VALIDATION_AND_REQUEST_MATCH should fail everything when there is no verification key available
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterMalformedTokenFailTest()
        {
            #region Test Setup
            var port = GetPort(TestUtils.GetRandomString(WordFaker));
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(asymmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterInvalidSchemeFailTest()
        {
            #region Test Setup
            var port = GetPort(tokenScheme: "InVaLiDsChEmE");
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(asymmetricJwk));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterInvalidSigningKeyFailTest()
        {
            #region Test Setup
            var port = GetPort();
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(null));
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.All(Actual.TokenValidationResults, x => Assert.Equal(ExpectedMatch, x.Match));
        }

        [Fact]
        public void TokenValidationFilterInvalidPipelineFailTest()
        {
            #region Test Setup
            var port = new ProcessMessagePort()
            {
                Faults = new List<string> { "San Andreas Fault" }
            };
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>(GetPublicKeyServiceMock(null));
            var Actual = Target.Process(port);

            Assert.Null(Actual.Token);
        }
    }
}
