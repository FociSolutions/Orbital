using Newtonsoft.Json;
using Orbital.Mock.Server.Models.Converters;
using Orbital.Mock.Server.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models.Rules
{
    public class KeyValuePairRule : IEquatable<KeyValuePairRule>, IRule
    {
        [JsonConverter(typeof(KeyValueConverter))]
        [JsonProperty("rule")]
        public KeyValuePair<string, string> RuleValue { get; set; }

        [JsonProperty("type")]
        public ComparerType Type { get; set; }

        public bool Equals(KeyValuePairRule other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.RuleValue.Equals(other.RuleValue);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, RuleValue);
        }
    }
}
