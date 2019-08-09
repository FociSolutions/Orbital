using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Text;
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
            var request = await FormatRequest(context.Request);

            var originalBodyStream = context.Response.Body;

            using (var responseBody = new MemoryStream())
            {
                context.Response.Body = responseBody;
                await next.Invoke(context);
                var response = await FormatResponse(context.Response);
                await responseBody.CopyToAsync(originalBodyStream);
            }

            //Logic for request is coming in
            //   Log.Information("Outgoing Raw Request: {Request}", context.Request.Body);
            // Call the next delegate/middleware in the pipeline
            //await next.Invoke(context);
            //Logic for the response going back
            // Log.Information("Incoming Raw Response: {Response}", context.Response);
        }

        private async Task<string> FormatRequest(HttpRequest request)
        {
            var body = request.Body;
            request.EnableRewind();
            var buffer = new byte[Convert.ToInt32(request.ContentLength)];
            await request.Body.ReadAsync(buffer, 0, buffer.Length);
            var bodyAsText = Encoding.UTF8.GetString(buffer);
            request.Body = body;
            request
        }

        private async Task<string> FormatResponse(HttpResponse response)
        {
            throw new NotImplementedException();
        }


    }


}
