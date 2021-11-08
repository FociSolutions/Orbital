using System.Collections.Generic;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    public interface ITokenParsePort
    {
        string TokenScheme { get; set; }
        string TokenParameter { get; set; }

        IEnumerable<KeyValuePair<string, string>> Headers { get; set; }
    }
}
