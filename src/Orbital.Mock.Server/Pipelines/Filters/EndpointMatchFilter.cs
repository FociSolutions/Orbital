using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class EndpointMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort, IScenariosPort
    {
        /// <summary>
        /// Process that filters the list of Scenarios, leaving only scenarios
        /// who's verb and path match the incoming request.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            var path = port.Path;
            var verb = port.Verb;
            var rx = new Regex($"{path}$");
            var scenarioList = port.Scenarios.Where(s => s.Verb == verb && rx.IsMatch(s.Path));

            port.Scenarios = scenarioList.ToList();
            return port;
        }
    }
}