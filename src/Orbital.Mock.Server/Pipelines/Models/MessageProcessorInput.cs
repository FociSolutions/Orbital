using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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
        public MessageProcessorInput(HttpRequest serverHttpRequest, List<Scenario> scenarios)
        {
            this.ServerHttpRequest = serverHttpRequest;
            this.Scenarios = scenarios;
            this.HeaderDictionary = serverHttpRequest.Headers.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
            //HeaderDictionary = serverHttpRequest.Headers.Where(kvp => kvp.Key != "Unknown").Concat(serverHttpRequest.Headers["Unknown"]).ToDictionary;
            var test = serverHttpRequest.Headers;
        }
    }
}
