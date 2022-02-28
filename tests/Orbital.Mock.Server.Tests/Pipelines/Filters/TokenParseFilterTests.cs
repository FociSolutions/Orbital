using System.Collections.Generic;

using Microsoft.Net.Http.Headers;

using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Filters;

using Xunit;
using Assert = Xunit.Assert;

using Bogus;

namespace Orbital.Mock.Server.Tests.Pipelines.Filters
{
    public class TokenParseFilterTests
    {
        private readonly Faker WordFaker;

        public TokenParseFilterTests()
        {
            WordFaker = new Faker();
        }

        [Fact]
        public void TokenParseFilterMissingHeaderFailTest()
        {
            #region Test Setup
            var port = new ProcessMessagePort()
            {
                Headers = new List<KeyValuePair<string, string>>()
            };
            #endregion

            var Target = new TokenParseFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            Assert.Null(Actual.TokenScheme);
            Assert.Null(Actual.TokenParameter);
        }

        [Fact]
        public void TokenParseFilterInvalidTokenFailTest()
        {
            #region Test Setup
            var port = new ProcessMessagePort()
            {
                Headers = new List<KeyValuePair<string, string>>
                {
                    KeyValuePair.Create(HeaderNames.Authorization, TestUtils.GetRandomString(WordFaker))
                }
            };
            #endregion

            var Target = new TokenParseFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            Assert.Null(Actual.TokenScheme);
            Assert.Null(Actual.TokenParameter);
        }

        [Fact]
        public void TokenParseFilterValidTokenSuccessTest()
        {
            #region Test Setup
            string secret = TestUtils.GetRandomString(WordFaker, minLen: 64);
            string token = TestUtils.GenerateJwt(secret);

            var port = new ProcessMessagePort()
            {
                Headers = new List<KeyValuePair<string, string>>
                {
                    KeyValuePair.Create(HeaderNames.Authorization, $"{TokenConstants.Bearer} {token}")
                }
            };
            #endregion

            var Target = new TokenParseFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            Assert.Equal(TokenConstants.Bearer, Actual.TokenScheme);
            Assert.Equal(token, Actual.TokenParameter);
        }

        [Fact]
        public void TokenParseFilterInvalidPipelineFailTest()
        {
            #region Test Setup
            var port = new ProcessMessagePort()
            {
                Faults = new List<string> { "San Andreas Fault" }
            };
            #endregion

            var Target = new TokenParseFilter<ProcessMessagePort>();
            var Actual = Target.Process(port);

            Assert.Null(Actual.TokenScheme);
            Assert.Null(Actual.TokenParameter);
        }
    }
}
