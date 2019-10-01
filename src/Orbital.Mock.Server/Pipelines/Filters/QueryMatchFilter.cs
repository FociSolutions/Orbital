using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Linq;
using System.Text.RegularExpressions;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class QueryMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IQueryMatchPort, IScenariosPort
    {
        /// <summary>
        /// Process that returns the port after adding a list of scenario Id's
        /// that have a query rule that matches the query of the request.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>

        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            foreach (var scenario in port.Scenarios)
            {
                port.QueryMatchResults.Add(Matcher.MatchByKeyValuePair(
                    scenario.RequestMatchRules.QueryRules,
                    port.Query,
                    scenario.Id));
            }

            return port;
        }

    }
}
