using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using System.Collections.Generic;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

using Orbital.Mock.Definition.Response;
using Orbital.Mock.Server.Services.Interfaces;
using Orbital.Mock.Server.Pipelines.Envelopes;
using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Orbital.Mock.Server.Pipelines.Factories;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

using Scriban;
using Serilog;

namespace Orbital.Mock.Server.Pipelines
{
    public class MockServerProcessor : IPipeline<MessageProcessorInput, Task<MockResponse>>
    {
        
        private readonly SyncBlockFactory blockFactory;
        private CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

        #region Blocks
        private TransformBlock<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>> startBlock;
        private ActionBlock<IEnvelope<ProcessMessagePort>> endBlock;
        #endregion

        #region Filters
        private readonly PathValidationFilter<ProcessMessagePort> pathValidationFilter;
        private readonly HeaderMatchFilter<ProcessMessagePort> headerMatchFilter;
        private readonly ResponseSelectorFilter<ProcessMessagePort> responseSelectorFilter;
        private readonly QueryMatchFilter<ProcessMessagePort> queryMatchFilter;
        private readonly EndpointMatchFilter<ProcessMessagePort> endpointMatchFilter;
        private readonly BodyMatchFilter<ProcessMessagePort> bodyMatchFilter;
        private readonly UrlMatchFilter<ProcessMessagePort> urlMatchFilter;
        private readonly PolicyFilter<ProcessMessagePort> policyFilter;

        private readonly TokenParseFilter<ProcessMessagePort> tokenParseFilter;
        private readonly TokenValidationFilter<ProcessMessagePort> tokenValidationFilter;
        private readonly TokenRequestMatchFilter<ProcessMessagePort> tokenRequestMatchFilter;
        #endregion

        private bool pipelineIsRunning = false;
        public bool GetPipelineStatus() => pipelineIsRunning;

        public MockServerProcessor(IRuleMatcher ruleMatcher, TemplateContext templateContext, IPublicKeyService pubKeyService)
            : this(new PathValidationFilter<ProcessMessagePort>(),
                  new QueryMatchFilter<ProcessMessagePort>(ruleMatcher),
                  new EndpointMatchFilter<ProcessMessagePort>(),
                  new BodyMatchFilter<ProcessMessagePort>(ruleMatcher),
                  new HeaderMatchFilter<ProcessMessagePort>(ruleMatcher),
                  new UrlMatchFilter<ProcessMessagePort>(ruleMatcher),
                  new ResponseSelectorFilter<ProcessMessagePort>(templateContext),
                  new PolicyFilter<ProcessMessagePort>(),
                  new TokenParseFilter<ProcessMessagePort>(),
                  new TokenValidationFilter<ProcessMessagePort>(pubKeyService),
                  new TokenRequestMatchFilter<ProcessMessagePort>(ruleMatcher))
        {
        }

        public MockServerProcessor(
            PathValidationFilter<ProcessMessagePort> pathValidationFilter,
            QueryMatchFilter<ProcessMessagePort> queryMatchFilter,
            EndpointMatchFilter<ProcessMessagePort> endpointMatchFilter,
            BodyMatchFilter<ProcessMessagePort> bodyMatchFilter,
            HeaderMatchFilter<ProcessMessagePort> headerMatchFilter,
            UrlMatchFilter<ProcessMessagePort> urlMatchFilter,
            ResponseSelectorFilter<ProcessMessagePort> responseSelectorFilter,
            PolicyFilter<ProcessMessagePort> policyFilter,
            TokenParseFilter<ProcessMessagePort> tokenParseFilter,
            TokenValidationFilter<ProcessMessagePort> tokenValidationFilter,
            TokenRequestMatchFilter<ProcessMessagePort> tokenRequestMatchFilter
        )
        {
            this.pathValidationFilter = pathValidationFilter;
            this.queryMatchFilter = queryMatchFilter;
            this.endpointMatchFilter = endpointMatchFilter;
            this.bodyMatchFilter = bodyMatchFilter;
            this.blockFactory = new SyncBlockFactory(this.cancellationTokenSource);
            this.headerMatchFilter = headerMatchFilter;
            this.urlMatchFilter = urlMatchFilter;
            this.responseSelectorFilter = responseSelectorFilter;
            this.policyFilter = policyFilter;
            this.tokenParseFilter = tokenParseFilter;
            this.tokenValidationFilter = tokenValidationFilter;
            this.tokenRequestMatchFilter = tokenRequestMatchFilter;
        }

