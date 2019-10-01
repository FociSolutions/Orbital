using System.Collections.Generic;
using System.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class ResponseSelectorFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort, IResponseSelectorPort
    {
        /// <summary>
        /// Selects the response to use based on the match results from the previous filters. Ties are broken randomly.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            var bestScenario = port.HeaderMatchResults
                .Concat(port.BodyMatchResults)
                .Concat(port.QueryMatchResults)
                .GroupBy(scenario => scenario.ScenarioId)
                .Where(scenarioGrouping =>
                    !scenarioGrouping.Select(scenarioGroup => scenarioGroup.Match)
                        .Contains(MatchResultType.Fail))
                .Select(match => new
            {
                ScenarioId = match.Key,
                Score = match.Where(x => x.Match.Equals(MatchResultType.Success)).Sum(x => (int)x.Match)
            })
                .OrderByDescending(match => match.Score).FirstOrDefault();

            port.SelectedResponse = bestScenario != null ? port.Scenarios.First(scenario => scenario.Id.Equals(bestScenario.ScenarioId)).Response
                : new MockResponse();

            return port;
        }
    }
}
