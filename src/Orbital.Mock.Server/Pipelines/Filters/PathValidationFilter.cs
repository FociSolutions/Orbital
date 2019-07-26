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
        where T : IFaultablePort, IPathValidationPort
    {
        private readonly IMemoryCache cache;
        private const string MOCKIDS = "mockids";
        private readonly List<string> VALIDMETHODS = new List<string> { HttpMethods.Get, HttpMethods.Put, HttpMethods.Post, HttpMethods.Delete };

        public PathValidationFilter(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public override T Process(T port)
        {

            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var path = port.Path;
            var verb = port.Verb;

            if (path == "")
            {
                var error = "Path cannot be null";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            if (VALIDMETHODS.Contains(verb))
            {
                var error = "Verb not supported";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentNullException(error));
            }



            cache.TryGetValue(MOCKIDS, out List<string> KeyList);

            if (KeyList == null)
            {
                var error = "No Mockdefinitions found";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            var mockDefinitionsList = KeyList.Select(e => cache.Get(e) as MockDefinition).ToList();
            var scenarioList = mockDefinitionsList.SelectMany(e => e.Scenarios).ToList();

            var rx = new Regex(@path);

            if (!scenarioList.Where(e => rx.IsMatch(e.Path)).Any())
            {
                var error = "No matching paths found";
                Log.Error(error);
                return (T)port.AppendFault(new ArgumentNullException(error));
            }
            return port;
        }
    }
}
