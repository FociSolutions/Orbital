using System;
using Orbital.Mock.Server.Pipelines.Filters.Interfaces;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System.Diagnostics.CodeAnalysis;
using Serilog;

namespace Orbital.Mock.Server.Pipelines.Filters.Bases
{
    [ExcludeFromCodeCoverage]
    public abstract class FaultableBaseFilter<T> : IFilter<T> where T : IFaultablePort
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
        protected static bool IsPortValid(T inPort, out T outPort)
        {
            if (inPort == null)
            {
                outPort = default(T);
                return false;
            }

            outPort = inPort;

            return !inPort.IsFaulted;
        }

        /// <summary>
        /// Checks if the pipeline is valid via checking the pipeline's port validity.
        /// </summary>
        /// <typeparam name="T">The type of the messages in the pipeline</typeparam>
        /// <param name="port">The pipeline's port</param>
        /// <param name="className">The calling classes name to use in logging statements</param>
        /// <returns>Whether the pipeline is valid</returns>
        protected static bool IsPipelineValid<T>(ref T port, Type className) where T : IFaultablePort, IScenariosPort
        {
            if (FaultableBaseFilter<T>.IsPortValid(port, out port)) return true;
            var error = "Pipeline port is not valid";
            Log.Error("{FullName} Error: {Error}", className.FullName, error);
            return false;
        }
    }
}
