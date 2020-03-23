using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using System.Linq;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class UrlMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IUrlMatchPort, IScenariosPort, IPathValidationPort
    {
        private IAssertFactory assertFactory;
        private IRuleMatcher ruleMatcher;

        public UrlMatchFilter(IAssertFactory assertFactory, IRuleMatcher ruleMatcher)
        {
            this.assertFactory = assertFactory;
            this.ruleMatcher = ruleMatcher;
        }
        /// <summary>
        /// Process that returns the port after adding a list of scenario Id's
        /// that have a url rule that matches the request path.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            foreach (var scenario in port.Scenarios)
            {
                foreach (var rule in scenario.RequestMatchRules.UrlRules)
                {
                    var assertsList = assertFactory.CreateAssert(rule, port.Path);
                    if (!assertsList.Any())
                    {
                        port.URLMatchResults.Add(new MatchResult(MatchResultType.Ignore, scenario.Id, scenario.defaultScenario));
                    }
                    else
                    {
                        port.URLMatchResults.Add(ruleMatcher.Match(assertsList.ToArray())
                                     ? new MatchResult(MatchResultType.Success, scenario.Id, scenario.defaultScenario)
                                     : new MatchResult(MatchResultType.Fail, scenario.Id, scenario.defaultScenario));
                    }

                }


            }

            return port;
        }
    }
}
   
