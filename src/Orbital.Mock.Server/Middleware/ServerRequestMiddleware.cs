using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Middleware
{
    [ExcludeFromCodeCoverage]

    ///<summary>
    ///ServerRequestMiddleware is the middleware used to route admin requests to the admin endpoints and all other requests
    ///to the pipelines.
    ///</summary>
    public class ServerRequestMiddleware
    {
        private readonly RequestDelegate next;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="next"></param>
        public ServerRequestMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        /// <summary>
        /// The asyncronous method to be run when the middleware is executed. Determines whether to short-circuit or
        /// pass-through. If the path matches the regex then it passes through the middleware, otherwise short-circuits
        /// </summary>
        /// <param name="context">Http Context</param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            Regex rx = new Regex(@"/api/v\d/OrbitalAdmin");
            if (rx.IsMatch(context.Request.Path))
            {
                await next.Invoke(context);
            }
            else
            {
                var result = mockPipeline(context);
            }
        }

        private HttpContext mockPipeline(HttpContext context)
        {
            context.Response.WriteAsync("Mocked Pipeline Result");
            return context;
        }
    }
}
