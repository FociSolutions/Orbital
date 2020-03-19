using Orbital.Mock.Server.Models;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface IResponseSelectorPort
    {
        MockResponse SelectedResponse { get; set; }
    }
}
