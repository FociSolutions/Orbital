using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Collections.Generic;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;

using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Server.Pipelines;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Tests.Pipelines.Filters;

using Bogus;
using Xunit;
using Scriban;
using NSubstitute;
using Newtonsoft.Json.Linq;

using Assert = Xunit.Assert;

namespace Orbital.Mock.Server.Tests.Pipelines
{
    public class MockServerProcessorTests
    {
        private readonly Faker<Scenario> fakerScenario;
        private readonly MockServerProcessor mockServerProcessor;
        private readonly List<HttpMethod> validMethods = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Put, HttpMethod.Post, HttpMethod.Delete };

        private static readonly ComparerType[] BodyRuleComparisons = new[] 
        { 
            ComparerType.JSONSCHEMA, ComparerType.JSONPATH, 
            ComparerType.TEXTCONTAINS, ComparerType.TEXTENDSWITH, ComparerType.TEXTEQUALS,ComparerType.TEXTSTARTSWITH, 
            ComparerType.REGEX 
        };

        private static readonly ComparerType[] HeaderRuleComparisons = new[]
        {
            ComparerType.JSONCONTAINS, ComparerType.JSONEQUALITY, ComparerType.JSONPATH, ComparerType.JSONSCHEMA
        };


        private static readonly ComparerType[] UrlRuleComparisons = new[]
        {
            ComparerType.JSONCONTAINS, ComparerType.JSONEQUALITY, ComparerType.JSONPATH, ComparerType.JSONSCHEMA,
            ComparerType.TEXTCONTAINS, ComparerType.TEXTENDSWITH, ComparerType.TEXTSTARTSWITH,
            ComparerType.REGEX
        };

        private readonly Dictionary<string, string> emptyHeadersWithAllowAllCors = new Dictionary<string, string>
        {
            ["Access-Control-Allow-Origin"] = "*",
            ["Access-Control-Allow-Methods"] = "GET, POST"
        };

        public static IPublicKeyService GetPublicKeyServiceMock()
        {
            var mock = Substitute.For<IPublicKeyService>();
            mock.GetKey(default).ReturnsForAnyArgs((JsonWebKey)null);
            return mock;
        }

