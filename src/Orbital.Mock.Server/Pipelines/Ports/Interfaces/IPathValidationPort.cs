using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IPathValidationPort
    {
        string Path { get; set; }
        HttpMethod Verb { get; set; }

    }
}