        /// <inheritdoc />
        public void Start()
        {
            var linkOptions = new DataflowLinkOptions { PropagateCompletion = true };

            #region Block Initialization
            this.startBlock = this.blockFactory.CreateTransformBlock(this.pathValidationFilter.Process, cancellationTokenSource);

            var broadCastBlock = this.blockFactory.CreateBroadcastBlock(envelope => envelope, cancellationTokenSource);
            var endpointFilterBlock = this.blockFactory.CreateTransformBlock(this.endpointMatchFilter.Process, cancellationTokenSource);
            var urlFilterBlock = this.blockFactory.CreateTransformBlock(this.urlMatchFilter.Process, cancellationTokenSource);
            var headerFilterBlock = this.blockFactory.CreateTransformBlock(this.headerMatchFilter.Process, cancellationTokenSource);
            var bodyMatchFilterBlock = this.blockFactory.CreateTransformBlock(this.bodyMatchFilter.Process, cancellationTokenSource);
            var queryFilterBlock = this.blockFactory.CreateTransformBlock(this.queryMatchFilter.Process, cancellationTokenSource);
            var policyFilterBlock = this.blockFactory.CreateTransformBlock(this.policyFilter.Process, cancellationTokenSource);
            var tokenParseBlock = this.blockFactory.CreateTransformBlock(this.tokenParseFilter.Process, cancellationTokenSource);
            var tokenValidationBlock = this.blockFactory.CreateTransformBlock(this.tokenValidationFilter.Process, cancellationTokenSource);
            var tokenRequestMatchBlock = this.blockFactory.CreateTransformBlock(this.tokenRequestMatchFilter.Process, cancellationTokenSource);

            var joinUrlAndOthersBlock = this.blockFactory.CreateJoinThreeBlock(new GroupingDataflowBlockOptions() { Greedy = false }, cancellationTokenSource);
            var joinRequestPartsBlock = this.blockFactory.CreateJoinThreeBlock(new GroupingDataflowBlockOptions() { Greedy = false }, cancellationTokenSource);

            var mergeBlock = this.blockFactory.CreateJoinTransformBlock((Tuple<ProcessMessagePort, ProcessMessagePort, ProcessMessagePort> Ports) => Ports.Item1, cancellationTokenSource);
            var finalmergeBlock = this.blockFactory.CreateJoinTransformBlock((Tuple<ProcessMessagePort, ProcessMessagePort, ProcessMessagePort> Ports) => Ports.Item1, cancellationTokenSource);

            var responseSelectorBlock = this.blockFactory.CreateTransformBlock(this.responseSelectorFilter.Process, cancellationTokenSource);
            this.endBlock = this.blockFactory.CreateFinalBlock(cancellationTokenSource);
            #endregion

            //< Link the 'startBlock' to the 'endpointFilterBlock' as a first step
            this.startBlock.LinkTo(endpointFilterBlock, linkOptions);
            //< After the endpoint filter - must then link to the broadcast block
            endpointFilterBlock.LinkTo(broadCastBlock, linkOptions);
            //< Broadcast block must then link to the transform blocks
            broadCastBlock.LinkTo(queryFilterBlock, linkOptions);
            broadCastBlock.LinkTo(bodyMatchFilterBlock, linkOptions);
            broadCastBlock.LinkTo(headerFilterBlock, linkOptions);
            broadCastBlock.LinkTo(urlFilterBlock, linkOptions);
            //< Broadcast links to 'tokenParseBlock' which in turn links to 'tokenValidationBlock'
            broadCastBlock.LinkTo(tokenParseBlock, linkOptions);
            tokenParseBlock.LinkTo(tokenValidationBlock, linkOptions);
            tokenValidationBlock.LinkTo(tokenRequestMatchBlock, linkOptions);
            //< Request match filters link into the 'joinRequestMatchPartsBlock'
            bodyMatchFilterBlock.LinkTo(joinRequestPartsBlock.Target1, linkOptions);
            queryFilterBlock.LinkTo(joinRequestPartsBlock.Target2, linkOptions);
            headerFilterBlock.LinkTo(joinRequestPartsBlock.Target3, linkOptions);
            //< urlFilterBlock and tokenValidationBlock link into the final join block
            urlFilterBlock.LinkTo(joinUrlAndOthersBlock.Target2, linkOptions);
            tokenRequestMatchBlock.LinkTo(joinUrlAndOthersBlock.Target3, linkOptions);
            //< The 'joined' request match blocks are linked to the 'merge' block
            joinRequestPartsBlock.LinkTo(mergeBlock, linkOptions);
            //< The 'merged' request match blocks are linked to the first target of final join block
            mergeBlock.LinkTo(joinUrlAndOthersBlock.Target1, linkOptions);
            //< The final 'join' links to final 'merge' - and then final 'merge' to response selection
            joinUrlAndOthersBlock.LinkTo(finalmergeBlock, linkOptions);
            finalmergeBlock.LinkTo(responseSelectorBlock, linkOptions);
            //< After response selection - we link to the policy filter as a final step
            responseSelectorBlock.LinkTo(policyFilterBlock, linkOptions);
            policyFilterBlock.LinkTo(this.endBlock, linkOptions);

            pipelineIsRunning = true;
        }

