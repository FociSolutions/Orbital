using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            port.BodyMatch = port.Scenarios.Where(
                s => s.RequestMatchRules.BodyRules.Any(bodyRule => bodyRule.Rule.Equals(port.Body))
                ).Select(s => s.Id)
                .ToList();

            return port;
        }
    }
}
