using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;

using Orbital.Mock.Definition.Match;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface ITokenValidationPort : ITokenParsePort
    {
        public bool CheckAuthentication { get; }

        public ICollection<MatchResult> TokenValidationResults { get; set; }

        public JwtSecurityToken Token { get; set; }

        public void InvalidateToken();
    }
}
