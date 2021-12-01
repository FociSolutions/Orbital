using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models
{
    public class Scenario : IEquatable<Scenario>
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("metadata")]
        public MetadataInfo Metadata { get; set; }
        [JsonProperty("verb")]
        public HttpMethod Verb { get; set; }
        [JsonProperty("path")]
        public string Path { get; set; }
        [JsonProperty("response")]
        public MockResponse Response { get; set; }
        [JsonProperty("requestMatchRules")]
        public RequestMatchRules RequestMatchRules { get; set; }
        [JsonProperty("policies")]
        public ICollection<Policy> Policies { get; set; }

        [JsonProperty("defaultScenario")]
        public bool DefaultScenario { get; set; } = false;

        [JsonProperty("tokenRule")]
        public TokenRuleInfo TokenRule { get; set; }

        public bool RequiresTokenValidation()
        {
            return TokenRule.ValidationType == TokenValidationType.JWT_VALIDATION ||
                   TokenRule.ValidationType == TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH;
        }

        public bool RequiresTokenRequestMatch()
        {
            return TokenRule.ValidationType == TokenValidationType.JWT_VALIDATION_AND_REQUEST_MATCH ||
                   TokenRule.ValidationType == TokenValidationType.REQUEST_MATCH;
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
