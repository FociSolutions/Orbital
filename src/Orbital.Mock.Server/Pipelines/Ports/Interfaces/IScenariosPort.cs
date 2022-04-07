using System.Collections.Generic;

using Orbital.Mock.Definition;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IScenariosPort
    {
        IEnumerable<Scenario> Scenarios { get; set; }
    }
}
