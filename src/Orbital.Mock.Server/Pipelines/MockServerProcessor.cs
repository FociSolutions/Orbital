using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Envelopes;
using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Orbital.Mock.Server.Pipelines.Factories;
using Orbital.Mock.Server.Pipelines.Filters;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace Orbital.Mock.Server.Pipelines
{
    internal class MockServerProcessor : IPipeline<MessageProcessorInput, Task<MockResponse>>
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
            this.blockFactory = new SyncBlockFactory();
            this.headerMatchFilter = headerMatchFilter;
            this.responseSelectorFilter = responseSelectorFilter;
        }

        /// <inheritdoc />
        public void Start()
        {
            var linkOptions = new DataflowLinkOptions { PropagateCompletion = true };

            //Initialize blocks
            this.startBlock = this.blockFactory.CreateTransformBlock(this.pathValidationFilter.Process);

            var broadCastBlock = this.blockFactory.CreateBroadcastBlock(envelope => envelope);
            var endpointFilterBlock = this.blockFactory.CreateTransformBlock(this.endpointMatchFilter.Process);
            var headerFilterBlock = this.blockFactory.CreateTransformBlock(this.headerMatchFilter.Process);
            var bodyMatchFilterBlock = this.blockFactory.CreateTransformBlock(this.bodyMatchFilter.Process);
            var queryFilterBlock = this.blockFactory.CreateTransformBlock(this.queryMatchFilter.Process);
            var joinRequestPartsBlock = this.blockFactory.CreateJoinThreeBlock(new GroupingDataflowBlockOptions() { Greedy = false });
            var mergeBlock = this.blockFactory.CreateJoinTransformBlock((Tuple<ProcessMessagePort, ProcessMessagePort, ProcessMessagePort> Ports) => Ports.Item1);
            var responseSelectorBlock = this.blockFactory.CreateTransformBlock(this.responseSelectorFilter.Process);
            this.endBlock = this.blockFactory.CreateFinalBlock();


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
        public async Task<MockResponse> Push(MessageProcessorInput input)
        {
            if (input == null ||
                input.ServerHttpRequest == null ||
                input.ServerHttpRequest.Body == null ||
                input.HeaderDictionary == null ||
                input.QueryDictionary == null ||
                input.Scenarios == null)
            {
                return new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            }

            string Body = string.Empty;

            using (var reader = new StreamReader(input.ServerHttpRequest.Body))
            {
                Body = reader.ReadToEnd();
            }

            Enum.TryParse<HttpMethod>(input.ServerHttpRequest.Method, true, out HttpMethod verb);

            var port = new ProcessMessagePort()
            {
                Scenarios = input.Scenarios,
                Path = input.ServerHttpRequest.Path,
                Verb = verb,
                Query = input.QueryDictionary,
                Headers = input.HeaderDictionary,
                Body = Body
            };

            var completionSource = new TaskCompletionSource<ProcessMessagePort>();
            var envelope = new SyncEnvelope(completionSource, port);

            this.startBlock.Post(envelope);

            await completionSource.Task;
            port = await completionSource.Task;

            if (port == null)
            {
                var error = "Pipeline port cannot be null";
                return new MockResponse { Status = 400, Body = error, Headers = new Dictionary<string, string>() };
            }

            if (port.IsFaulted)
            {
                return new MockResponse();
            }

            return port.SelectedResponse;

        }

        /// <inheritdoc />
        public bool Stop()
        {
            try
            {
                if (this.startBlock != null)
                {
                    this.startBlock.Complete();
                    if (this.endBlock != null)
                    {
                        this.endBlock.Completion.Wait();
                    }
                }
            }
            catch (AggregateException)
            {
                return false;
            }
            return true;
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
