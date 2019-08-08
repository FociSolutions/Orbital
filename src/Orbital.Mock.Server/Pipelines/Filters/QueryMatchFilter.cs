﻿using Microsoft.AspNetCore.Http.Internal;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class QueryMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IQueryMatchPort, IScenariosPort
    {
        /// <summary>
        /// Process that returns the port after adding a list of scenario Id's
        /// that have a query rule that matches the query of the request.
        /// </summary>
        /// <param name="port">The port containing necessary data</param>
        /// <returns>Port containing processed data</returns>
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var scenarios = port.Scenarios;
            var query = port.Query.ToDictionary(x => x.Key, x => x.Value);
            port.QueryMatchResults = scenarios.Where(
                 s => s.RequestMatchRules.QueryRules.All(qr => query.ContainsKey(qr.Key) && query[qr.Key].Equals(qr.Value))
            ).Select(scenario => scenario.Id).ToList();

            return port;
        }

    }
}
