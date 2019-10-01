using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Envelopes;
using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Orbital.Mock.Server.Pipelines.Factories;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using Microsoft.AspNetCore.Http;

namespace Orbital.Mock.Server.Pipelines
{
    public class MockServerProcessor : IPipeline<MessageProcessorInput, Task<MockResponse>>
    {
        private readonly SyncBlockFactory blockFactory;

        private readonly PathValidationFilter<ProcessMessagePort> pathValidationFilter;
        private readonly HeaderMatchFilter<ProcessMessagePort> headerMatchFilter;
        private readonly ResponseSelectorFilter<ProcessMessagePort> responseSelectorFilter;
        private readonly QueryMatchFilter<ProcessMessagePort> queryMatchFilter;
        private readonly EndpointMatchFilter<ProcessMessagePort> endpointMatchFilter;
        private readonly BodyMatchFilter<ProcessMessagePort> bodyMatchFilter;
        private TransformBlock<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>> startBlock;
        private ActionBlock<IEnvelope<ProcessMessagePort>> endBlock;
        public bool PipelineIsRunning { get; private set;  }

        public MockServerProcessor()
            : this(new PathValidationFilter<ProcessMessagePort>(),
                  new QueryMatchFilter<ProcessMessagePort>(),
                  new EndpointMatchFilter<ProcessMessagePort>(),
                  new BodyMatchFilter<ProcessMessagePort>(),
                  new HeaderMatchFilter<ProcessMessagePort>(),
                  new ResponseSelectorFilter<ProcessMessagePort>())
        {
        }

        public MockServerProcessor(
            PathValidationFilter<ProcessMessagePort> pathValidationFilter,
            QueryMatchFilter<ProcessMessagePort> queryMatchFilter,
            EndpointMatchFilter<ProcessMessagePort> endpointMatchFilter,
            BodyMatchFilter<ProcessMessagePort> bodyMatchFilter,
            HeaderMatchFilter<ProcessMessagePort> headerMatchFilter,
            ResponseSelectorFilter<ProcessMessagePort> responseSelectorFilter

        )
        {
            this.pathValidationFilter = pathValidationFilter;
            this.queryMatchFilter = queryMatchFilter;
            this.endpointMatchFilter = endpointMatchFilter;
            this.bodyMatchFilter = bodyMatchFilter;
            this.blockFactory = new SyncBlockFactory(this.cancellationTokenSource);
            this.headerMatchFilter = headerMatchFilter;
            this.responseSelectorFilter = responseSelectorFilter;
        }

        /// <inheritdoc />
        public void Start()
        {
            var linkOptions = new DataflowLinkOptions { PropagateCompletion = true };

            //Initialize blocks
            this.startBlock = this.blockFactory.CreateTransformBlock(this.pathValidationFilter.Process, cancellationTokenSource);

            var broadCastBlock = this.blockFactory.CreateBroadcastBlock(envelope => envelope, cancellationTokenSource);
            var endpointFilterBlock = this.blockFactory.CreateTransformBlock(this.endpointMatchFilter.Process, cancellationTokenSource);
            var headerFilterBlock = this.blockFactory.CreateTransformBlock(this.headerMatchFilter.Process, cancellationTokenSource);
            var bodyMatchFilterBlock = this.blockFactory.CreateTransformBlock(this.bodyMatchFilter.Process, cancellationTokenSource);
            var queryFilterBlock = this.blockFactory.CreateTransformBlock(this.queryMatchFilter.Process, cancellationTokenSource);
            var joinRequestPartsBlock = this.blockFactory.CreateJoinThreeBlock(new GroupingDataflowBlockOptions() { Greedy = false }, cancellationTokenSource);
            var mergeBlock = this.blockFactory.CreateJoinTransformBlock((Tuple<ProcessMessagePort, ProcessMessagePort, ProcessMessagePort> Ports) => Ports.Item1, cancellationTokenSource);
            var responseSelectorBlock = this.blockFactory.CreateTransformBlock(this.responseSelectorFilter.Process, cancellationTokenSource);
            this.endBlock = this.blockFactory.CreateFinalBlock(cancellationTokenSource);


            //Broadcast incoming request to all getter blocks
            this.startBlock.LinkTo(endpointFilterBlock, linkOptions);
            //Will need to add a join block when all three filters are added
            endpointFilterBlock.LinkTo(broadCastBlock, linkOptions);

            broadCastBlock.LinkTo(queryFilterBlock, linkOptions);
            broadCastBlock.LinkTo(bodyMatchFilterBlock, linkOptions);
            broadCastBlock.LinkTo(headerFilterBlock, linkOptions);


            bodyMatchFilterBlock.LinkTo(joinRequestPartsBlock.Target1, linkOptions);
            queryFilterBlock.LinkTo(joinRequestPartsBlock.Target2, linkOptions);
            headerFilterBlock.LinkTo(joinRequestPartsBlock.Target3, linkOptions);

            joinRequestPartsBlock.LinkTo(mergeBlock, linkOptions);
            mergeBlock.LinkTo(responseSelectorBlock, linkOptions);

            responseSelectorBlock.LinkTo(this.endBlock, linkOptions);

        }

        /// <inheritdoc />
        public async Task<MockResponse> Push(MessageProcessorInput input, CancellationToken token)
        {
            var completionSource = new TaskCompletionSource<ProcessMessagePort>();

            token.Register(() => cancellationTokenSource.Cancel());

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
                PipelineIsRunning = false;
            }
            catch (AggregateException e)
            {
                Log.Warning(e, "MockServiceProcessor unable to shutdown gracefully");
                return false;
            }
            Log.Information("MockserviceProcessor has shutdown successfully");
            return true;
        }
        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls
        private CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

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
