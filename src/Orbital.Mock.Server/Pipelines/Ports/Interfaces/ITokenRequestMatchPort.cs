using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface ITokenRequestMatchPort : ITokenValidationPort
    {
        public ICollection<MatchResult> TokenMatchResults { get; set; }
    }
}
