using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Commands;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Handlers
{
    [ExcludeFromCodeCoverage]

    /// <summary>
    /// Handler for executing the InvokeSynchronousPipelineCommand
    /// </summary>
    public class InvokeSynchronousPipelineHandler : IRequestHandler<InvokeSynchronousPipelineCommand, MockResponse>
    {
        /// <summary>
        /// Invokes the synchronous pipeline and returns the resulting HttpResponse
        /// </summary>
        /// <param name="command"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<MockResponse> Handle(InvokeSynchronousPipelineCommand command, CancellationToken cancellationToken)
        {
            var response = this.mockPipeline(command.Request).Result;
            return Task.FromResult(response);
        }

        private async Task<MockResponse> mockPipeline(HttpRequest context)
        {
            return new MockResponse
            {
                Body = "mocked pipeline response",
                Status = StatusCodes.Status200OK,
                Headers = new Dictionary<string, string>()
            };
        }
    }
}
