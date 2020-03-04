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

        public override bool Equals(object obj)
        {
            return this.Equals(obj as Scenario);
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
