using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IHeaderMatchPort
    {
        IDictionary<string, string> Headers { get; set; }
        ICollection<MatchResult> HeaderMatchResults { get; set; }
    }
}
