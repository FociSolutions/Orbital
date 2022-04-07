using System.Collections.Generic;

using Orbital.Mock.Definition.Match;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface ITokenRequestMatchPort : ITokenValidationPort
    {
        public ICollection<MatchResult> TokenMatchResults { get; set; }
    }
}
