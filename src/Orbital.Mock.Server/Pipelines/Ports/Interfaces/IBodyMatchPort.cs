using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    interface IBodyMatchPort
    {
        string Body { get; set; }
        IEnumerable<string> BodyMatch { get; set; }
    }
}
