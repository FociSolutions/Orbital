using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces
{
    public interface IRuleMatcher<T,R> where T:IRule where R:IMatchPort
    {
        MatchResult Match(T rule, R input);
    }
}
