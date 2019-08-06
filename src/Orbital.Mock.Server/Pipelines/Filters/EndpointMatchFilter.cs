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
    internal class EndpointMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IPathValidationPort, IScenariosPort
    {
        /// <summary>
        /// Process that filters the list of Scenarios, leaving only scenarios
        /// who's verb and path match the incoming request.
        /// </summary>
        /// <param name="port"></param>
        /// <returns></returns>
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                var error = "Pipeline port is not valid";
                Log.Error("EndpointMatchFilter Error: {Error}", error);
                return port;
            }

            var path = port.Path;
            var verb = port.Verb.ToUpper();

            var rx = new Regex($"{path}$");

            var scenarioList = port.Scenarios.Where(s => s.Verb.ToUpper().Equals(port.Verb) && rx.IsMatch(s.Path));

            port.Scenarios = scenarioList.ToList();
            return port;
        }
    }
}
