using MediatR;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Commands
{
    /// <summary>
    /// The command used to invoke the pipeline
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class InvokeSynchronousPipelineCommand : IRequest<MockResponse>
    {
        /// <summary>
        /// Constructor
        /// </summary>

        /// <param name="request">The incomming http request to pass to the handler</param>
        public InvokeSynchronousPipelineCommand(HttpRequest request)
        {
            Request = request;
        }

        /// <summary>
        /// HttpRequest to pass into the pipeline
        /// </summary>
        public HttpRequest Request { get; }
    }
}
