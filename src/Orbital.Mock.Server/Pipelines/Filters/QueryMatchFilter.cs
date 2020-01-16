using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class QueryMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IQueryMatchPort, IScenariosPort
    {
        private IAssertFactory assertFactory;
        private IRuleMatcher ruleMatcher;

        public QueryMatchFilter(IAssertFactory assertFactory, IRuleMatcher ruleMatcher)
        {
            this.assertFactory = assertFactory;
            this.ruleMatcher = ruleMatcher;
        }
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
                foreach (var rule in scenario.RequestMatchRules.QueryRules)
                {
                    var assertsList = assertFactory.CreateAssert(rule, port.Query);
                    if (!assertsList.Any())
                    {
                        port.QueryMatchResults.Add(new MatchResult(MatchResultType.Ignore, scenario.Id));
                    }
                    else
                    {
                        port.QueryMatchResults.Add(ruleMatcher.Match(assertsList.ToArray())
                                    ? new MatchResult(MatchResultType.Success, scenario.Id)
                                    : new MatchResult(MatchResultType.Fail, scenario.Id));
                    }
                    
                }

            }

            return port;
        }

    }
}
