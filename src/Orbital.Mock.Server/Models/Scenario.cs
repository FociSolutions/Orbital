using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Models
{
    public class Scenario : IEquatable<Scenario>
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("metadata")]
        public MetadataInfo Metadata { get; set; }
        [JsonProperty("verb")]
        [JsonConverter(typeof(StringEnumConverter))]
        public HttpMethod Verb { get; set; }
        [JsonProperty("path")]
        public string Path { get; set; }
        [JsonProperty("response")]
        public MockResponse Response { get; set; }
        [JsonProperty("requestMatchRules")]
        public RequestMatchRules RequestMatchRules { get; set; }

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
