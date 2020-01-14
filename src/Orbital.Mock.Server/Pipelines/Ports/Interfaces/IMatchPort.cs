using Orbital.Mock.Server.Models.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IMatchPort
    {
        ComparerType Type { get; set; }
    }
}
