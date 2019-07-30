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
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var scenarioIds = port.BodyMatch.Concat(port.HeaderMatchResults).Concat(port.QueryMatchResults).ToList();
            var scenarioScore = scenarioIds.GroupBy(id => id).ToDictionary(g => g.Key, g => g.Count());

            var max = scenarioScore.Values.Max();
            scenarioIds = scenarioIds.Where(s => scenarioScore[s] == max).ToList();

            Random random = new Random();
            port.SelectedResponse = port.Scenarios.First(s => s.Id == scenarioIds[random.Next(scenarioIds.Count)]).Response;
            return port;
        }
    }
}
