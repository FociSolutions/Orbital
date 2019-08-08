using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    internal interface IHeaderMatchPort
    {
        IDictionary<string, string> Headers { get; set; }

        IEnumerable<string> HeaderMatchResults { get; set; }
    }
}
