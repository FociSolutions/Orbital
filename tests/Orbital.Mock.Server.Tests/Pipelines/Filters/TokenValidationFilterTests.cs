using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Collections.Generic;

using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
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
using Newtonsoft.Json.Linq;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class TokenValidationFilterTests
    {
        private readonly Faker WordFaker;
        private readonly Faker<Scenario> ScenarioFaker;

        private const int MinSecretSize = 64;

        public TokenValidationFilterTests()
        {
            this.WordFaker = new Faker();

            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerJObject = new Faker<JObject>()
                            .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3));
            this.ScenarioFaker = new Faker<Scenario>()
                .RuleFor(m => m.RequestMatchRules, _ => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Id, n => n.Random.ToString())
                .RuleFor(m => m.TokenValidationType, _ => TokenValidationType.JWT_VALIDATION);
        }

        [Fact]
        public void TokenValidationFilterNoSigningKeysIgnoreTest()
        {
            #region Test Setup
            string secret = TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize);
            var fakeScenario = ScenarioFaker.Generate();

            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = TestUtils.GenerateJwt(secret),
                SigningKeys = new List<string>(),
                Scenarios = new List<Scenario>() { fakeScenario },
            };
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Ignore;

            //< No signing keys supplied - all scenarios should be ignored
            Assert.True(Actual.TokenValidationResults.All(x => x.Match == ExpectedMatch));
        }

        [Fact]
        public void TokenValidationFilterMalformedTokenFailTest()
        {
            #region Test Setup
            var fakeScenario = ScenarioFaker.Generate();

            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = TestUtils.GetRandomString(WordFaker),
                SigningKeys = TestUtils.GetRandomStrings(WordFaker, 1),
                Scenarios = new List<Scenario>() { fakeScenario },
            };
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.True(Actual.TokenValidationResults.All(x => x.Match == ExpectedMatch));
        }

        [Fact]
        public void TokenValidationFilterInvalidSchemeFailTest()
        {
            #region Test Setup
            string secret = TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize);
            var fakeScenario = ScenarioFaker.Generate();

            var port = new ProcessMessagePort()
            {
                TokenScheme = "InVaLiDsChEmE",
                TokenParameter = TestUtils.GenerateJwt(secret),
                SigningKeys = new List<string> { secret },
                Scenarios = new List<Scenario>() { fakeScenario },
            };
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.True(Actual.TokenValidationResults.All(x => x.Match == ExpectedMatch));
        }

        [Fact]
        public void TokenValidationFilterInvalidSigningKeyFailTest()
        {
            #region Test Setup
            string secret = TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize);
            string wrongSecret = TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize);
            var fakeScenario = ScenarioFaker.Generate();

            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = TestUtils.GenerateJwt(secret),
                SigningKeys = new List<string> { wrongSecret },
                Scenarios = new List<Scenario>() { fakeScenario },
            };
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Fail;
            Assert.True(Actual.TokenValidationResults.All(x => x.Match == ExpectedMatch));
        }

        [Fact]
        public void TokenValidationFilterValidTokenSuccessTest()
        {
            #region Test Setup
            string secret = TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize);
            string wrongSecret = TestUtils.GetRandomString(WordFaker, minLen: MinSecretSize);
            var fakeScenario = ScenarioFaker.Generate();

            var port = new ProcessMessagePort()
            {
                TokenScheme = TokenConstants.Bearer,
                TokenParameter = TestUtils.GenerateJwt(secret),
                SigningKeys = new List<string> { secret, wrongSecret },
                Scenarios = new List<Scenario>() { fakeScenario },
            };
            #endregion

            var Target = new TokenValidationFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            var ExpectedMatch = MatchResultType.Success;
            Assert.True(Actual.TokenValidationResults.All(x => x.Match == ExpectedMatch));
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

            var Target = new TokenParseFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            Assert.Null(Actual.Token);
        }
    }
}
