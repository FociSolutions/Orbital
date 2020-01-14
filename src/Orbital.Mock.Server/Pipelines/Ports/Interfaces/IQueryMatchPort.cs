using System.Collections.Generic;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IQueryMatchPort : IMatchPort
    {
        ICollection<MatchResult> QueryMatchResults { get; set; }
        IEnumerable<KeyValuePair<string, string>> Query { get; set; }

    }
}
