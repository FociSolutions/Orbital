using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Factories;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Models.Rules;
using Orbital.Mock.Server.Pipelines;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.RuleMatchers;
using Orbital.Mock.Server.Tests;
using Orbital.Mock.Server.Tests.Pipelines.Filters;
using Scriban;
using Xunit;
using Assert = Xunit.Assert;
using NSubstitute;
using Orbital.Mock.Server.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace Orbital.Mock.Server.LongRunningTests
{
    public class MockServerProcessorCancelTokenTests
    {
        private MockServerProcessor _mockServerProcessor;
        private readonly Faker<Scenario> _fakerScenario;
        private readonly List<HttpMethod> _validMethods = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Put, HttpMethod.Post, HttpMethod.Delete };

        public static IPublicKeyService GetPublicKeyServiceMock()
        {
            var mock = Substitute.For<IPublicKeyService>();
            mock.GetKey(default).ReturnsForAnyArgs((JsonWebKey) null);
            return mock;
        }

        public MockServerProcessorCancelTokenTests()
        {
            // these have been adapted from the MockServerProcessor test file
            Randomizer.Seed = new Random(FilterTestHelpers.Seed);
            var fakerJObject = new Faker<JObject>()
                .CustomInstantiator(f => JObject.FromObject(new { Value = f.Random.AlphaNumeric(TestUtils.GetRandomStringLength()) }));
            var fakerBodyRule = new Faker<BodyRule>()
                .CustomInstantiator(f => new BodyRule(f.PickRandom<ComparerType>(), fakerJObject.Generate()));
            var fakerHeaderQueryRule = new Faker<KeyValuePairRule>()
                .CustomInstantiator(f => new KeyValuePairRule() { Type = f.PickRandom<ComparerType>(), RuleValue = new KeyValuePair<string, string>(f.Random.String(), f.Random.String()) });
            var fakerResponse = new Faker<MockResponse>()
                .CustomInstantiator(f => new MockResponse(
                    (int)f.PickRandom<HttpStatusCode>(),
                    f.Lorem.Paragraph()
                ));
            var fakerRequestMatchRules = new Faker<RequestMatchRules>()
                .RuleFor(m => m.BodyRules, _ => fakerBodyRule.Generate(3))
                .RuleFor(m => m.HeaderRules, f => fakerHeaderQueryRule.Generate(5))
                .RuleFor(m => m.QueryRules, f => fakerHeaderQueryRule.Generate(5));
            _fakerScenario = new Faker<Scenario>()
                .RuleFor(m => m.Id, f => f.Random.Guid().ToString())
                .RuleFor(m => m.Response, f => fakerResponse.Generate())
                .RuleFor(m => m.RequestMatchRules, f => fakerRequestMatchRules.Generate())
                .RuleFor(m => m.Path, f => $"/{f.Random.Word().Replace(" ", "")}")
                .RuleFor(m => m.Verb, f => f.PickRandom(_validMethods));
            _mockServerProcessor = new MockServerProcessor(new AssertFactory(), new RuleMatcher(), new TemplateContext(), GetPublicKeyServiceMock());
        }

        /// <summary>
        /// The cancellation token is cancelled before the pipeline is initialized.
        /// The pipeline should throw an exception because it was cancelled before it begun.
        /// </summary>
        [Fact]
        public void MockServerProcessorCancelTokenBeforeRequest()
        {
            var cancelledTokenSource = new CancellationTokenSource();
            cancelledTokenSource.Cancel();

            var Target = _mockServerProcessor;
            Target.Start();
            IEnumerable<Scenario> emptyList = new List<Scenario>();

            var context = new DefaultHttpContext();
            var input = new MessageProcessorInput(context.Request, emptyList);

            var Actual = Target.Push(input, cancelledTokenSource.Token).Result.Status;
            var Expected = StatusCodes.Status500InternalServerError;
            Assert.Equal(Actual, Expected);
        }

        /// <summary>
        /// The cancellation token is cancelled while the pipeline is receiving events. The pipeline should stop and not accept any more events.
        /// </summary>
        [Fact]
        public async void MockServerProcessorCancelTokenAfterRequest()
        {
            _mockServerProcessor = new MockServerProcessor(new AssertFactory(), new RuleMatcher(), new TemplateContext(), GetPublicKeyServiceMock());

            var scenarios = GenerateRandomScenarios(out var httpContext);

            var input = new MessageProcessorInput(httpContext.Request, scenarios);
            var Target = _mockServerProcessor;

            var cancelledTokenSource = new CancellationTokenSource();

            Target.Start();

            // fill the pipeline with tasks
            var fillPipeline = new Task(() =>
            {
                while (true)
                {
                    _ = Target.Push(input, cancelledTokenSource.Token);
                }
            });

            fillPipeline.Start();
            await Task.Delay(1000);

            cancelledTokenSource.Cancel();

            var Actual = Target.PipelineIsRunning;

            // should not accept anymore data after it has been cancelled
            _ = Target.Push(input, cancelledTokenSource.Token);

            Assert.False(Actual);
        }

        public static Stream GenerateStreamFromString(string s)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(s);
            writer.Flush();
            stream.Position = 0;
            return stream;
        }

        /// <summary>
        /// The cancellation token is cancelled while the pipeline is receiving events, and ensures that the number
        /// of events are correct. It does not check if the contents of these events are correct.
        /// </summary>
        [Fact]
        public async void MockServerProcessorCancelTokenAfterRequestEnsuringInterpipelineEventsAreProcessed()
        {
            _mockServerProcessor = new MockServerProcessor(new AssertFactory(), new RuleMatcher(), new TemplateContext(), GetPublicKeyServiceMock());

            var Target = _mockServerProcessor;

            var pipelineCancelTokenSource = new CancellationTokenSource();
            var pipelineFillerCancelTokenSource = new CancellationTokenSource();

            Target.Start();
            
            // fill the pipeline with tasks as fast as possible (so that they queue)
            var fillPipeline = Task<List<Task<MockResponse>>>.Factory.StartNew(() =>
            {
                var itemsPushedIntoPipeline = new List<Task<MockResponse>>();
                while (!pipelineFillerCancelTokenSource.Token.IsCancellationRequested)
                {
                    var scenarios = GenerateRandomScenarios(out var httpContext);
                    
                    // must be valid JSON so it can propagate through the pipeline (and use up more CPU processing
                    // the JSON because it will allow it to simulate real-world conditions)
                    JObject sampleResponse = new JObject {["test"] = "message"};

                    httpContext.Request.Body = GenerateStreamFromString(sampleResponse.ToString());

                    var input = new MessageProcessorInput(httpContext.Request, scenarios);
                    itemsPushedIntoPipeline.Add(Target.Push(input, pipelineCancelTokenSource.Token));
                }

                return itemsPushedIntoPipeline;
            }, pipelineFillerCancelTokenSource.Token);

            // allow the pipeline to be sufficiently full (must be a long time to make the queue catch up)
            await Task.Delay(10000);

            pipelineFillerCancelTokenSource.Cancel();
            pipelineCancelTokenSource.Cancel();

            fillPipeline.Wait();

            fillPipeline.Result.ForEach(x => x.Wait());
        }

        /// <summary>
        /// Creates random scenarios that propagate through the pipeline up to the ResponseSelectorFilter to simulate a full pipeline
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        private IEnumerable<Scenario> GenerateRandomScenarios(out DefaultHttpContext httpContext)
        {
            // generate 10 unique scenarios (it doesn't matter what they do) as long as they get mostly through the pipeline
            var scenarios = _fakerScenario.Generate(10);
            scenarios[0].RequestMatchRules.HeaderRules = scenarios[0].RequestMatchRules.HeaderRules.Select( x =>
                                                    new KeyValuePairRule() { Type = x.Type, RuleValue = new KeyValuePair<string, string>(x.RuleValue.Key, x.RuleValue.Value + "-unique") }).ToList();
            scenarios[0].RequestMatchRules.QueryRules = scenarios[0].RequestMatchRules.QueryRules.Select(x =>
                                                         new KeyValuePairRule() { Type = x.Type, RuleValue = new KeyValuePair<string, string>(x.RuleValue.Key, x.RuleValue.Value + "-unique") }).ToList();
            httpContext = new DefaultHttpContext();
            httpContext.Request.Path = scenarios[0].Path;
            httpContext.Request.Method = scenarios[0].Verb.ToString();
            httpContext.Request.Body =
                new MemoryStream(Encoding.ASCII.GetBytes((string) scenarios[0].RequestMatchRules.BodyRules.ToList()[0].RuleValue.ToString()));
            var context = httpContext;
            scenarios[0].RequestMatchRules.HeaderRules.ToList().ForEach(k => context.Request.Headers.Add(k.RuleValue.Key, k.RuleValue.Value));
            httpContext.Request.Query = new QueryCollection(scenarios[0].RequestMatchRules.QueryRules.ToDictionary(x => x.RuleValue.Key, x => new StringValues(x.RuleValue.Value)));
            return scenarios;
        }
    }
}
