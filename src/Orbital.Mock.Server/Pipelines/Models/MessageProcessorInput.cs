using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System;
using System.Linq;

namespace Orbital.Mock.Server.Pipelines.Models
{
    [ExcludeFromCodeCoverage]
    internal class MessageProcessorInput
    {
        /// <summary>
        /// The Request Context
        /// </summary>
        public HttpRequest ServerHttpRequest { get; }
        public List<Scenario> Scenarios { get; }
        public Dictionary<string, string> HeaderDictionary { get; }
        public Dictionary<string, string> QueryDictionary { get; }

        public MessageProcessorInput(HttpRequest serverHttpRequest, List<Scenario> scenarios)
        {
            this.ServerHttpRequest = serverHttpRequest;
            this.Scenarios = scenarios;
            this.HeaderDictionary = serverHttpRequest == null ? new Dictionary<string, string>() : serverHttpRequest.Headers.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
            this.QueryDictionary = serverHttpRequest == null ? new Dictionary<string, string>() : serverHttpRequest.Query.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
        }
    }
}
