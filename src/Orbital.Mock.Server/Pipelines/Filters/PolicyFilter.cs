using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Policies;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class PolicyFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IPolicyPort
    {
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            foreach (var policy in port.Policies)
            {
                PolicyExecuter.ExecutePolicy(policy);
            }
            
            return port;
        }
    }
}
