using System.Linq;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

using Microsoft.AspNetCore.Http;

using Orbital.Mock.Definition;

namespace Orbital.Mock.Server.Pipelines.Models
{
    [ExcludeFromCodeCoverage]
    public class MessageProcessorInput
    {
        /// <summary>
        /// The Request Context
        /// </summary>
        public HttpRequest ServerHttpRequest { get; }
        public IEnumerable<Scenario> Scenarios { get; }
        public IDictionary<string, string> HeaderDictionary { get; }
        public IDictionary<string, string> QueryDictionary { get; }

        public MessageProcessorInput(HttpRequest serverHttpRequest, IEnumerable<Scenario> scenarios)
        {
            ServerHttpRequest = serverHttpRequest;
            Scenarios = scenarios;

            HeaderDictionary = serverHttpRequest == null
                ? new Dictionary<string, string>()
                : serverHttpRequest.Headers.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
            QueryDictionary = serverHttpRequest == null
                ? new Dictionary<string, string>()
                : serverHttpRequest.Query.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
        }
    }
}