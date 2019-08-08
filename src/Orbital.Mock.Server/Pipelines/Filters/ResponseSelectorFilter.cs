using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class ResponseSelectorFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort, IResponseSelectorPort
    {
        /// <summary>
        /// Selects the response to use based on the match results from the previous filters. Ties are broken randomly.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var scenarioIds = port.BodyMatch.Concat(port.HeaderMatchResults).Concat(port.QueryMatchResults).ToList();
            if (scenarioIds.Count == 0)
            {
                port.SelectedResponse = new MockResponse();
                return port;
            }

            var scenarioScores = scenarioIds.GroupBy(id => id).ToDictionary(g => g.Key, g => g.Count());
            var max = scenarioScores.Values.Max();
            var selectedScenarios = scenarioScores.Keys.Where(key => scenarioScores[key] == max)
                .Select(id => port.Scenarios.First(scenario => scenario.Id == id))
                .ToList();

            Random random = new Random();
            port.SelectedResponse = selectedScenarios[random.Next(selectedScenarios.Count)].Response;
            return port;
        }
    }
}
