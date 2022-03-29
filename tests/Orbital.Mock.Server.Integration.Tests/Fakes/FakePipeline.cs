using System;

using Orbital.Mock.Server.Pipelines.Models.Interfaces;

namespace Orbital.Mock.Server.Integration.Tests.Fakes
{
    internal class FakePipeline : IPipeline
    {
        public FakePipeline()
        {
        }

        public bool GetPipelineStatus()
        {
            throw new NotImplementedException();
        }

        public void Start()
        {
            throw new NotImplementedException();
        }

        public bool Stop()
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
