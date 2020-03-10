using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Serilog;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class PathValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort, IScenariosPort
    {
        /// <summary>
        /// Checks if a valid path is provided. Throws a fault otherwise
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            var path = port.Path;
            var verb = port.Verb;

            if (path == null)
            {
                var error = "Path cannot be null";
                Log.Error("PathValidationFilter error: {Error}", error);
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            IReadOnlyList<HttpMethod> validHttpMethods = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete, HttpMethod.Head, HttpMethod.Options, HttpMethod.Patch };

            if (!validHttpMethods.Contains(verb))
            {
                var error = "Verb not supported";
                Log.Error("PathValidationFilter error: {Error}", error);
                return (T)port.AppendFault(new ArgumentException(error));
            }

            return port;
        }
    }
}
