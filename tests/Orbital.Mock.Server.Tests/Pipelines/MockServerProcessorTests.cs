using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
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
        private readonly List<string> validMethods = new List<string> { HttpMethods.Get, HttpMethods.Put, HttpMethods.Post, HttpMethods.Delete };


        public MockServerProcessorTests()
        {
            var fakerResponse = new Faker<MockResponse>()
                           .RuleFor(m => m.Status, f => (int)f.PickRandom<HttpStatusCode>())
                           .RuleFor(m => m.Body, f => f.Lorem.Paragraph());
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                    .RuleFor(m => m.BodyRules, f => f.Lorem.Paragraph())
                    .RuleFor(m => m.HeaderRules, f => Enumerable.Range(1, 5)
                        .Select(i => f.Random.Word() + $"-{i}")
                        .ToDictionary(x => x, _ => f.Random.Word()))
                    .RuleFor(m => m.QueryRules, f => Enumerable.Range(1, 5)
                        .Select(i => f.Random.Word() + $"-{i}")
                        .ToDictionary(x => x, _ => f.Random.Word()));
            this.fakerScenario = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Guid().ToString())
                .RuleFor(m => m.Response, f => fakerResponse.Generate())
                .RuleFor(m => m.RequestMatchRules, f => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Path, f => $"/{f.Random.Word().Replace(" ", "")}")
                .RuleFor(m => m.Verb, f => f.PickRandom(validMethods));
        }
        [Fact]
        public void MockServerProcessorStopAfterStartTest()
        {
            var Target = new MockServerProcessor();
            Target.Start();
            var Actual = Target.Stop();

            Assert.True(Actual);
        }

        [Fact]
        public void MockServerProcessorStopBeforeStartTest()
        {
            var Target = new MockServerProcessor();
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
            httpContext.Request.Method = scenarios[0].Verb;
            httpContext.Request.Body = new MemoryStream(Encoding.ASCII.GetBytes(scenarios[0].RequestMatchRules.BodyRules));
            scenarios[0].RequestMatchRules.HeaderRules.Keys.ToList().ForEach(k => httpContext.Request.Headers.Add(k, scenarios[0].RequestMatchRules.HeaderRules[k]));
            httpContext.Request.Query = new QueryCollection(scenarios[0].RequestMatchRules.QueryRules.ToDictionary(x => x.Key, x => new StringValues(x.Value)));
            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            #endregion
            var Target = new MockServerProcessor();
            var Expected = scenarios[0].Response;
            Target.Start();
            var Actual = Target.Push(input).Result;


            Assert.Equal(Expected, Actual);
        }

        [Fact]
        public void MockServerProcessorPushWithNullInputTest()
        {
            var Target = new MockServerProcessor();
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
            var Target = new MockServerProcessor();
            Target.Start();
            var Actual = Target.Push(input).Result;
            var Expected = new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            Assert.Equal(Expected, Actual);
        }
    }
}
