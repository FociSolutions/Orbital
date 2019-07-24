using Orbital.Mock.Server.Pipelines.Filters.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.Pipelines.Filters.Bases
{
    [ExcludeFromCodeCoverage]
    internal abstract class FaultableBaseFilter<T> : IFilter<T> where T : IFaultablePort
    {
        //protected readonly ILogger logger = LogManager.GetCurrentClassLogger();

        /// <inheritdoc />
        public abstract T Process(T port);

        /// <summary>
        /// If the given port is null, create a new port with appropriate fault, pass the new port to outPort and return false;
        /// If the given port is faulted, pass the provided port to outPort and return false;
        /// Otherwise, pass the provided port to outPort and return true
        /// </summary>
        /// <param name="inPort">The port to check if it is valid</param>
        /// <param name="outPort">Message processor port</param>
        /// <returns>True if port is valid, false otherwise</returns>
        protected bool IsPortValid(T inPort, out T outPort)
        {
            if (inPort == null)
            {
                outPort = default(T);
                return false;
            }

            outPort = inPort;

            return !inPort.IsFaulted;
        }
    }
}
