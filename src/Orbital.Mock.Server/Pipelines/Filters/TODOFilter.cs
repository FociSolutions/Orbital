using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Linq;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    internal class TODOFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, ITODOPort
    {
        /// <inheritdoc />
        public override T Process(T port)
        {
            if (!IsPortValid(port, out port))
            {
                return port;
            }

            var message = port.TODO;
            if (message == "")
            {
                var error = "Request message body cannot be null";
                return (T)port.AppendFault(new ArgumentNullException(error));
            }

            return port;
        }
    }
}
