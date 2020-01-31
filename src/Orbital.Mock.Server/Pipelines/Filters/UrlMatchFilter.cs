using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;
using System.Linq;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class UrlMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IURLMatchPort, IScenariosPort, IPathValidationPort
    {
        private IAssertFactory assertFactory;
        private IRuleMatcher ruleMatcher;

        public UrlMatchFilter(IAssertFactory assertFactory, IRuleMatcher ruleMatcher)
        {
            this.assertFactory = assertFactory;
            this.ruleMatcher = ruleMatcher;
        }

        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            foreach (var scenario in port.Scenarios)
            {
                foreach (var rule in scenario.RequestMatchRules.HeaderRules)
                {
                    var assertsList = assertFactory.CreateAssert(rule, port.Path);
                    if (!assertsList.Any())
                    {
                        port.HeaderMatchResults.Add(new MatchResult(MatchResultType.Ignore, scenario.Id));
                    }
                    else
                    {
                        port.HeaderMatchResults.Add(ruleMatcher.Match(assertsList.ToArray())
                                     ? new MatchResult(MatchResultType.Success, scenario.Id)
                                     : new MatchResult(MatchResultType.Fail, scenario.Id));
                    }

                }


            }

            return port;
        }
    }
}
   