        // an always non-canceled cancellation token (to assume a valid non-canceled pipeline)
        private readonly CancellationToken cancellationToken = new CancellationTokenSource().Token;
        public MockServerProcessorTests()
        {
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerJObject = new Faker<JObject>()
                .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandomWithout(BodyRuleComparisons), fakerJObject.Generate()));
            var fakerHeaderQueryRule = new Faker<KeyValueTypeRule>()
                .CustomInstantiator(f => new KeyValueTypeRule() { Type = f.PickRandomWithout(HeaderRuleComparisons), Key = f.Random.String(), Value = f.Random.String() });
            var fakerUrlRule = new Faker<PathTypeRule>()
                .CustomInstantiator(f => new PathTypeRule() { Type = f.PickRandomWithout(UrlRuleComparisons), Path = f.Random.String() });
            var fakerResponse = new Faker<MockResponse>()
                   .CustomInstantiator(f => new MockResponse(
                    (int)f.PickRandom<HttpStatusCode>(),
                    f.Lorem.Paragraph()
                    ));
            var fakerTokenRule = new Faker<TokenRuleInfo>();
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                    .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3))
                    .RuleFor(m => m.HeaderRules, f => fakerHeaderQueryRule.Generate(3))
                    .RuleFor(m => m.QueryRules, f => fakerHeaderQueryRule.Generate(3))
                    .RuleFor(m => m.UrlRules, f => fakerUrlRule.Generate(3));
            this.fakerScenario = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Guid().ToString())
                .RuleFor(m => m.Response, f => fakerResponse.Generate())
                .RuleFor(m => m.RequestMatchRules, f => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Path, f => $"/{f.Random.Word().Replace(" ", "")}")
                .RuleFor(m => m.Verb, f => f.PickRandom(validMethods))
                .RuleFor(m => m.TokenRule, f => fakerTokenRule.Generate());
            this.mockServerProcessor = new MockServerProcessor(new AssertFactory(), new RuleMatcher(), new TemplateContext(), GetPublicKeyServiceMock());
        }
        [Fact]
        public void MockServerProcessorStopAfterStartTest()
        {
            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Stop();

            Assert.True(Actual);
        }

        [Fact]
        public void MockServerProcessorStopBeforeStartTest()
        {
            var Target = this.mockServerProcessor;
            var Actual = Target.Stop();
            Assert.True(Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithValidInputTestWithValidPathResponse()
        {
            #region TestSetup
            var scenarios = this.fakerScenario.Generate(10);
            //Ensures one of the scenarios request match is unique for the test
            scenarios[0].RequestMatchRules.HeaderRules = scenarios[0].RequestMatchRules.HeaderRules.Select(x =>
                                                        new KeyValueTypeRule() {Type = x.Type, Key = x.Key, Value = x.Value + "-unique" }).ToList();
            scenarios[0].RequestMatchRules.QueryRules = scenarios[0].RequestMatchRules.QueryRules.Select(x =>
                                                        new KeyValueTypeRule() { Type = x.Type, Key = x.Key, Value = x.Value + "-unique" }).ToList();
            scenarios[0].RequestMatchRules.UrlRules = scenarios[0].RequestMatchRules.UrlRules.Select(x =>
                                                        new PathTypeRule() { Type = x.Type, Path = x.Path + "-unique" }).ToList();

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Path = scenarios[0].Path;
            httpContext.Request.Method = scenarios[0].Verb.ToString();
            httpContext.Request.Body = new MemoryStream(Encoding.ASCII.GetBytes(scenarios[0].RequestMatchRules.BodyRules.ToList()[0].Value));
            scenarios[0].RequestMatchRules.HeaderRules.ToList().ForEach(k => httpContext.Request.Headers.Add(k.Key, k.Value));
            httpContext.Request.Query = new QueryCollection(scenarios[0].RequestMatchRules.QueryRules.ToDictionary(x => x.Key, x => new StringValues(x.Value)));
            
            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            #endregion
            var Target = this.mockServerProcessor;
            var Expected = scenarios[0].Response;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;


            Assert.Equal(Expected, Actual);
        }

        /// <summary>
        /// Ensure that sending invalid JSON into the pipeline does not cause the pipeline
        /// to stall
        /// </summary>
        [Fact]
        public void MockServerProcessorPushWithInvalidJsonFailure()
        {
            #region TestSetup
            var scenarios = this.fakerScenario.Generate(1);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Path = scenarios[0].Path;
            httpContext.Request.Method = scenarios[0].Verb.ToString();
            httpContext.Request.Body = new MemoryStream(Encoding.ASCII.GetBytes("invalid \\json"));
            scenarios[0].RequestMatchRules.HeaderRules.ToList().ForEach(k => httpContext.Request.Headers.Add(k.Key, k.Value));
            httpContext.Request.Query = new QueryCollection(scenarios[0].RequestMatchRules.QueryRules.ToDictionary(x => x.Key, x => new StringValues(x.Value)));

            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken);
            Assert.NotNull(Actual.Result.Body);
        }

        [Fact]
        public void MockServerProcessorPushWithValidInputNoMatchTest()
        {
            #region TestSetup
            var scenarios = this.fakerScenario.Generate(10);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Path = "/diff";
            httpContext.Request.Method = HttpMethods.Get;
            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            #endregion

            var Target = this.mockServerProcessor;
            var Expected = new MockResponse();
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;


            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithNullInputTest()
        {
            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(null, cancellationToken).Result;
            var Expected = new MockResponse { Status = StatusCodes.Status400BadRequest, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithInvalidInputNullRequestTest()
        {
            #region TestSetup
            var input = new MessageProcessorInput(null, new List<Scenario>());
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;
            var Expected = new MockResponse { Status = StatusCodes.Status400BadRequest, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithInvalidInputNullBodyTest()
        {
            #region TestSetup
            var httpContext = new DefaultHttpContext();
            var input = new MessageProcessorInput(httpContext.Request, new List<Scenario>());
            input.ServerHttpRequest.Body = null;
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;
            var Expected = new MockResponse { Status = StatusCodes.Status400BadRequest, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithInvalidInputNullScenariosTest()
        {
            #region TestSetup
            var httpContext = new DefaultHttpContext();
            var input = new MessageProcessorInput(httpContext.Request, null);
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;
            var Expected = new MockResponse { Status = StatusCodes.Status400BadRequest, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithInvalidVerbTest()
        {
            #region TestSetup
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = HttpMethods.Options;
            var input = new MessageProcessorInput(httpContext.Request, new List<Scenario>());
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;
            var Expected = new MockResponse();
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithNullPathTest()
        {
            #region TestSetup
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = HttpMethods.Get;
            httpContext.Request.Path = null;
            var input = new MessageProcessorInput(httpContext.Request, new List<Scenario>());
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;
            var Expected = new MockResponse();
            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithWrongPathTest()
        {
            #region TestSetup
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = HttpMethods.Get;
            httpContext.Request.Path = "";
            var input = new MessageProcessorInput(httpContext.Request, new List<Scenario>());
            #endregion

            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input, cancellationToken).Result;
            var Expected = new MockResponse();
            Assert.Equal(Expected, Actual);
        }
    }
}
