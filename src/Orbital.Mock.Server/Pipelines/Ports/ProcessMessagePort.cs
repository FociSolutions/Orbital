using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Orbital.Mock.Server.Models;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics.CodeAnalysis;

namespace Orbital.Mock.Server.Pipelines.Ports
{
    /// <summary>
    /// Model class representing a port for message processor pipelines
    /// </summary>
    [ExcludeFromCodeCoverage]
    internal class ProcessMessagePort : IFaultablePort, IPathValidationPort, IScenariosPort, IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort, IResponseSelectorPort
    {
        public ProcessMessagePort()
        {
            this.Scenarios = new List<Scenario>();
            this.QueryMatchResults = new List<string>();
            this.HeaderMatchResults = new List<string>();
            this.BodyMatch = new List<string>();
            this.Query = new Dictionary<string, string>();
            this.Headers = new Dictionary<string, string>();
        }

        public ICollection<string> Faults { get; set; }

        public bool IsFaulted => Faults != null && Faults.Count != 0;

        public string Path { get; set; }
        public string Verb { get; set; }


        public IEnumerable<string> HeaderMatchResults { get; set; }
        public IEnumerable<KeyValuePair<string, string>> Headers { get; set; }

        public IEnumerable<Scenario> Scenarios { get; set; }
        public IEnumerable<string> BodyMatch { get; set; }
        public string Body { get; set; }

        public IEnumerable<string> QueryMatchResults { get; set; }
        public IEnumerable<KeyValuePair<string, string>> Query { get; set; }
        public MockResponse SelectedResponse { get; set; }

        public IFaultablePort AppendFault(Exception e)
        {
            var fault = e.Message;

            Faults = Faults ?? new List<string>();
            Faults.Add(fault);

            return this;
        }


    }
}
