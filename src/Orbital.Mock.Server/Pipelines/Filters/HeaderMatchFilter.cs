using System.Linq;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Match;
using Orbital.Mock.Definition.Rules.Assertion;

using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class HeaderMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IScenariosPort, IHeaderMatchPort
    {
        private IRuleMatcher ruleMatcher;

        public HeaderMatchFilter(IRuleMatcher ruleMatcher)
        {
            this.ruleMatcher = ruleMatcher;
        }
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
                foreach(var rule in scenario.RequestMatchRules.HeaderRules)
                {
                    var assertsList = AssertFactory.CreateAssert(rule, port.Headers);
                    if (!assertsList.Any())
                    {
                        port.HeaderMatchResults.Add(new MatchResult(MatchResultType.Ignore, scenario.Id, scenario.DefaultScenario));
                    }
                    else
                    {
                        port.HeaderMatchResults.Add(ruleMatcher.Match(assertsList.ToArray())
                                     ? new MatchResult(MatchResultType.Success, scenario.Id, scenario.DefaultScenario)
                                     : new MatchResult(MatchResultType.Fail, scenario.Id, scenario.DefaultScenario));
                    }
                    
                }
            }

            return port;
        }
    }
}
