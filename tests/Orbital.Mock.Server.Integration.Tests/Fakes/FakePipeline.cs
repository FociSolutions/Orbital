using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

using Orbital.Mock.Definition.Response;
using Orbital.Mock.Server.Pipelines.Models;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;

namespace Orbital.Mock.Server.Integration.Tests.Fakes
{
    internal class FakePipeline : IPipeline<MessageProcessorInput, Task<MockResponse>>
    {
        private bool pipelineIsRunning;

        public FakePipeline()
        {
            pipelineIsRunning = false;
        }

        public bool GetPipelineStatus()
        {
            return pipelineIsRunning;
        }

        public void Start()
        {
            pipelineIsRunning = true;
        }

        public bool Stop()
        {
            pipelineIsRunning = false;
            return true;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Task<MockResponse> Push(MessageProcessorInput input, CancellationToken token)
        {
            if (!pipelineIsRunning)
                return Task.FromResult(new MockResponse(503));

            return Task.FromResult(new MockResponse(200));
        }
    }
}
