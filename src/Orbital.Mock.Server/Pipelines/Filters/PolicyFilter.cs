using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class PolicyFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPolicyPort
    {
        public override T Process(T port)
        {
            throw new NotImplementedException();
        }
    }
}
