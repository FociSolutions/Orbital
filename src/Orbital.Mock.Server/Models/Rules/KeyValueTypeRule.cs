using Newtonsoft.Json;
using Orbital.Mock.Server.Models.Converters;
using Orbital.Mock.Server.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Models.Rules
{
    public class KeyValueTypeRule : IEquatable<KeyValueTypeRule>, IRule
    {
        [JsonProperty("key")]
        public string Key { get; set; }
        [JsonProperty("value")]
        public string Value { get; set; }

        [JsonProperty("type")]
        public ComparerType Type { get; set; }

        public KeyValuePair<string, string> GenerateKeyValuePair()
        {
            return new KeyValuePair<string, string>(Key, Value);
        }

        public override bool Equals(object? obj)
        {
            if (obj == null) return false;

            return Equals(obj as KeyValueTypeRule);
        }

        public bool Equals(KeyValueTypeRule other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.Key.Equals(other.Key) &&
                this.Value.Equals(other.Value);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Key, Value);
        }
    }
}
