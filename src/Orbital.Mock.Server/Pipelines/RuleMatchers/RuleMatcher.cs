using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers
{
    /// <summary>
    /// Abstract class for matching 
    /// </summary>
    abstract public class RuleMatcher
    {
        /// <summary>
        /// Match method that returns a collection of MatchResult
        /// </summary>
        /// <param name="T">Match rule type</param>
        /// <param name="R">Input for matching</param>
        /// <returns></returns>
        public abstract IEnumerable<MatchResult> Match(IRule T, IMatchPort R);
    }
}
