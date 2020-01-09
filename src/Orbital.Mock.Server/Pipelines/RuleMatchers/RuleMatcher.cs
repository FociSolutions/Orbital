using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Models.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Pipelines.RuleMatchers
{
    abstract public class RuleMatcher
    {
        public abstract IEnumerable<MatchResult> Match(IRule T, IMatchPort R);
    }
}
