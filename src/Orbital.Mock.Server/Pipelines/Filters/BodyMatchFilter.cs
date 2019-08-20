using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Serilog;
using System.Linq;


namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class BodyMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IBodyMatchPort, IScenariosPort
    {
        /// <summary>
        /// Process that returns the port after adding a list of scenario Id's
        /// that have any body rule that matches the body of the request.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPipelineValid(ref port, GetType())) return port;

            try
            {
                var bodyObject = JObject.Parse(port.Body);
                port.BodyMatch = port.Scenarios.Where(
                    s => s.RequestMatchRules.BodyRules.Any(bodyRule => JObject.DeepEquals(bodyRule.Rule, bodyObject))
                    ).Select(s => s.Id)
                    .ToList();
            }
            catch (JsonReaderException e)
            {
                Log.Information("Unable to parse request body to JSON, {Body}", port.Body);
            }

            return port;
        }
    }
}