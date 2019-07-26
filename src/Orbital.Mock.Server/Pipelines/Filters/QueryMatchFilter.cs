using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class QueryMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IQueryMatchPort, IScenariosPort
    {
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var scenarios = port.Scenarios;
            var query = port.Query;

            var filteredScenarios = scenarios.Where(
                scenario => query.Count == scenario.RequestMatchRules.QueryRules.Count &&
                            !scenario.RequestMatchRules.QueryRules.Except(query.Select(pair => new KeyValuePair<string, string>(pair.Key, pair.Value))).Any()
                );

            port.QueryMatchResults = filteredScenarios.Select(scenario => scenario.Id).ToList<string>();
            return port;
        }
    }
}
