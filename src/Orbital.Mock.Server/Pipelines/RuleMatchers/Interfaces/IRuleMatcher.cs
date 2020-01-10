using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces
{
    /// <summary>
    /// Interface contains method signature of matching method
    /// </summary>
    /// <typeparam name="T">Match rule type</typeparam>
    /// <typeparam name="R">Input for matching</typeparam>
    public interface IRuleMatcher<T,R> where T:IRule where R:IMatchPort
    {

        MatchResult Match(T rule, R input);
    }
}
