using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Factories.Interfaces
{
    public interface IAssertFactory
    {
        IEnumerable<Assert> CreateAssert<T, R>(T port, R request) where T : IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort where R : JToken, IEnumerable<KeyValuePair<string, string>>
    }
}
