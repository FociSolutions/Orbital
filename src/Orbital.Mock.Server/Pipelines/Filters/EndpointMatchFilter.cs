using System;
using System.Linq;
using System.Text.RegularExpressions;

using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

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

            port.Scenarios = port.Scenarios.Where(s => s.Verb == verb && MatchParameterizedUrl(s.Path, path)).ToList();

            return port;
        }
        
        /// <summary>
        /// Matches a URL which could be parameterized (e.g. /pets/{id}/test)
        /// </summary>
        /// <param name="parameterizedPath">The parameterized path</param>
        /// <param name="pathToMatch">The path to match against</param>
        /// <returns></returns>
        private static bool MatchParameterizedUrl(string parameterizedPath, string pathToMatch)
        {
            // ensure that /test/, test/, //test//test, /test are equivalent via StringSplitOptions.RemoveEmptyEntries
            var pathParts = parameterizedPath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var needlePathParts = pathToMatch.Split('/', StringSplitOptions.RemoveEmptyEntries);

            return pathParts.Length == needlePathParts.Length && !pathParts.Where((endpoint, i) =>
                       !Regex.IsMatch(endpoint, @"(\{.+\})") && !needlePathParts[i].Equals(endpoint)).Any();
        }
    }
}