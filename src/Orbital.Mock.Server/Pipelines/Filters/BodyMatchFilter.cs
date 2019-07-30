using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class BodyMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IBodyMatchPort, IScenariosPort
    {
        public override T Process(T port)
        {
            if(!IsPortValid(port, out port))
            {
                return port;
            }

            var scenarios = port.Scenarios;
            var body = port.Body;
            var bodyMatch = scenarios.Where(
                scenario => scenario.RequestMatchRules.BodyRules.Equals(body)
                );
            port.BodyMatch = bodyMatch.Select(
                scenario => scenario.Id
                ).ToList();

            return port;
        }
    }
}
