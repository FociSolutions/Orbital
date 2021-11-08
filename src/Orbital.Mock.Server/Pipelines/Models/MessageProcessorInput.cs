using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

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
        public IEnumerable<string> SigningKeys { get; }
        public IDictionary<string, string> HeaderDictionary { get; }
        public IDictionary<string, string> QueryDictionary { get; }

        public MessageProcessorInput(HttpRequest serverHttpRequest, IEnumerable<Scenario> scenarios, IEnumerable<string> signingKeys = null)
        {
            this.ServerHttpRequest = serverHttpRequest;
            this.Scenarios = scenarios;
            this.SigningKeys = signingKeys ?? new List<string>();
            this.HeaderDictionary = serverHttpRequest == null
                ? new Dictionary<string, string>()
                : serverHttpRequest.Headers.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
            this.QueryDictionary = serverHttpRequest == null
                ? new Dictionary<string, string>()
                : serverHttpRequest.Query.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
        }
    }
}