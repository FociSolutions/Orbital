using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    internal interface IHeaderMatchPort
    {
        IHeaderDictionary Headers { get; set; }

        List<string> HeaderMatchResults { get; set; }
    }
}
