using System;

using Newtonsoft.Json;

using Orbital.Mock.Definition.Rules.Interfaces;

namespace Orbital.Mock.Definition.Rules
{
    public class PathTypeRule : IEquatable<PathTypeRule>, IRule
    {
        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("type")]
        public ComparerType Type { get; set; }

        public override bool Equals(object? obj)
        {
            if (obj == null) return false;

            return Equals(obj as PathTypeRule);
        }

        public bool Equals(PathTypeRule other)
        {
            return other != null &&
                this.Type == other.Type &&
                this.Path.Equals(other.Path);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Type, Path);
        }
    }
}
