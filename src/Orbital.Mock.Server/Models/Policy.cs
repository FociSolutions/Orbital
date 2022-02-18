using System;

using Orbital.Mock.Server.Models.Interfaces;

using Newtonsoft.Json;

namespace Orbital.Mock.Server.Models
{
    public class Policy : IEquatable<Policy>, IPolicy
    {
        [JsonProperty("type")]
        public PolicyType Type { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }

        public bool Equals(Policy other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.Value.Equals(other.Value);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Value);
        }
    }
}
