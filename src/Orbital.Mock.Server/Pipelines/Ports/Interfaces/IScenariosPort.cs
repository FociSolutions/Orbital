using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IScenariosPort
    {
        IEnumerable<Scenario> Scenarios { get; set; }
    }
}
