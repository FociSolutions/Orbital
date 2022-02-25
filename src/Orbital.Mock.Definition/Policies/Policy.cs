using System;

using Newtonsoft.Json;

using Orbital.Mock.Definition.Policies.Interfaces;

namespace Orbital.Mock.Definition.Policies
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
