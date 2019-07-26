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

namespace Orbital.Mock.Server.Pipelines
{
    internal class MockServerProcessor : IPipeline<MessageProcessorInput, Task<string>>
    {
        private readonly SyncBlockFactory blockFactory;

        private readonly TODOFilter<ProcessMessagePort> todoFilter;
        private readonly PathValidationFilter<ProcessMessagePort> pathValidationFilter;

        private TransformBlock<IEnvelope<ProcessMessagePort>, IEnvelope<ProcessMessagePort>> startBlock;
        private ActionBlock<IEnvelope<ProcessMessagePort>> endBlock;


        public MockServerProcessor()
            : this(new TODOFilter<ProcessMessagePort>(), new PathValidationFilter<ProcessMessagePort>())
        {
        }


        public MockServerProcessor(TODOFilter<ProcessMessagePort> todoFilter, PathValidationFilter<ProcessMessagePort> pathValidationFilter)
        {
            this.todoFilter = todoFilter;
            this.pathValidationFilter = pathValidationFilter;
            this.blockFactory = new SyncBlockFactory();
        }

        /// <inheritdoc />
        public void Start()
        {
            var linkOptions = new DataflowLinkOptions { PropagateCompletion = true };

            //Initialize blocks
            this.startBlock = this.blockFactory.CreateTransformBlock(this.pathValidationFilter.Process);
            this.endBlock = this.blockFactory.CreateFinalBlock();

            //Broadcast incoming request to all getter blocks
            this.startBlock.LinkTo(endBlock, linkOptions);
        }

        /// <inheritdoc />
        public async Task<string> Push(MessageProcessorInput input)
        {
            if (input == null ||
                input.ServerHttpRequest == null ||
                input.ServerHttpRequest.Body == null ||
                input.ServerHttpRequest.Headers == null)
            {
                return "Something went worng";
            }

            var port = new ProcessMessagePort(input.Scenarios)
            {
                Path = input.ServerHttpRequest.Path,
                Verb = input.ServerHttpRequest.Method
            };

            var completionSource = new TaskCompletionSource<ProcessMessagePort>();
            var envelope = new SyncEnvelope(completionSource, port);

            this.startBlock.Post(envelope);

            await completionSource.Task;
            port = await completionSource.Task;

            if (port == null)
            {
                var error = "Pipeline port cannot be null";
                return CreateFaultPayload(error);
            }

            return port.TODO;
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