        /// <inheritdoc />
        public async Task<MockResponse> Push(MessageProcessorInput input, CancellationToken token)
        {
            if (!pipelineIsRunning) { return new MockResponse(503); }

            var completionSource = new TaskCompletionSource<ProcessMessagePort>();

            token.Register(() => CancelPipeline());

            if (input == null ||
                input.ServerHttpRequest == null ||
                input.ServerHttpRequest.Body == null ||
                input.HeaderDictionary == null ||
                input.QueryDictionary == null ||
                input.Scenarios == null)
            {
                var error = "One or more of the Message Processor Inputs is null";
                Log.Error("MockServerProcessor Error: {Error}", error);
                return new MockResponse { Status = 400, Body = "Something went wrong" };
            }

            var body = string.Empty;

            using (var reader = new StreamReader(input.ServerHttpRequest.Body))
            {
                body = reader.ReadToEnd();
            }

            Enum.TryParse(input.ServerHttpRequest.Method, true, out HttpMethod verb);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Path = input.ServerHttpRequest.Path,
                Verb = verb,
                Query = input.QueryDictionary,
                Headers = input.HeaderDictionary,
                Body = body
            };

            var envelope = new SyncEnvelope(completionSource, port, token);

            this.startBlock.Post(envelope);

            port = await completionSource.Task;

            if (port == null)
            {
                var error = "Pipeline port cannot be null";
                Log.Error("MockServerProcessor Error: {Error}", error);
                return new MockResponse { Status = StatusCodes.Status500InternalServerError, Body = error, Headers = new Dictionary<string, string>() };
            }

            return port.IsFaulted || port.SelectedResponse == null ? new MockResponse() : port.SelectedResponse;
        }

        /// <inheritdoc />
        public bool Stop()
        {
            try
            {
                if (this.startBlock != null)
                {
                    this.startBlock.Complete();
                    endBlock?.Completion.Wait();
                }

                this.cancellationTokenSource.Cancel();
                pipelineIsRunning = false;
            }
            catch (AggregateException e)
            {
                Log.Warning(e, "MockServiceProcessor unable to shutdown gracefully");
                return false;
            }
            Log.Information("MockserviceProcessor has shutdown successfully");
            return true;
        }

        void CancelPipeline()
        {
            //< Propagate the cancellation via the CancellationToken
            cancellationTokenSource.Cancel();
            //< Attempting to 'gracefully' shutdown the pipeline & complete existing requests
            Stop();
            //< Set the 'pipelineIsRunning' flag to false so we refuse new work
            pipelineIsRunning = false;
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls
        
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    this.Stop();
                }

                disposedValue = true;
            }
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
        #endregion
    }
}
