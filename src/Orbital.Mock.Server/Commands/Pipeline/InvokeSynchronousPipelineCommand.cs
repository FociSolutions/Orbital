using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Http;

using Orbital.Mock.Definition.Response;

using MediatR;

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
        /// <param name="databaseLock"></param>
        public InvokeSynchronousPipelineCommand(HttpRequest request, ref object databaseLock)
        {
            Request = request;
            this.databaseLock = databaseLock;
        }

        /// <summary>
        /// HttpRequest to pass into the pipeline
        /// </summary>
        public HttpRequest Request { get; }

        /// <summary>
        /// The database lock
        /// </summary>
        public object databaseLock;
    }
}
