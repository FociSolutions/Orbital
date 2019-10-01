using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class HeaderMatchFilter<T> : FaultableBaseFilter<T>
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
            if (!IsPipelineValid(ref port, GetType())) return port;

            foreach (var scenario in port.Scenarios)
            {
                port.HeaderMatchResults.Add(Matcher.MatchByKeyValuePair(
                    scenario.RequestMatchRules.HeaderRules,
                    port.Headers,
                    scenario.Id));
            }

            return port;
        }
    }
}
