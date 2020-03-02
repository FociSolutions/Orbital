using Orbital.Mock.Server.Models;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Pipelines.Ports.Interfaces
{
    /// <summary>
    /// Interface representation of a port that is capable to become faulted
    /// </summary>
    public interface IFaultablePort
    {
        /// <summary>
        /// A collection of faults thrown by filters
        /// </summary>
        ICollection<string> Faults { get; set; }
        /// <summary>
        /// True if the collection of faults is not empty
        /// </summary>
        bool IsFaulted { get; }

        /// <summary>
        /// Add the given exception to the given port as a fault
        /// </summary>
        /// <param name="e">Exception to add to the port as a fault</param>
        /// <returns>The port with added exception</returns>
        IFaultablePort AppendFault(Exception e);
    }
}
