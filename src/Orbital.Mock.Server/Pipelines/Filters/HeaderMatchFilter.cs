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
        /// <summary>
        /// Process that returns the port after adding a list of scenario Id's
        /// that have a header rule that matches the header of the request.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var headers = port.Headers.ToDictionary(x => x.Key, x => x.Value);
            var scenarios = port.Scenarios;

            port.HeaderMatchResults = scenarios.Where(
                s => s.RequestMatchRules.HeaderRules.All(hr => headers.ContainsKey(hr.Key) && headers[hr.Key].Equals(hr.Value))
            ).Select(scenario => scenario.Id).ToList();

            return port;
        }
    }
}
