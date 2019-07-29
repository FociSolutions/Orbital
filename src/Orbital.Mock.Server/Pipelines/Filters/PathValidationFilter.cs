using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class PathValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort, IScenariosPort
    {
        private readonly List<string> VALIDMETHODS = new List<string> { HttpMethods.Get, HttpMethods.Put, HttpMethods.Post, HttpMethods.Delete };

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
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            return port;
        }
    }
}
