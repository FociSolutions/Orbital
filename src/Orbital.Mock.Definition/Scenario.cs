using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;

using Newtonsoft.Json;

using Orbital.Mock.Definition.Rules;
using Orbital.Mock.Definition.Tokens;
using Orbital.Mock.Definition.Policies;
using Orbital.Mock.Definition.Response;

namespace Orbital.Mock.Definition
{
    public class Scenario : IEquatable<Scenario>
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("verb")]
        public HttpMethod Verb { get; set; }

        [JsonProperty("metadata")]
        public MetadataInfo Metadata { get; set; }
        
        [JsonProperty("requestMatchRules")]
        public RequestMatchRules RequestMatchRules { get; set; }

        [JsonProperty("tokenRule")]
        public TokenRules TokenRules { get; set; }

        [JsonProperty("response")]
        public MockResponse Response { get; set; }

        [JsonProperty("policies")]
        public ICollection<Policy> Policies { get; set; }

        [JsonProperty("defaultScenario")]
        public bool DefaultScenario { get; set; } = false;

        public bool RequiresTokenValidation()
        {
            return TokenRules.ValidationType == TokenValidationType.JWT_VALIDATION ||
                   TokenRules.ValidationType == TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH;
        }

        public bool RequiresTokenRequestMatch()
        {
            return TokenRules.ValidationType == TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH ||
                   TokenRules.ValidationType == TokenValidationType.REQUEST_MATCH;
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as Scenario);
        }

        public bool Equals(Scenario other)
        {
            return other != null && Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }
    }
}
