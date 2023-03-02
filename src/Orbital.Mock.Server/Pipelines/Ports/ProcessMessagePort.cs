using System;
using System.Linq;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Diagnostics.CodeAnalysis;

using Orbital.Mock.Definition;
using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Match;
using Orbital.Mock.Definition.Policies;
using Orbital.Mock.Definition.Response;

using Orbital.Mock.Server.Pipelines.Ports.Interfaces;

using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

namespace Orbital.Mock.Server.Pipelines.Ports
{
    /// <summary>
    /// Intermediate interface to encapsulate all interfaces extended by ProcessMessagePort
    /// </summary>
    public interface IProcessMessagePort : IFaultablePort, IPathValidationPort, IScenariosPort,
                                           IQueryMatchPort, IBodyMatchPort, IHeaderMatchPort, IUrlMatchPort,
                                           IResponseSelectorPort, IPolicyPort, ITokenParsePort, ITokenValidationPort,
                                           ITokenRequestMatchPort
    { }

    /// <summary>
    /// Model class representing a port for message processor pipelines
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class ProcessMessagePort : IProcessMessagePort
    {
        /// <summary>
        /// A lock used to stop the database from corruption when multiple writers are using it. This is temporary
        /// and will be removed when the database is changed.
        /// </summary>
        public static object databaseLock = new object();
        public ProcessMessagePort()
        {
            this.Scenarios = new List<Scenario>();
            this.QueryMatchResults = new List<MatchResult>();
            this.HeaderMatchResults = new List<MatchResult>();
            this.BodyMatchResults = new List<MatchResult>();
            this.URLMatchResults = new List<MatchResult>();
            this.TokenValidationResults = new List<MatchResult>();
            this.TokenMatchResults = new List<MatchResult>();
            this.Query = new List<KeyValuePair<string, string>>();
            this.Headers = new List<KeyValuePair<string, string>>();
            this.Policies = new List<Policy>();
        }

        public ICollection<string> Faults { get; set; }

        public bool IsFaulted => Faults != null && Faults.Count != 0;
        public MatchResult EndpointMatchRule { get; set; }

        public string Path { get; set; }
        public HttpMethod Verb { get; set; }

        public ICollection<MatchResult> HeaderMatchResults { get; set; }
        public IEnumerable<KeyValuePair<string, string>> Headers { get; set; }

        public IEnumerable<Scenario> Scenarios { get; set; }

        public string Body { get; set; }
        public ICollection<MatchResult> BodyMatchResults { get; set; }

        public ICollection<MatchResult> QueryMatchResults { get; set; }

        public ICollection<MatchResult> URLMatchResults { get; set; }

        public IEnumerable<KeyValuePair<string, string>> Query { get; set; }

        public MockResponse SelectedResponse { get; set; }
        public ComparerType Type { get; set; }
        public ICollection<Policy> Policies { get; set; }
        public PolicyType PolicyType { get; set; }

        public string TokenScheme { get; set; }
        public string TokenParameter { get; set; }
        public JwtSecurityToken Token { get; set; }
        public ICollection<MatchResult> TokenValidationResults { get; set; }
        public ICollection<MatchResult> TokenMatchResults { get; set; }
        public bool IsAuthenticated => !IsInvalidated;
        public bool IsInvalidated { get; private set; } = false;

        public bool CheckAuthentication => Scenarios.Any(x => x.RequiresTokenValidation());

        public IFaultablePort AppendFault(Exception e)
        {
            var fault = e.Message;

            Faults ??= new List<string>();
            Faults.Add(fault);

            return this;
        }

        public void InvalidateToken()
        {
            IsInvalidated = true;
            Token = null;
        }
    }
}
