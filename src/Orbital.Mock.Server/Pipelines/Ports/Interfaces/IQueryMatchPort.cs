using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IQueryMatchPort
    {
        ICollection<MatchResult> QueryMatchResults { get; set; }
        IDictionary<string, string> Query { get; set; }

    }
}
