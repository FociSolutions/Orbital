using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    internal interface IHeaderMatchPort
    {
        NameValueCollection Headers { get; set; }

        List<string> HeaderMatchResults { get; set; }
    }
}
