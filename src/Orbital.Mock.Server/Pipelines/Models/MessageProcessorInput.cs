using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.Pipelines.Models
{
    [ExcludeFromCodeCoverage]
    internal class MessageProcessorInput
    {
        /// <summary>
        /// The Request Context
        /// </summary>
        public HttpRequest ServerHttpRequest { get; }



        public MessageProcessorInput(HttpRequest serverHttpRequest)
        {
            this.ServerHttpRequest = serverHttpRequest;
        }
    }
}
