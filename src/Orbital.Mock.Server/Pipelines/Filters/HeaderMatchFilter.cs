using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class HeaderMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IHeaderMatchPort
    {
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var headers = port.Headers.AllKeys.ToDictionary(k => k, k => port.Headers[k]);
            var scenarios = port.Scenarios;

            port.HeaderMatchResults = scenarios.Where(
                s => s.RequestMatchRules.HeaderRules.All(hr => headers.ContainsKey(hr.Key) && headers[hr.Key].Equals(hr.Value))
            ).Select(scenario => scenario.Id).ToList();

            return port;
        }
    }
}
