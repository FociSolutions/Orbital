using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using Serilog;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class PathValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort
    {
        private readonly List<HttpMethod> VALIDMETHODS = new List<HttpMethod> { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete };
        /// <summary>
        /// Checks if a valid path is provided. Throws a fault otherwise
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {

            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var path = port.Path;
            var verb = port.Verb;

            if (path == null)
            {
                var error = "Path cannot be null";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            if (!VALIDMETHODS.Contains(verb))
            {
                var error = "Verb not supported";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentException(error));
            }

            return port;
        }
    }
}
