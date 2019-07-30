using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class ResponseSelectorFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IQueryMatchPort, IBodyMatchPort
    {
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }


            return port;
        }
    }
}
