using Orbital.Mock.Server.Pipelines.Ports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class JoinFilter
    {
        public ProcessMessagePort MergePorts(Tuple<ProcessMessagePort, ProcessMessagePort, ProcessMessagePort> ports)
        {
            ports.Item1.QueryMatchResults = ports.Item1.QueryMatchResults.Concat(ports.Item2.QueryMatchResults).Concat(ports.Item3.QueryMatchResults).ToList();
            ports.Item1.HeaderMatchResults = ports.Item1.HeaderMatchResults.Concat(ports.Item2.HeaderMatchResults).Concat(ports.Item3.HeaderMatchResults).ToList();
            ports.Item1.BodyMatch = ports.Item1.BodyMatch.Concat(ports.Item2.BodyMatch).Concat(ports.Item3.BodyMatch).ToList();
            return ports.Item1;
        }
    }
}
