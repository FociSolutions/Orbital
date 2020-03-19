using MediatR;
using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Pipelines.Commands;
using Orbital.Mock.Server.Pipelines.Ports;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Middleware
{
    ///<summary>
    ///ServerRequestMiddleware is the middleware used to route admin requests to the admin endpoints and all other requests
    ///to the pipelines.
    ///</summary>
    [ExcludeFromCodeCoverage]
    public class ServerRequestMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IMediator mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="next"></param>
        /// <param name="mediator"></param>
        public ServerRequestMiddleware(RequestDelegate next, IMediator mediator)
        {
            this.next = next;
            this.mediator = mediator;
        }

        /// <summary>
        /// The asyncronous method to be run when the middleware is executed. Determines whether to short-circuit or
        /// pass-through. If the path matches the regex then it passes through the middleware, otherwise short-circuits
        /// </summary>
        /// <param name="context">Http Context</param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            Regex rx = new Regex(@"^/api/v\d/OrbitalAdmin");

            if (rx.IsMatch(context.Request.Path))
            {
                await next.Invoke(context);
            }
            else
            {
                var command = new InvokeSynchronousPipelineCommand(context.Request, ref ProcessMessagePort.databaseLock);

                var response = await this.mediator.Send(command);
                context.Response.StatusCode = response.Status;
                foreach (KeyValuePair<string, string> header in response.Headers)
                {
                    context.Response.Headers.Add(header.Key, header.Value);
                }
                await context.Response.WriteAsync(response.Body);
            }
        }
    }
}
