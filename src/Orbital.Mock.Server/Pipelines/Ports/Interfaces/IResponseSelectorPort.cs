using Orbital.Mock.Definition.Response;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IResponseSelectorPort
    {
        MockResponse SelectedResponse { get; set; }
    }
}
