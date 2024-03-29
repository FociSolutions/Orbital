﻿using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Diagnostics.CodeAnalysis;

using Microsoft.AspNetCore.Http;

using Orbital.Mock.Server.Pipelines.Ports;
using Orbital.Mock.Server.Pipelines.Commands;

using MediatR;

namespace Orbital.Mock.Server.Middleware
{
    ///<summary>
    ///ServerRequestMiddleware is the middleware used to route admin requests to the admin endpoints and all other requests
    ///to the pipelines.
    ///</summary>
    [ExcludeFromCodeCoverage]
    public class ServerRequestMiddleware
    {
        private const string AdminRegexString = @"^/api/v\d/OrbitalAdmin";
        private static readonly Regex AdminRegex = new Regex(AdminRegexString);

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
            if (AdminRegex.IsMatch(context.Request.Path))
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
