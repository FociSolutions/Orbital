using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class ValidationFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IValidationPort
    {


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
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            if (verb == "")
            {
                var error = "Verb cannot be null";
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            return port;

        }

    }
}
