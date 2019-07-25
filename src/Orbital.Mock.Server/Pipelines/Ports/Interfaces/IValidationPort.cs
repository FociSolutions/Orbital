using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    internal interface IValidationPort
    {
        string Path { get; set; }

        string Verb { get; set; }
    }
}
