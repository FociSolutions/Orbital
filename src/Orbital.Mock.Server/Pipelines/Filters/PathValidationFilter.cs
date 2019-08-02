using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using Serilog;
using Microsoft.AspNetCore.Http;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class PathValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort
    {
        private readonly List<string> VALIDMETHODS = new List<string> { HttpMethods.Get.ToUpper(), HttpMethods.Put.ToUpper(), HttpMethods.Post.ToUpper(), HttpMethods.Delete.ToUpper() };
        /// <summary>
        /// Checks if a valid path is provided. Throws a fault otherwise
        /// </summary>
        /// <param name="port">Receives the values of Path and Verb and pass them to its port</param>
        /// <returns></returns>
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

            if (verb == null || !VALIDMETHODS.Contains(verb.ToUpper()))
            {
                var error = "Verb not supported";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentException(error));
            }

            return port;
        }
    }
}
