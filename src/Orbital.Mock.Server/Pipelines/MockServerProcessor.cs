using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Envelopes;
using Orbital.Mock.Server.Pipelines.Factories;
using Orbital.Mock.Server.Pipelines.Filters;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Pipelines.Envelopes.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Orbital.Mock.Server.Models;
using System.IO;

namespace Orbital.Mock.Server.Pipelines
{
    internal class MockServerProcessor : IPipeline<MessageProcessorInput, Task<MockResponse>>
    {
        private readonly SyncBlockFactory blockFactory;

        private readonly PathValidationFilter<ProcessMessagePort> pathValidationFilter;
<<<<<<< HEAD
        private readonly QueryMatchFilter<ProcessMessagePort> queryMatchFilter;
        private readonly EndpointMatchFilter<ProcessMessagePort> endpointMatchFilter;
=======
        private readonly BodyMatchFilter<ProcessMessagePort> bodyMatchFilter;

>>>>>>> server-project-setup
        private TransformBlock<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>> startBlock;
        private ActionBlock<IEnvelope<ProcessMessagePort>> endBlock;


        public MockServerProcessor()
<<<<<<< HEAD
            : this(new PathValidationFilter<ProcessMessagePort>(), new QueryMatchFilter<ProcessMessagePort>(), new EndpointMatchFilter<ProcessMessagePort>())
        {
        }

        public MockServerProcessor(PathValidationFilter<ProcessMessagePort> pathValidationFilter, QueryMatchFilter<ProcessMessagePort> queryMatchFilter, EndpointMatchFilter<ProcessMessagePort> endpointMatchFilter)
        {
            this.pathValidationFilter = pathValidationFilter;
            this.queryMatchFilter = queryMatchFilter;
            this.endpointMatchFilter = endpointMatchFilter;
=======
            : this(new PathValidationFilter<ProcessMessagePort>(), new BodyMatchFilter<ProcessMessagePort>())
        {
        }


        public MockServerProcessor(PathValidationFilter<ProcessMessagePort> pathValidationFilter, BodyMatchFilter<ProcessMessagePort> bodyMatchFilter)
        {
            this.pathValidationFilter = pathValidationFilter;
            this.bodyMatchFilter = bodyMatchFilter;
>>>>>>> server-project-setup
            this.blockFactory = new SyncBlockFactory();
        }

        /// <inheritdoc />
        public void Start()
        {
            var linkOptions = new DataflowLinkOptions { PropagateCompletion = true };

            //Initialize blocks
            this.startBlock = this.blockFactory.CreateTransformBlock(this.pathValidationFilter.Process);
            var broadCastBlock = this.blockFactory.CreateBroadcastBlock(envelope => envelope);
<<<<<<< HEAD
            var queryFilterBlock = this.blockFactory.CreateTransformBlock(this.queryMatchFilter.Process);
            var endpointFilterBlock = this.blockFactory.CreateTransformBlock(this.endpointMatchFilter.Process);
            this.endBlock = this.blockFactory.CreateFinalBlock();

            //Broadcast incoming request to all getter blocks
            this.startBlock.LinkTo(endpointFilterBlock, linkOptions);
            //Will need to add a join block when all three filters are added
            endpointFilterBlock.LinkTo(broadCastBlock, linkOptions);
            broadCastBlock.LinkTo(queryFilterBlock, linkOptions);
            queryFilterBlock.LinkTo(this.endBlock, linkOptions);
=======
            var bodyMatchFilterBlock = this.blockFactory.CreateTransformBlock(this.bodyMatchFilter.Process);
            this.endBlock = this.blockFactory.CreateFinalBlock();

            //Broadcast incoming request to all getter blocks
            this.startBlock.LinkTo(broadCastBlock, linkOptions);

            broadCastBlock.LinkTo(bodyMatchFilterBlock, linkOptions);
            bodyMatchFilterBlock.LinkTo(this.endBlock, linkOptions);
>>>>>>> server-project-setup
        }

        /// <inheritdoc />
        public async Task<MockResponse> Push(MessageProcessorInput input)
        {
            if (input == null ||
                input.ServerHttpRequest == null ||
                input.ServerHttpRequest.Body == null ||
                input.ServerHttpRequest.Headers == null)
            {
                return new MockResponse { Status = 400, Body = "Something went wrong", Headers = new Dictionary<string, string>() };
            }

<<<<<<< HEAD
            var port = new ProcessMessagePort
=======
            string Body = string.Empty;

            using (var reader = new StreamReader(input.ServerHttpRequest.Body))
            {
                Body = reader.ReadToEnd();
            }

            var port = new ProcessMessagePort(input.Scenarios)
>>>>>>> server-project-setup
            {
                Scenarios = input.Scenarios,
                Path = input.ServerHttpRequest.Path,
                Verb = input.ServerHttpRequest.Method,
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
                return new MockResponse { Status = 400, Body = CreateFaultPayload(error), Headers = new Dictionary<string, string>() };
            }

            if (port.IsFaulted)
            {
                var error = "Matching response not found";
                return new MockResponse { Status = 404, Body = CreateFaultPayload(error), Headers = new Dictionary<string, string>() };
            }

            return new MockResponse { Status = 200, Body = "Scenario Found", Headers = new Dictionary<string, string>() }; ;
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

        //create payload containing OrbitalArgumentException
        private string CreateFaultPayload(string error)
        {
            return error;
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
