using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.Pipelines.Ports
{
    /// <summary>
    /// Model class representing a port for message processor pipelines
    /// </summary>
    [ExcludeFromCodeCoverage]
    internal class ProcessMessagePort : ITODOPort, IFaultablePort
    {

        public string TODO { get; set; }
        public ICollection<string> Faults { get; set; }

        public bool IsFaulted => Faults != null && Faults.Count != 0;


        public IFaultablePort AppendFault(Exception e)
        {
            var fault = e.Message;

            Faults = Faults ?? new List<string>();
            Faults.Add(fault);

            return this;
        }
    }
}
