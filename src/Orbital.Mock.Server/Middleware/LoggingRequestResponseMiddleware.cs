using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Middleware
{
    ///<summary>
    ///ServerRequestMiddleware is the middleware used to log the raw the raw requests and responses
    ///</summary>
    ///
    [ExcludeFromCodeCoverage]
    public class LoggingRequestResponseMiddleware
    {
        private readonly RequestDelegate next;

        /// <summary>
        /// Constructor
        /// </summary>
        public LoggingRequestResponseMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            //Logic for request is coming in
            Log.Information("Outgoing Raw Request: {Request}", context.Request);
            // Call the next delegate/middleware in the pipeline
            await next.Invoke(context);
            //Logic for the response going back
            Log.Information("Incoming Raw Response: {Response}", context.Response);
        }

    }
}
