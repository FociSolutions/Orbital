using System.Collections.Generic;

using Orbital.Mock.Definition.Match;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IUrlMatchPort : IMatchPort
    {
        ICollection<MatchResult> URLMatchResults { get; set; }
    }
}
