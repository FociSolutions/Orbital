using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    interface IQueryMatchPort
    {
        IEnumerable<string> QueryMatchResults { get; set; }

        IDictionary<string, string> Query { get; set; }
    }
}
