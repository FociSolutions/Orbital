using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.Extensions.Primitives;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines;
using Orbital.Mock.Server.Pipelines.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Xunit;

namespace Orbital.Mock.Server.Tests.Pipelines
{
    public class MockServerProcessorTests
    {
        private Faker<Scenario> fakerScenario;
        private MockServerProcessor mockServerProcessor;
        private readonly List<HttpMethod> validMethods = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Put, HttpMethod.Post, HttpMethod.Delete };


        public MockServerProcessorTests()
        {
            var fakerBodyRule = new Faker<BodyRule>()
                .RuleFor(m => m.Type, f => f.PickRandom<BodyRuleTypes>())
                .RuleFor(m => m.Rule, f => f.Random.String());
            var fakerResponse = new Faker<MockResponse>()
                   .CustomInstantiator(f => new MockResponse(
                    (int)f.PickRandom<HttpStatusCode>(),
                    f.Lorem.Paragraph()
                    ));
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                    .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3))
                    .RuleFor(m => m.HeaderRules, f => f.Make(5, () => f.Random.String())
                        .ToDictionary(x => x, _ => f.Random.Word()))
                    .RuleFor(m => m.QueryRules, f => f.Make(5, () => f.Random.String())
                        .ToDictionary(x => x, _ => f.Random.Word()));
            this.fakerScenario = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Guid().ToString())
                .RuleFor(m => m.Response, f => fakerResponse.Generate())
                .RuleFor(m => m.RequestMatchRules, f => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Path, f => $"/{f.Random.Word().Replace(" ", "")}")
                .RuleFor(m => m.Verb, f => f.PickRandom(validMethods));
            this.mockServerProcessor = new MockServerProcessor();
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
        public void MockServerProcessorPushWithValidInputTest()
        {
            #region TestSetup
            var scenarios = this.fakerScenario.Generate(10);
            //Ensures one of the scenarios request match is unique for the test
            scenarios[0].RequestMatchRules.HeaderRules = scenarios[0].RequestMatchRules.HeaderRules.ToDictionary(x => x.Key, x => x.Value + "-unique");
            scenarios[0].RequestMatchRules.QueryRules = scenarios[0].RequestMatchRules.QueryRules.ToDictionary(x => x.Key, x => x.Value + "-unique");

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Path = scenarios[0].Path;
            httpContext.Request.Method = scenarios[0].Verb.ToString();
            httpContext.Request.Body = new MemoryStream(Encoding.ASCII.GetBytes(scenarios[0].RequestMatchRules.BodyRules.ToList()[0].Rule));
            scenarios[0].RequestMatchRules.HeaderRules.Keys.ToList().ForEach(k => httpContext.Request.Headers.Add(k, scenarios[0].RequestMatchRules.HeaderRules[k]));
            httpContext.Request.Query = new QueryCollection(scenarios[0].RequestMatchRules.QueryRules.ToDictionary(x => x.Key, x => new StringValues(x.Value)));
            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            #endregion
            var Target = this.mockServerProcessor;
            var Expected = scenarios[0].Response;
            Target.Start();
            var Actual = Target.Push(input).Result;


            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithValidInputNoMatchTest()
        {
            #region TestSetup
            var scenarios = this.fakerScenario.Generate(10);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Path = "";
            httpContext.Request.Method = HttpMethods.Get;
            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            #endregion
            var Target = this.mockServerProcessor;
            var Expected = new MockResponse();
            Target.Start();
            var Actual = Target.Push(input).Result;


            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithNullInputTest()
        {
            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(null).Result;
            var Expected = new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
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
            var Actual = Target.Push(input).Result;
            var Expected = new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
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
            var Actual = Target.Push(input).Result;
            var Expected = new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
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
            var Actual = Target.Push(input).Result;
            var Expected = new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
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
            var Actual = Target.Push(input).Result;
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
            var Actual = Target.Push(input).Result;
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
            var input = new MessageProcessorInput(httpContext.Request, this.fakerScenario.Generate(1));
            #endregion
            var Target = this.mockServerProcessor;
            Target.Start();
            var Actual = Target.Push(input).Result;
            var Expected = new MockResponse();
            Assert.Equal(Expected, Actual);
        }
    }
}
