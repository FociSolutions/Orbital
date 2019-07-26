using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    interface IQueryMatchPort
    {
        List<string> QueryMatchResults { get; set; }

        IQueryCollection Query { get; set; }
    }
}
