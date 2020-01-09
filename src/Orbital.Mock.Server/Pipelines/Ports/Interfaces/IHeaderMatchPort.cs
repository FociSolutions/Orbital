using System.Collections.Generic;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IHeaderMatchPort : IMatchPort 
    { 
        IEnumerable<KeyValuePair<string, string>> Headers { get; set; }
        ICollection<MatchResult> HeaderMatchResults { get; set; }
    }
}
