using Orbital.Mock.Definition.Rules;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IMatchPort
    {
        ComparerType Type { get; set; }
    }
}
