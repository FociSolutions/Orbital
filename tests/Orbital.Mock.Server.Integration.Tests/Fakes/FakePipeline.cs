using System;
using System.Net;
using Orbital.Mock.Server.Pipelines.Models.Interfaces;

namespace Orbital.Mock.Server.Integration.Tests.Fakes
{
    internal class FakePipeline : IPipeline
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

        public HttpStatusCode Push()
        {
            if (!pipelineIsRunning)
                return HttpStatusCode.ServiceUnavailable;

            return HttpStatusCode.OK;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}