using Newtonsoft.Json;
using Orbital.Mock.Server.Models.Converters;
using Orbital.Mock.Server.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models
{
    public class Policy : IEquatable<Policy>, IPolicy
    {
        [JsonProperty("type")]
        public PolicyType Type { get; set; }

        [JsonProperty("attributes")]
        public IDictionary<string, string> Attributes { get; set; }

        public bool Equals(Policy other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.Attributes.Equals(other.Attributes);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Attributes);
        }
    }
}
