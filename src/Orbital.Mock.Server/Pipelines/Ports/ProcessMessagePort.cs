using Microsoft.AspNetCore.Http;
using Orbital.Mock.Server.Models;
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
    internal class ProcessMessagePort : ITODOPort, IFaultablePort, IPathValidationPort, IScenariosPort, IQueryMatchPort
    {


        public string TODO { get; set; }
        public ICollection<string> Faults { get; set; }

        public bool IsFaulted => Faults != null && Faults.Count != 0;

        public string Path { get; set; }
        public string Verb { get; set; }

        public List<Scenario> Scenarios { get; }
        public List<string> QueryMatchResults { get; set; }
        public IQueryCollection Query { get; set; }

        public ProcessMessagePort(List<Scenario> scenarios)
        {
            this.Scenarios = scenarios;
        }
        public IFaultablePort AppendFault(Exception e)
        {
            var fault = e.Message;

            Faults = Faults ?? new List<string>();
            Faults.Add(fault);

            return this;
        }
    }
}
