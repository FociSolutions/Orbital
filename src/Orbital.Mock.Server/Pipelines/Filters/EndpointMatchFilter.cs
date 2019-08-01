using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class EndpointMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort, IScenariosPort
    {
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var path = port.Path;
            var verb = port.Verb.ToUpper();

            var rx = new Regex($"{path}$");

            var scenarioList = port.Scenarios.Where(s => s.Verb.ToUpper().Equals(port.Verb) && rx.IsMatch(s.Path));

            port.Scenarios = scenarioList.ToList();
            return port;
        }
    }
}
