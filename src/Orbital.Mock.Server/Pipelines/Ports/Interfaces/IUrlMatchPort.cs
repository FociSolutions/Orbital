using Orbital.Mock.Server.Models;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IUrlMatchPort : IMatchPort
    {
        ICollection<MatchResult> URLMatchResults { get; set; }
    }
}
